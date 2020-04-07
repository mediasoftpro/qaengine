using Jugnoon.qa;
using Jugnoon.Entity;
using System.Collections.Generic;
using System.IO;
using Jugnoon.Utility;
using Jugnoon.Scripts;
using Newtonsoft.Json;
using Jugnoon.BLL;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Framework;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Jugnoon.Settings;
using Jugnoon.Setup;
using System;
using Jugnoon.Localize;

namespace QAEngine.Areas.api.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class qaController : ControllerBase
    {
        ApplicationDbContext _context;
        private readonly IWritableOptions<Jugnoon.qa.Settings.General> _general_options;
        public qaController(
            IOptions<SiteConfiguration> settings,
            IMemoryCache memoryCache,
            ApplicationDbContext context,
            IStringLocalizer<GeneralResource> generalLocalizer,
            IWebHostEnvironment _environment,
            IHttpContextAccessor _httpContextAccessor,
            IWritableOptions<Jugnoon.qa.Settings.General> general_options,
            IOptions<General> generalSettings,
            IOptions<Aws> awsSettings,
            IOptions<Features> featureSettings,
            IOptions<Smtp> smtpSettings,
            IOptions<Media> mediaSettings,
            IOptions<Registration> registerSettings,
            IOptions<Jugnoon.qa.Settings.General> generalPhotosSettings
        )
        {
            // readable settings (global)
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.AwsSettings = awsSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.RegistrationSettings = registerSettings.Value;
            // readable settings specific to content
            Jugnoon.qa.Configs.GeneralSettings = generalPhotosSettings.Value;

            // writable configuration injectors
            _general_options = general_options;
           
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;
           
             SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [ActionName("load")]
        [HttpPost("load")]
        public async Task<ActionResult> load()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<QAEntity>(json);

            var _posts = await QABLL.LoadItems(_context, data);

            /* setup thumb path */
            foreach (var ph in _posts)
            {
                ph.author_url = UserUrlConfig.ProfileUrl(ph.author, Jugnoon.Settings.Configs.RegistrationSettings.uniqueFieldOption);
                ph.url = QAUrls.Prepare_QA_Url(ph, "");
                ph.customize_date = UtilityBLL.CustomizeDate(ph.created_at, DateTime.Now);
            }

            var _records = 0;
            var _categories = new List<JGN_Categories>();
            if (data.loadstats)
            {
               
                _categories = await CategoryBLL.LoadItems(_context, new CategoryEntity()
                {
                    id = 0,
                    type = (byte)CategoryBLL.Types.qa,
                    isenabled = EnabledTypes.All,
                    parentid = -1,
                    order = "level asc", // don't change this
                    issummary = false, 
                    isdropdown = true,
                    loadall = true // load all data
                });
            }

            if (data.id == 0)
                _records = await QABLL.Count(_context, data);


            return Ok(new { posts = _posts, records = _records, categories = _categories });
        }

        [HttpPost("load_reports")]
        public async Task<ActionResult> load_reports()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<QAEntity>(json);
            var _reports = await QABLL.LoadReport(_context, data);
            return Ok(new { data = _reports });
        }

        [HttpPost("getinfo")]
        public async Task<ActionResult> getinfo()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<QAEntity>(json);

            data.nofilter = true;
            data.issummary = false;
            data.isdropdown = false;

            var _posts = await QABLL.LoadItems(_context, data);
            if(_posts.Count > 0)
            {
                _posts[0].customize_date = UtilityBLL.CustomizeDate(_posts[0].created_at, DateTime.Now);
                _posts[0].qa_answers = await QAnswersBLL.Fetch_Answers(_context, _posts[0].id);
                foreach (var ans in _posts[0].qa_answers)
                {
                    ans.customize_date = UtilityBLL.CustomizeDate(ans.created_at, DateTime.Now);
                }
                _posts[0].author.img_url = UserUrlConfig.ProfilePhoto(_posts[0].author.Id, _posts[0].author.picturename, 0);
                // array of associate category list
                _posts[0].category_list = await CategoryContentsBLL.FetchContentCategoryList(_context, data.id, (byte)CategoryContentsBLL.Types.QA);
                return Ok(new { status = "success", post = _posts[0] });
            }
            else
            {
                return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_no_records"].Value });
            }
           
        }

        [HttpPost("postanswer")]
        public async Task<ActionResult> postanswer()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_QAnswers>(json);
            
            var model = data;

            byte isapproved = 1; // enable it bydefault
         
            if (Jugnoon.Settings.Configs.GeneralSettings.content_approval == 0)
            {
                isapproved = 0;
               
            }
            //XSS CLEANUP
            if (model.description == null)
            {
                return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_invalid_data"].Value });
            }
            string content = model.description; // UtilityBLL.CompressCode(txt_content.Text);
                                            // Process Contents -> links, bbcodes etc
            content = UGeneral.SanitizeText(content, false);
         
            var qst = new JGN_QAnswers();
            qst.description = content;
            qst.userid = model.userid;
            qst.qid = model.qid;
            qst.isapproved = isapproved;
            qst.isenabled = 1; // enable by default
            qst.isanswer = 0;
            qst.id = model.id;
            if (model.id == 0)
            {
                qst = await QAnswersBLL.Add(_context, qst, model.answers);
                qst.customize_date = UtilityBLL.CustomizeDate(qst.created_at, DateTime.Now);
            }
            else
            {
                await QAnswersBLL.Update(_context, qst);
            }
          
            return Ok(new { status = "success", record = qst });
        }

        [HttpPost("proc")]
        public async Task<ActionResult> proc()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Qa>(json);

            var model = data;

            if (model.title.Length < 5)
            {
                return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_invalid_title"].Value });
            }
            
            // validate tags
            if (Jugnoon.Settings.Configs.FeatureSettings.enable_tags && model.tags != null)
            {
                if (!TagsBLL.Validate_Tags(model.tags))
                {
                    return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_invalid_tags"].Value });
                }
            }

            if (model.categories != null && model.categories.Length == 0)
            {
                return Ok(new { status = "error", message = SiteConfig.generalLocalizer["_select"].Value });
            }

            //XSS CLEANUP

            string content = "";
            if (model.description != null)
                content = UGeneral.SanitizeText(model.description);
           
            var qst = new JGN_Qa();
            qst.title = model.title;
            qst.description = content;
            qst.categories = model.categories;

            if (model.tags != null)
                qst.tags = model.tags;

            if (model.isadmin)
            {
                qst.isapproved = model.isapproved;
                qst.isenabled = model.isenabled;
            }
            else
            {
                int isapproved = 1; // enable it bydefault
                if (Jugnoon.Settings.Configs.GeneralSettings.content_approval == 0)
                {
                    // Moderator Review Required
                    isapproved = 0;
                }
                qst.isapproved = (byte)isapproved;
                qst.isenabled = 1;
            }

            qst.userid = model.userid;

            if (model.id == 0)
            {
                // Ask new qa
                qst.comments = 0; // set default value
                qst = await QABLL.Add(_context, qst, model.isadmin);

            }
            else
            {
                qst.id = model.id;
                await QABLL.Update(_context, qst);
            }

            if (model.tags != null && model.tags != "")
            {
                // Process tags
                TagsBLL.Process_Tags(_context, model.tags, TagsBLL.Types.QA, 0);
            }

            qst.author_url = UserUrlConfig.ProfileUrl(qst.author, Jugnoon.Settings.Configs.RegistrationSettings.uniqueFieldOption);
            qst.url = QAUrls.Prepare_QA_Url(qst, "");

            return Ok(new { status = "success", record = qst, message = SiteConfig.generalLocalizer["_record_created"].Value });
        }

        [HttpPost("authorize_author")]
        public ActionResult authorize_author()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Qa>(json);
            var isaccess = QABLL.Check(_context, data.id, data.userid);
            return Ok(new { isaccess = isaccess });
        }

        [HttpPost("action")]
        public async Task<ActionResult> action()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<QAEntity>>(json);
            
            await QABLL.ProcessAction(_context, data);

            return Ok(new { status = "success", message = SiteConfig.generalLocalizer["_records_processed"].Value });
        }

        [HttpPost("ansaction")]
        public async Task<ActionResult> ansaction()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<JGN_QAnswers>>(json);
            
            foreach(var item in data)
            {
                await QAnswersBLL.Delete(_context, item);
            }

            return Ok(new { status = "success", message = SiteConfig.generalLocalizer["_records_processed"].Value });
        }

        #region Update Configuration API Calls

        [HttpPost("configs_general")]
        public ActionResult configs_general()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<Jugnoon.qa.Settings.General>(json);

            _general_options.Update(opt =>
            {
                opt.enable_public_questions = data.enable_public_questions;
            });

            return Ok(new
            {
                status = 200
            });
        }
        #endregion
    }
}
/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
