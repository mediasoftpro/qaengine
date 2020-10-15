using Jugnoon.Utility;
using System.Collections.Generic;
using System.Linq;
using System.IO;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Framework;
using Microsoft.Extensions.Localization;
using QAEngine.Models;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Features;
using Jugnoon.Settings;
using Jugnoon.Gamify;
using Jugnoon.Localize;

namespace QAEngine.Areas.gamify.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("gamify/[controller]")]
    [ApiController]
    public class badgeController : ControllerBase
    {
        ApplicationDbContext _context;
        private static readonly FormOptions _defaultFormOptions = new FormOptions();
        public badgeController(
        IOptions<SiteConfiguration> settings,
        IMemoryCache memoryCache,
        ApplicationDbContext context,
        IStringLocalizer<GeneralResource> generalLocalizer,
        IWebHostEnvironment _environment,
        IOptions<General> generalSettings,
        IHttpContextAccessor _httpContextAccessor
        )
        {
            // content specific settings
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;

            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;
           
             SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [HttpPost("load")]
        public async Task<IActionResult> load()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BadgeEntity>(json);

            // load all badges
            var _posts = await BadgeBLL.Load(_context, data);
            // load all categories
            var _categories = await GA_CategoryBLL.Load(_context , new GACategoryEntity()
            {
            });

            foreach (var item in _posts)
            {
                item.img_url = UrlConfig.Return_Badge_Image(item.icon);
            }

            var _records = 0;
            if (data.id == 0)
                _records = BadgeBLL.Count(_context, data);

            
            return Ok(new { posts = _posts, records = _records, categories = _categories });
        }

        [HttpPost("getinfo")]
        public async Task<IActionResult> getinfo()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<BadgeEntity>(json);

            // load all badges
            var _posts = await BadgeBLL.Load(_context, data);
            
            foreach (var item in _posts)
            {
                item.img_url = UrlConfig.Return_Badge_Image(item.icon);
            }
            
            return Ok(new { posts = _posts });
        }

        [HttpPost("add")]
        public async Task<ActionResult> add()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Badges>(json);
            
            if(data.id > 0)
            {
                /* update record */
                data = await BadgeBLL.Update(_context, data);
            }
            else
            {
                /* add record */
               data = await BadgeBLL.Add(_context, data);
            }

            data.img_url = UrlConfig.Return_Badge_Image(data.icon);

            return Ok(new { status = "success", record = data, message = "Record processed successfully" });
        }

        [HttpPost("action")]
        public ActionResult action()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<BadgeEntity>>(json);

            BadgeBLL.ProcessAction(_context, data);
            
            return Ok(new { status = "success", message = "Operation performed successfully" });
        }

        [HttpPost("removephoto")]
        public ActionResult removephoto()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<BadgeEntity>>(json);

            string dirPath = SiteConfig.Environment.ContentRootPath + "/contents/badges/";
            if (System.IO.File.Exists(dirPath + data[0].icon))
                System.IO.File.Delete(dirPath + data[0].icon);

            return Ok(new { status = "success", message = "Operation performed successfully" });
        }

        [HttpPost("award")]
        public ActionResult award()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<JGN_User_Badges>>(json);

            ga_core_bll.Trigger_Item(_context, data[0].userid, data[0].badge_id);

            return Ok(new { status = "success", message = "Operation completed" });
        }

        [HttpPost("updatephoto")]
        public ActionResult updatephoto()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<BadgeEntity>>(json);

            foreach(var item in data)
            {
                BadgeBLL.Update_Field_V3(_context, item.id, item.icon, "icon");
            }

            return Ok(new { status = "success", message = "Photo information upated" });

        }

        [HttpPost("maxid")]
        public ActionResult maxid()
        {
            int maxlevel = _context.JGN_Badges.Max(p => p.ilevel);
            maxlevel++;

            return Ok(new { status = "success", level = maxlevel.ToString() });
        }

	}
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
