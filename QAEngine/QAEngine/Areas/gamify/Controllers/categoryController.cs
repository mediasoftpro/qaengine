using Jugnoon.Utility;
using System.Collections.Generic;
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
using Jugnoon.Settings;
using Jugnoon.Gamify;
using Jugnoon.Localize;

namespace QAEngine.Areas.gamify.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("gamify/[controller]")]
    [ApiController]
    public class categoryController : ControllerBase
    {
        ApplicationDbContext _context;

        public categoryController(
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
            var data = JsonConvert.DeserializeObject<GACategoryEntity>(json);

            var _posts = await GA_CategoryBLL.Load(_context, data);

            var _records = 0;
            if (data.id == 0)
                _records = GA_CategoryBLL.Count(_context, data);


            return Ok(new { posts = _posts, records = _records });
        }

        [HttpPost("add")]
        public ActionResult add()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<JGN_BadgeCategories>>(json);

            foreach(var category in data)
            {
                if(category.id > 0)
                {
                    GA_CategoryBLL.Update(_context, category);
                }
                else
                {
                    var obj = GA_CategoryBLL.Add(_context, category);
                    category.id = obj.id;
                }
                /*if(category.isdeleted && category.id > 0)
                {
                    GA_CategoryBLL.Delete(category.id);
                }
                else if(category.edit && category.id > 0)
                {
                    GA_CategoryBLL.Update(category);
                }
                else if(category.id == 0)
                {
                    var obj = GA_CategoryBLL.Add(category);
                    category.id = obj.id;
                }
                */
            }

            return Ok(new { status = "success", record = data, message = "Record processed successfully" });

        }

        [HttpPost("maxid")]
        public ActionResult action()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<GACategoryEntity>>(json);

            GA_CategoryBLL.ProcessAction(_context, data);

            return Ok(new { status = "success", message = "Operation performed successfully" });
        }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
