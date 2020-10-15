using Microsoft.AspNetCore.Mvc;
using Jugnoon.Utility;
using Jugnoon.BLL;
using Jugnoon.Settings;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using Jugnoon.Framework;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System.Net;
using System.Threading.Tasks;
using Jugnoon.Blogs;
using Jugnoon.Blogs.Models;
using Jugnoon.Localize;

namespace QAEngine.Controllers
{
    public class postController : Controller
    {
        ApplicationDbContext _context;
        public postController(
           IOptions<SiteConfiguration> settings,
           IMemoryCache memoryCache,
           ApplicationDbContext context,
           IStringLocalizer<GeneralResource> generalLocalizer,
           IStringLocalizer<BlogResource> blogLocalizer,
           IWebHostEnvironment _environment,
           IHttpContextAccessor _httpContextAccessor,
           IOptions<General> generalSettings,
           IOptions<Features> featureSettings,
           IOptions<Smtp> smtpSettings,
           IOptions<Aws> awsSettings,
           IOptions<Jugnoon.Blogs.Settings.General> generalBlogsSettings,
           IOptions<Jugnoon.Blogs.Settings.Aws> awsBlogSettings
           )
        {
            _context = context;
            // readable settings (global)
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.AwsSettings = awsSettings.Value;
            // blog settings specific
            Jugnoon.Blogs.Configs.BlogSettings = generalBlogsSettings.Value;
            Jugnoon.Blogs.Configs.AwsSettings = awsBlogSettings.Value;

            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;

            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.blogLocalizer = blogLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }
        // GET: post
        public async Task<IActionResult> Index(long? id, string title)
        {
            if(id == null)
                return Redirect(Config.GetUrl("blogs"));

            var model = new PostViewModel();
            model.isExist = true;

            var _lst = await BlogsBLL.LoadItems(_context, new BlogEntity()
            {
                id = (long)id,
                isapproved = ApprovedTypes.All,
                ispublic = false,
                isenabled = EnabledTypes.Enabled
            }); 

            if(_lst.Count == 0)
            {
                model.isExist = false;
                return View(model);
            }

            model.Post = _lst[0];
            // fetch associated categories
            model.Post.category_list = await CategoryContentsBLL.FetchContentCategoryList(_context, model.Post.id, (byte)CategoryContentsBLL.Types.Blogs);
            
            model.PermaUrl = BlogUrlConfig.Generate_Post_Url(new JGN_Blogs()
            {
                id = (long)id,
                title = model.Post.title
            });

            if (model.Post.isadult == 1)
            {
                // 1:-> adult content, 0:-> non adult content
                var getValue = HttpContext.Session.GetString("adultmember");
                if (getValue == null)
                {
                    return Redirect(Config.GetUrl("default/validateadult?surl=" + WebUtility.UrlEncode(model.PermaUrl) + "")); ;
                }
            }

            // increment views
            model.Post.views++;
            BlogsBLL.Update_Field_V3(_context, (long)id, _lst[0].views, "views");

            string meta_title = _lst[0].title;
            if (meta_title == "")
                meta_title = "Post ID: " + _lst[0].id;

            ViewBag.title= meta_title;

            string _desc = UtilityBLL.StripHTML(_lst[0].description);
            if (_desc == "")
                _desc = _lst[0].title;
            else if (_desc.Length > 160)
                _desc = _desc.Substring(0, 160);

            ViewBag.description = _desc + ", posted date: " + _lst[0].created_at + ", PostID: " + _lst[0].id;

            ViewBag.RSS = Config.GetUrl("agency/rss");

            ViewBag.ATOM = Config.GetUrl("agency/atom");

            return View(model);
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
