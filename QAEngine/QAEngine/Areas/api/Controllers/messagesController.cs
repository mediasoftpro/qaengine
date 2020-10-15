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
    public class messagesController : ControllerBase
    {
        ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        public messagesController(
          IOptions<SiteConfiguration> settings,
          IMemoryCache memoryCache,
          ApplicationDbContext context,
          IStringLocalizer<GeneralResource> sharedLocalizer,
          IWebHostEnvironment _environment,
          IHttpContextAccessor _httpContextAccessor,
          IOptions<General> generalSettings,
          IOptions<Aws> awsSettings,
          IOptions<Smtp> smtpSettings,
          IOptions<Features> featureSettings,
          IOptions<Media> mediaSettings,
          IEmailSender emailSender,
          UserManager<ApplicationUser> userManager
        )
        {
            // readable configuration
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.AwsSettings = awsSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;

            // other injectors
            _emailSender = emailSender;
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
            _context = context;
            SiteConfig.userManager = userManager;
            SiteConfig.generalLocalizer = sharedLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        [HttpPost("load")]
        public async Task<ActionResult> load()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<MessageEntity>(json);

            var _posts = await MessageBLL.LoadItems(_context, data);

            foreach (var item in _posts)
            {
                item.user.img_url = UserUrlConfig.ProfilePhoto(item.user.Id, item.user.picturename, 0);
                item.message.user.img_url = UserUrlConfig.ProfilePhoto(item.message.user.Id, item.message.user.picturename, 0);
            }

            return Ok(new { posts = _posts });
        }
        [HttpPost("load_recipents")]
        public async Task<ActionResult> load_recipents()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<MessageEntity>(json);
            //data.loadUserList = true;
            data.reply_id = 0; // only recipents initiate chat 
            var _posts = await MessageBLL.LoadItems(_context, data);

            foreach (var item in _posts)
            {
                item.user.img_url = UserUrlConfig.ProfilePhoto(item.user.Id, item.user.picturename, 0);
            }

            return Ok(new { posts = _posts });
        }

        [HttpPost("marked_as_read")]
        public async Task<ActionResult> marked_as_read()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var messages = JsonConvert.DeserializeObject<List<JGN_Messages_Recipents>>(json);

            foreach (var message in messages)
            {
                await MessageBLL.ReadMessage(_context, message.messageid);
            }
            return Ok(new { status = "success" });
        }



        [HttpPost("send_message")]
        public async Task<ActionResult> send_message()
        {
            var json = new StreamReader(Request.Body).ReadToEnd();
            var data = JsonConvert.DeserializeObject<JGN_Messages_Recipents>(json);

            var _message = await MessageBLL.sendMessage(_context, data);

            // receiver message info
            var info = await SiteConfig.userManager.FindByIdAsync(data.to_uid);
            if (info != null)
            {
                // await _emailSender.SendMessage(_context, model.ContactEmail, model);
            }

            // generate and push notification
            var notif = new JGN_Notifications()
            {
                sender_id = data.message.from_uid,
                notification_type = (byte)NotificationTypes.Message,
                title = "New Message Received",
                body = data.message.subject,
                href = Config.GetUrl(SystemDirectoryPaths.MessageUrl),
                recipient_id = data.to_uid
            };
            await NotificationBLL.postNotification(_context, notif);

            return Ok(new { status = "success", message = "Message Sent", record = _message });
        }

    }
}