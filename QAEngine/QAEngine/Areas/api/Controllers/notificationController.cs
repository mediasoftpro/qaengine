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
using QAEngine.Models;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using Jugnoon.Entity;
using Jugnoon.Services;
using Microsoft.AspNetCore.Identity;
using Jugnoon.Models;
using Jugnoon.Localize;

namespace QAEngine.Areas.api.Controllers
{

    [EnableCors("CorsPolicy")]
    [Route("api/[controller]")]
    [ApiController]
    public class notificationController : ControllerBase
    {
        ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        public notificationController(
          IOptions<SiteConfiguration> settings,
          IMemoryCache memoryCache,
          ApplicationDbContext context,
          IStringLocalizer<GeneralResource> sharedLocalizer,
          IWebHostEnvironment _environment,
          IHttpContextAccessor _httpContextAccessor,
          IOptions<General> generalSettings,
          IOptions<Smtp> smtpSettings,
          IOptions<Features> featureSettings,
          IOptions<Media> mediaSettings,
          IEmailSender emailSender
        )
        {
            // readable configuration
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;

            // other injectors
            _emailSender = emailSender;
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;
            SiteConfig.generalLocalizer = sharedLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [HttpPost("check_notifs")]
        public async Task<ActionResult> check_notifs()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<NotificationEntity>(json);

            var check_unread_notifications = await NotificationBLL.Count(_context, data);

            var check_unread_messages = await MessageBLL.Count(_context, new MessageEntity()
            {
                isRead = false,
                To = data.RecipentID,
                loadReply = false
            });

            return Ok(new { notifs = check_unread_notifications, message_notifs = check_unread_messages });
        }


        [HttpPost("mark_as_read")]
        public async Task<ActionResult> mark_as_read()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Notifications>(json);

            await NotificationBLL.ReadMessage(_context, data.id);

            return Ok(new { status = "success" });
        }

        [HttpPost("load_unread_notifs")]
        public async Task<ActionResult> load_unread_notifs()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<NotificationEntity>(json);

            var _posts = await NotificationBLL.LoadItems(_context, data);

            foreach (var item in _posts)
            {
                item.from.img_url = UserUrlConfig.ProfilePhoto(item.from.Id, item.from.picturename, 0);
            }

            return Ok(new { posts = _posts });
        }
    }
}