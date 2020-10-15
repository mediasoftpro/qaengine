
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Mvc;
using Jugnoon.Entity;
using Jugnoon.Utility;
using Jugnoon.BLL;
using System.Text;
using Jugnoon.Scripts;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using Jugnoon.Framework;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Jugnoon.Models;
using System.Net;
using QAEngine.Models;
using Ganss.XSS;
using System.Threading.Tasks;
using Jugnoon.Settings;
using Jugnoon.Blogs;
using Jugnoon.Blogs.Models;
using Jugnoon.Meta;
using Jugnoon.Localize;

namespace QAEngine.Controllers
{
    public class blogsController : Controller
    {
        ApplicationDbContext _context;

        public blogsController(
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
           IOptions<Media> mediaSettings,
           IOptions<Jugnoon.Blogs.Settings.General> generalBlogsSettings,
           IOptions<Jugnoon.Blogs.Settings.Aws> awsBlogSettings
           )
        {
            _context = context;
            // readable settings (global)
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;

            // readable settings (content specific)
            Jugnoon.Blogs.Configs.BlogSettings = generalBlogsSettings.Value;
            Jugnoon.Blogs.Configs.AwsSettings = awsBlogSettings.Value;
            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;
           
            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.blogLocalizer = blogLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        #region Feed
        // GET: blogs/atom
        public async Task<IActionResult> atom()
        {
            string sXml = await BlogFeeds.generateATOM(_context, new BlogEntity()
            {
                pagenumber = 1,
                ispublic = true,
                order = "blog.created_at desc",
                pagesize = 10
            }, Config.GetUrl("blogs/"));

            return this.Content(sXml, "text/xml");
        }

        // GET: blogs/rss
        public async Task<IActionResult> rss()
        {
            string sXml = await BlogFeeds.generateRSS(_context, new BlogEntity()
            {
                pagenumber = 1,
                ispublic= true,
                order = "blog.created_at desc",
                pagesize = 10
            });

            return this.Content(sXml, "text/xml");
        }
        #endregion

        #region Listing
        // GET: blogs
        public async Task<IActionResult> Index(string order, string filter, int? pagenumber)
        {
            ViewBag.BlogsTabCss = "active";

            if (pagenumber == null)
                pagenumber = 1;

            string _order = "blog.created_at desc";
            var _dateFilter = DateFilter.AllTime;
            var _featuredFilter = FeaturedTypes.All;
            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var pageOrder = "recent";
            var pageFilter = "";
            if (order != null)
                pageOrder = order;
            if (filter != null)
                pageFilter = filter;
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                order = pageOrder,
                filter = pageFilter,
                pagenumber = (int)pagenumber
            });

            // pagination
            var DefaultUrl = Config.GetUrl("blogs/");
            var PaginationUrl = Config.GetUrl("blogs/page/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;

            if (order != null)
            {
                DefaultUrl = Config.GetUrl("blogs/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("blogs/" + order.ToLower().Trim() + "/[p]/");
                switch (order)
                {                  
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "blog.created_at desc";
                        _featuredFilter = FeaturedTypes.Featured;
                        break;
                }
            }

            if (filter != null)
            {
                // pagination setting
                if (filter == "today" || filter == "thisweek" || filter == "thismonth")
                {
                    DefaultUrl = Config.GetUrl("blogs/added/" + filter.ToLower().Trim());
                    PaginationUrl = Config.GetUrl("blogs/added/" + filter.ToLower().Trim() + "/[p]/");
                }

                switch (filter)
                {
                    case "today":
                        selectedFilter = SiteConfig.generalLocalizer["_today"].Value;
                        _dateFilter = DateFilter.Today;
                        break;
                    case "thisweek":
                        selectedFilter = SiteConfig.generalLocalizer["_this_week"].Value;
                        _dateFilter = DateFilter.ThisWeek;
                        break;
                    case "thismonth":
                        selectedFilter = SiteConfig.generalLocalizer["_this_month"].Value;
                        _dateFilter = DateFilter.ThisWeek;
                        break;
                }
            }
            
            /* List Initialization */
            var ListEntity = new BlogListViewModel()
            {
                isListStatus = false,
                Navigation = prepareFilterLinks("/blogs/", selectedOrder, selectedFilter),
                QueryOptions = new BlogEntity()
                {
                    pagenumber = (int)pagenumber,
                    term = "",
                    iscache = true,
                    ispublic = true,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    isfeatured = _featuredFilter,
                    datefilter = _dateFilter,
                    order = _order,
                },
                ListObject = new ListItems()
                {
                    // ColWidth = "col-md-4 col-masonry",
                    ListType = ListType.List, // 0: grid 1: list
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await BlogsBLL.Count(_context, ListEntity.QueryOptions);
          
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await BlogsBLL.LoadItems(_context, ListEntity.QueryOptions);

            // Page Meta Description
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }


        // GET: blogs/category
        public async Task<IActionResult> category(string title, string order, string filter, int? pagenumber)
        {
            if (title == null || title == "")
                return Redirect(Config.GetUrl("blogs/"));

            if (pagenumber == null)
                pagenumber = 1;
        

            string _term = UtilityBLL.ReplaceHyphinWithSpace(title);
            string categoryName = UtilityBLL.UppercaseFirst(_term, true);

            string _order = "blog.created_at desc";
            var _dateFilter = DateFilter.AllTime;
            var _featuredFilter = FeaturedTypes.All;

            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var pageOrder = "recent";
            var pageFilter = "";
            if (order != null)
                pageOrder = order;
            if (filter != null)
                pageFilter = filter;
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                order = pageOrder,
                filter = pageFilter,
                pagenumber = (int)pagenumber,
                matchterm = categoryName
            });

            // pagination
            var DefaultUrl = Config.GetUrl("blogs/category/" + title);
            var PaginationUrl = Config.GetUrl("blogs/category/" + title + "/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;

            if (order != null)
            {
                DefaultUrl = Config.GetUrl("blogs/category/" + title + "/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("blogs/category/" + title + "/" + order.ToLower().Trim() + "/[p]/");

                switch (order)
                {                    
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "blog.created_at desc";
                         _featuredFilter = FeaturedTypes.Featured;
                        break;
                }
            }
            if (filter != null)
            {
                // pagination setting
                if (filter == "today" || filter == "thisweek" || filter == "thismonth")
                {
                    if (order != null)
                    {
                        DefaultUrl = Config.GetUrl("blogs/category/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order);
                        PaginationUrl = Config.GetUrl("blogs/category/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order + "/[p]/");
                    }
                    else
                    {
                        DefaultUrl = Config.GetUrl("blogs/category/filter/" + title + "/" + filter.ToLower().Trim());
                        PaginationUrl = Config.GetUrl("blogs/category/filter/" + title + "/" + filter.ToLower().Trim() + "/[p]/");
                    }
                }

                switch (filter)
                {
                    case "today":
                        selectedFilter = SiteConfig.generalLocalizer["_today"].Value;
                        _dateFilter = DateFilter.Today;
                        break;
                    case "thisweek":
                        selectedFilter = SiteConfig.generalLocalizer["_this_week"].Value;
                         _dateFilter = DateFilter.ThisWeek;
                        break;
                    case "thismonth":
                        selectedFilter = SiteConfig.generalLocalizer["_this_month"].Value;
                         _dateFilter = DateFilter.ThisWeek;
                        break;
                }
            }

            /* List Initialization */
            var ListEntity = new BlogListViewModel()
            {
                isListStatus = false,
                Navigation = prepareCategoryFilterLinks("/blogs/category/", title, selectedOrder, selectedFilter),
                QueryOptions = new BlogEntity()
                {
                    pagenumber = (int)pagenumber,
                    categoryname = _term,
                    iscache = true,
                    ispublic = true,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    isfeatured = _featuredFilter,
                    datefilter = _dateFilter,
                    order = _order,
                },
                ListObject = new ListItems()
                {
                    ListType = ListType.List, // 0: grid 1: list
                },

                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await BlogsBLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await BlogsBLL.LoadItems(_context, ListEntity.QueryOptions);
               

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }

        // GET: blogs/tag
        public async Task<IActionResult> label(string title, string order, string filter, int? pagenumber)
        {
            if (title == null)
                return Redirect(Config.GetUrl("blogs/"));

            if (pagenumber == null)
                pagenumber = 1;

            string _term = UtilityBLL.ReplaceHyphinWithSpace(title);
            string categoryName = UtilityBLL.UppercaseFirst(_term);

            string _order = "blog.created_at desc";
             var _dateFilter = DateFilter.AllTime;
             var _featuredFilter = FeaturedTypes.All;
            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var pageOrder = "recent";
            var pageFilter = "";
            if (order != null)
                pageOrder = order;
            if (filter != null)
                pageFilter = filter;
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                order = pageOrder,
                filter = pageFilter,
                pagenumber = (int)pagenumber,
                matchterm = categoryName
            });

            // pagination
            var DefaultUrl = Config.GetUrl("blogs/label/" + title);
            var PaginationUrl = Config.GetUrl("blogs/label/" + title + "/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;
            
            if (order != null)
            {
                DefaultUrl = Config.GetUrl("blogs/label/" + title + "/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("blogs/label/" + title + "/" + order.ToLower().Trim() + "/[p]/");

                switch (order)
                {                    
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "blog.created_at desc";
                        _featuredFilter = FeaturedTypes.Featured;
                        break;
                }
            }
            if (filter != null)
            {
                // pagination setting
                if (filter == "today" || filter == "thisweek" || filter == "thismonth")
                {
                    if (order != null)
                    {
                        DefaultUrl = Config.GetUrl("blogs/tag/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order);
                        PaginationUrl = Config.GetUrl("blogs/tag/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order + "/[p]/");
                    }
                    else
                    {
                        DefaultUrl = Config.GetUrl("blogs/tag/filter/" + title + "/" + filter.ToLower().Trim());
                        PaginationUrl = Config.GetUrl("blogs/tag/filter/" + title + "/" + filter.ToLower().Trim() + "/[p]/");
                    }
                }

                switch (filter)
                {
                    case "today":
                        selectedFilter = SiteConfig.generalLocalizer["_today"].Value;
                        _dateFilter = DateFilter.Today;
                        break;
                    case "thisweek":
                        selectedFilter = SiteConfig.generalLocalizer["_this_week"].Value;
                         _dateFilter = DateFilter.ThisWeek;
                        break;
                    case "thismonth":
                        selectedFilter = SiteConfig.generalLocalizer["_this_month"].Value;
                         _dateFilter = DateFilter.ThisWeek;
                        break;
                }
            }


            /* List Initialization */
            var ListEntity = new BlogListViewModel()
            {
                isListStatus = false,
                Navigation = prepareCategoryFilterLinks("/blogs/label/", title, selectedOrder, selectedFilter),
                QueryOptions = new BlogEntity()
                {
                    pagenumber = (int)pagenumber,
                    tags = _term,
                    iscache = false,
                    ispublic = true,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    isfeatured = _featuredFilter,
                    datefilter = _dateFilter,
                    order = _order,
                },
                ListObject = new ListItems()
                {
                    ListType = ListType.List, // 0: grid 1: list
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await BlogsBLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await BlogsBLL.LoadItems(_context, ListEntity.QueryOptions);

                

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }

        // GET: blogs/archive
        public async Task<IActionResult> archive(string month, int? year, string order, int? pagenumber)
        {
            if (pagenumber == null)
                pagenumber = 1;

            if (month == null || year == null)
                return Redirect(Config.GetUrl("blogs/"));

            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                pagenumber = (int)pagenumber,
                matchterm = month,
                matchterm2 = year.ToString()
            });

            /* List Initialization */
            var ListEntity = new BlogListViewModel()
            {
                isListStatus = false,
                isListNav = false,
                QueryOptions = new BlogEntity()
                {
                    pagenumber = (int)pagenumber,
                    term = "",
                    month = UtilityBLL.ReturnMonth(month),
                    year =  (int)year,
                    iscache = false,
                    ispublic = true,
                    isfeatured = FeaturedTypes.All,
                    pagesize = 20,
                    order = "blog.created_at desc",
                },
                ListObject = new ListItems()
                {
                    ListType = ListType.List,
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = Config.GetUrl("blogs/archive/" + month + "/" + year + "/"),
                PaginationUrl = Config.GetUrl("blogs/archive/" + month + "/" + year + "/[p]/"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };

            ListEntity.TotalRecords = await BlogsBLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await BlogsBLL.LoadItems(_context, ListEntity.QueryOptions);


            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        // GET: blogs/categories
        public IActionResult categories(int? pagenumber)
        {
            if (pagenumber == null)
                pagenumber = 1;

            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                pagenumber = (int)pagenumber,
            });

            var ListEntity = new CategoryListViewModel_v2()
            {
                isListStatus = true,
                isListNav = false,
                shortList = false,
                QueryOptions = new CategoryEntity()
                {
                    type = (int)CategoryBLL.Types.Blogs,
                    pagenumber = (int)pagenumber,
                    ispublic = true,
                    term = "",
                    iscache = true,
                    pagesize = 30,
                    order = "title asc",
                },
                ListObject = new ListItems()
                {
                    ListType = ListType.Grid,
                    ColWidth = "col-md-6",
                },
                Path = "blogs/", // category url path
                DefaultUrl = Config.GetUrl("blogs/categories"),
                PaginationUrl = Config.GetUrl("blogs/categories/[p]"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems
            };

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        // GET: blogs/archivelist
        public IActionResult archivelist()
        {
            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName
            });

            /* List Initialization */
            var ListEntity = new ArchiveListModelView()
            {
                Type = ContentTypes.Blogs,
                Path = "blogs/",
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                isAll = true
            };
            // Page Title
            ViewBag.title = _meta.title;

            return View(ListEntity);
        }

        // GET: blogs/labels
        public IActionResult labels(string term, int? pagenumber)
        {
            if (pagenumber == null)
                pagenumber = 1;

            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var order = "normal";
            if (term != null && term.Length > 0)
                order = "search";
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                order = order,
                pagenumber = (int)pagenumber
            });
            /* List Initialization */
            var ListEntity = new TagListModelView()
            {
                pagenumber = (int)pagenumber,
                TotalRecords = 100, // display 100 tags per page
                Type = (int)TagsBLL.Types.Blogs,
                Path = "blogs/",
                DefaultUrl = Config.GetUrl("blogs/labels"),
                PaginationUrl = Config.GetUrl("blogs/labels/[p]/"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
                Action = "/blogs/labels", // for search tags
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems
            };
            if (term != null && term.Length > 0)
            {
                ListEntity.Term = UtilityBLL.CleanSearchTerm(WebUtility.UrlDecode(term).Trim());
                ListEntity.DefaultUrl = Config.GetUrl("blogs/labels/search/" + term);
                ListEntity.PaginationUrl = Config.GetUrl("blogs/labels/search/" + term + "/[p]");
            }

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            return View(ListEntity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult labels(TagListModelView model)
        {
            return Redirect(Config.GetUrl("blogs/labels/search/" + WebUtility.UrlEncode(UtilityBLL.CleanSearchTerm(model.Query))));
        }
        #endregion

        #region Search Feature
        // GET: blogs/search
        public async Task<IActionResult> search(string term)
        {
            if (term == null)
                return Redirect("/blogs");

            var _sanitize = new HtmlSanitizer();
            term = _sanitize.Sanitize(UtilityBLL.ReplaceHyphinWithSpace(term));

            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                pagenumber = 1,
                matchterm = term
            });

            if (Jugnoon.Settings.Configs.GeneralSettings.store_searches)
            {
                //*********************************************
                // User Search Tracking Script
                //********************************************
                if (!TagsBLL.Validate_Tags(term.Trim()) && !term.Trim().Contains("@"))
                {
                    // check if tag doesn't exist
                    var count_tags = await TagsBLL.Count(_context, new TagEntity()
                    {
                        type = TagsBLL.Types.General,
                        tag_type = TagsBLL.TagType.UserSearches,
                        isenabled = EnabledTypes.Enabled
                    });
                    if (count_tags == 0)
                        TagsBLL.Add(_context, term.Trim(), TagsBLL.Types.General, 0, TagsBLL.TagType.UserSearches, EnabledTypes.Enabled, term.Trim());
                   
                }
            }
          
            /* List Initialization */
            var ListEntity = new BlogListViewModel()
            {                
                QueryOptions = new BlogEntity()
                {
                    term = term,
                },
                BreadItems = _meta.BreadItems
            };


            return View(ListEntity);
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult queryresult(SearchListModel model)
        {
            return Redirect(Config.GetUrl("blogs/search/" + WebUtility.UrlEncode(UtilityBLL.CleanSearchTerm(model.Query))));
        }

        #endregion

        private BlogListFilterViewModel prepareFilterLinks(string url, string selectedOrder, string selectedFilter)
        {
            return new BlogListFilterViewModel()
            {
                selectedFilter = selectedFilter,
                selectedOrder = selectedOrder,
                order_recent_url = url + "recent",
                order_featured_url = url + "featured",
                filter_date_alltime_url = url,
                filter_date_thismonth_url = url + "added/thismonth",
                filter_date_thisweek_url = url + "added/thisweek",
                filter_date_today_url = url + "added/today"
            };
        }

        private BlogListFilterViewModel prepareCategoryFilterLinks(string url, string title, string selectedOrder, string selectedFilter)
        {
            return new BlogListFilterViewModel()
            {
                selectedFilter = selectedFilter,
                selectedOrder = selectedOrder,
                order_recent_url = url + "" + title + "/recent",
                order_featured_url = url + "" + title + "/featured",
                filter_date_alltime_url = url + "" + title,
                filter_date_thismonth_url = url + "filter/" + title + "/thismonth",
                filter_date_thisweek_url = url + "filter/" + title + "/thisweek",
                filter_date_today_url = url + "filter/" + title + "/today"
            };
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
