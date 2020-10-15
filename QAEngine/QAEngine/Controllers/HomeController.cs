using System;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using QAEngine.Models;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using Jugnoon.Framework;
using Jugnoon.Utility;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Jugnoon.Models;
using Jugnoon.Services;
using Microsoft.AspNetCore.Localization;
using Jugnoon.Settings;
using Jugnoon.Meta;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Jugnoon.Localize;
using ActiveCampaignApiClient;
using ZendeskApi_v2.Models.Tickets;
using System.Collections.Generic;

namespace QAEngine.Controllers
{
    public class HomeController : Controller
    {
        ApplicationDbContext _context;
        private readonly IEmailSender _emailSender;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private ActiveCompaign _activeCompaignSettings;
        private Zendesk _zendeskSettings;
        private readonly IActiveCampaignClient _activeCampaignClient;
        public HomeController(
           IOptions<SiteConfiguration> settings,
           IMemoryCache memoryCache,
           ApplicationDbContext context,
           IStringLocalizer<GeneralResource> generalLocalizer,
           IEmailSender emailSender,
           IOptions<General> generalSettings,
           IOptions<Features> featureSettings,
           IOptions<Smtp> smtpSettings,
           IOptions<Media> mediaSettings,
           IOptions<ActiveCompaign> activeCompanySettings,
           IOptions<Zendesk> zendeskSettings,
           IWebHostEnvironment _environment,
           IHttpContextAccessor _httpContextAccessor,
           SignInManager<ApplicationUser> signInManager,
           IActiveCampaignClient activeCampaignClient
           )
        {
            _context = context;
            _emailSender = emailSender;
            _signInManager = signInManager;
            _activeCompaignSettings = activeCompanySettings.Value;
            _activeCampaignClient = activeCampaignClient;
            _zendeskSettings = zendeskSettings.Value;
            // readable configuration
            Configs.GeneralSettings = generalSettings.Value;
            Configs.SmtpSettings = smtpSettings.Value;
            Configs.FeatureSettings = featureSettings.Value;
            Configs.MediaSettings = mediaSettings.Value;

            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
             SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        public async Task<ActionResult> Index(string page, string returnUrl = null)
        {

            // check for installation flag
            if (!Configs.GeneralSettings.init_wiz)
            {
                return Redirect("/installation/configs/");
            }

            // skip static pages
            if (page != null)
            {
                var static_pages_extensions = new string[] { ".css", ".js", ".jpg", ".png", ".ico", ".gif", ".mp4" };
                foreach (var extension in static_pages_extensions)
                {
                    if (page.EndsWith(extension))
                    {
                        return View();
                    }
                }
                if (page == "404")
                    Response.StatusCode = 404;

                ViewData["Page"] = page;
            }
            else
            {
                ViewData["Page"] = "index";
            }

            string referer = Request.Headers["Referer"];
            if (referer != null)
                ViewData["referrer"] = referer.ToString();

            /* Update culture */
            if (HttpContext.Request.Query["lng"].Count > 0)
            {
                Response.Cookies.Append(
                   CookieRequestCultureProvider.DefaultCookieName,
                   CookieRequestCultureProvider.MakeCookieValue(new RequestCulture(HttpContext.Request.Query["lng"].ToString())),
                   new CookieOptions { Expires = DateTimeOffset.UtcNow.AddYears(1) }
               );
               return Redirect(Config.GetUrl());
            }


            /* Update demo themes */
            /*if (HttpContext.Request.Query["theme"].Count > 0)
            {
                Jugnoon.Utility.Helper.Cookie.WriteCookie("VSKTheme", HttpContext.Request.Query["theme"].ToString());

                return Redirect(Config.GetUrl());
            }*/

            // authorization check
            if (page != null)
            {
                var pages = Data.ReturnStaticPagesData();
                foreach (var pg in pages)
                {
                    if (pg.pagename == page)
                    {
                       
                    }
                }
            }

            // sign out
            if (page == "signout")
            {
                await _signInManager.SignOutAsync();
                return Redirect("/");
            }

            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult contact(ContactUsViewModel model)
        {
            ViewData["Page"] = "contact";
            if (ModelState.IsValid)
            {
                if (_zendeskSettings.enable)
                {
                    ZendeskApi_v2.ZendeskApi api = new ZendeskApi_v2.ZendeskApi(_zendeskSettings.url, _zendeskSettings.user,
                     _zendeskSettings.token, _zendeskSettings.locale);

                    string encodedEmail = System.Net.WebUtility.UrlEncode(model.EmailAddress);
                    long id = 0;
                    /*ZendeskApi_v2.Models.Search.SearchResults resultsOld = api.Search.SearchFor(string.Format("requester:{0}", encodedEmail));

                    if (resultsOld != null && resultsOld.Count > 0)
                        id = resultsOld.Results[0].Id;*/

                    // Ticket is not already created. lets create it now.
                    try
                    {
                        IndividualTicketResponse response = api.Tickets.CreateTicket
                        (
                            new ZendeskApi_v2.Models.Tickets.Ticket
                            {

                                Status = "new",
                                Subject = "Contact Us",
                                Tags = new List<string>() { "contactus" },
                                Comment = new ZendeskApi_v2.Models.Tickets.Comment
                                {
                                    Body = model.Message,
                                    Public = false,
                                },
                                Requester = new Requester()
                                {
                                    LocaleId = 1,
                                    Name = model.SenderName,
                                    Email = model.EmailAddress
                                },
                                Priority = "normal"

                            }
                         );

                        if (response == null || response.Ticket == null)
                            return null;
                        else
                            id = (long)response.Ticket.Id;

                        model.Message = "Thank you for your request!  A member of the our team will be in touch with you shortly.";
                        model.AlertType = AlertTypes.Success;
                    }
                    catch (Exception ex)
                    {
                        // generate log
                        Jugnoon.BLL.ErrorLgBLL.Add(_context, "Problem occured while submitting your request, please try again.", "/contact", ex.Message);

                        model.Message = "Problem occured while submitting your request, please try again.";
                    }

                }
                else
                {
                    // Normal Email Sending Procedure
                    _emailSender.ContactUsEmailAsync(_context, Configs.GeneralSettings.admin_mail, model);

                    model.Message = SiteConfig.generalLocalizer["_message_sent"].Value;
                    model.AlertType = AlertTypes.Success;
                }
              

                return View("~/Views/Home/index.cshtml", model);
            }

            return View(model);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<ActionResult> newsletter(NewsLetterViewModel model)
        {
            ViewData["Page"] = "index";
            if (model.page != null)
                ViewData["Page"] = model.page;

            if (ModelState.IsValid)
            {
                if (_activeCompaignSettings.enable)
                {
                    var tags = "NewsLetter";
                    var listId = _activeCompaignSettings.listId;
                    try
                    {
                        var contact = new Dictionary<string, string> {
                            { "email", model.EmailAddress },
                            { "tags", tags },
                            { "p[{" + listId + "}]", listId.ToString() },
                            { "status[{" + listId + "}]", "1" },
                        };

                        var activeCampaignClientResult = await _activeCampaignClient.Call(
                                "contact/sync",
                                contact
                        );

                        model.Message = "Thank you for your request!  A member of our team will be in touch with you shortly.";
                        model.AlertType = AlertTypes.Success;
                    }
                    catch (Exception ex)
                    {
                        Jugnoon.BLL.ErrorLgBLL.Add(_context, "Problem occured while submitting your request, please try again.", "/newsletter", ex.Message);

                        model.Message = "Problem occured while submitting your request, please try again.";
                    }
                }

                else
                {
                    // active compaign not enabled
                    // add / customize newletter management with your own custom logic
                    model.Message = "Thank you for your request!  A member of the our team will be in touch with you shortly.";
                    model.AlertType = AlertTypes.Success;
                }


                return View("~/Views/Home/index.cshtml", model);
            }

            return View(model);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult validateadult(string submit)
        {
            switch (submit)
            {
                case "enter":
                    return (Enter());
                case "canel":
                    return (Cancel());
                default:
                    return (View());
            }
        }

        private ActionResult Enter(string surl = null)
        {
            if (surl != null)
                return Redirect(surl);
            else
                return Redirect(Config.GetUrl());
        }

        private ActionResult Cancel()
        {
            return Redirect(Config.GetUrl());
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
