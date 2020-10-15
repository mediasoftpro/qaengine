using System;
using System.Collections.Generic;
using Jugnoon.Settings;
using Jugnoon.Utility;
using Jugnoon.BLL;
using System.IO;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Cors;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Jugnoon.Framework;
using Microsoft.Extensions.Localization;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Jugnoon.Localize;
using Jugnoon.qa;

namespace QAEngine.Areas.api.Controllers
{
    [EnableCors("CorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class analyticsController : ControllerBase
    {
        ApplicationDbContext _context;
        public analyticsController(
         IOptions<SiteConfiguration> settings,
         IMemoryCache memoryCache,
         ApplicationDbContext context,
         IStringLocalizer<GeneralResource> generalLocalizer,
         IWebHostEnvironment _environment,
         IHttpContextAccessor _httpContextAccessor,
         IOptions<General> generalSettings,
         IOptions<Aws> awsSettings,
         IOptions<Smtp> smtpSettings,
         IOptions<Features> featureSettings,
         IOptions<Media> mediaSettings
       )
        {
            // readable configuration
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.AwsSettings = awsSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;
           
            // other injectors
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;

            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [HttpPost("load_stats")]
        public async Task<ActionResult> load_stats()
        {
            var _qa = await QABLL.Count(_context, new QAEntity()
            {
                ispublic = true
            });

            var _featured_qa = await QABLL.Count(_context, new QAEntity()
            {
                ispublic = true,
                isfeatured = FeaturedTypes.Featured,
                nofilter = false
            });

            var _blogs = await Jugnoon.Blogs.BlogsBLL.Count(_context, new Jugnoon.Blogs.BlogEntity()
            {
                ispublic = true
            });

            var _users = await UserBLL.Count(_context, new Jugnoon.Entity.MemberEntity()
            {
                nofilter = true
            });

            return Ok(new { qa = _qa, featured = _featured_qa, blogs = _blogs, users = _users });
        }
    }
}