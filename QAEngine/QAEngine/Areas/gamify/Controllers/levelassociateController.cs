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
using Jugnoon.Gamify;
using Jugnoon.Settings;
using Jugnoon.Localize;

namespace QAEngine.Areas.gamify.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("gamify/[controller]")]
    [ApiController]
    public class levelassociateController : ControllerBase
    {
        ApplicationDbContext _context;

        public levelassociateController(
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

        [HttpPost("add")]
        public ActionResult add()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<List<JGN_Badges_LevelAssociates>>(json);

            GALevelAssociateBLL.RemoveAll(_context, data[0].levelid);
            foreach (var item in data)
            {
                GALevelAssociateBLL.Add(_context, item);
            }

            return Ok(new { status = "success", record = data, message = "Record processed successfully" });
        }

        [HttpPost("load")]
        public async Task<IActionResult> load()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<LevelAssociateEntity>(json);

            var _posts = await GALevelAssociateBLL.Load(_context, data);

            return Ok(new { posts = _posts });
        }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
