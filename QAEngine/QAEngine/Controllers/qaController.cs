using System;
using Microsoft.AspNetCore.Mvc;
using Jugnoon.Entity;
using Jugnoon.Utility;
using Jugnoon.BLL;
using Jugnoon.qa;
using Jugnoon.qa.Models;
using Jugnoon.Settings;
using Jugnoon.Scripts;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Localization;
using Jugnoon.Framework;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Jugnoon.Models;
using System.Net;
using Ganss.XSS;
using System.Threading.Tasks;
using Jugnoon.Meta;
using Jugnoon.Localize;

namespace QAEngine.Controllers
{
    public class qaController : Controller
    {
        ApplicationDbContext _context;
        public qaController(
           IOptions<SiteConfiguration> settings,
           IMemoryCache memoryCache,
           ApplicationDbContext context,
           IStringLocalizer<GeneralResource> generalLocalizer,
           IStringLocalizer<qaResource> qaLocalizer,
           IWebHostEnvironment _environment,
           IHttpContextAccessor _httpContextAccessor,
           IOptions<General> generalSettings,
           IOptions<Features> featureSettings,
           IOptions<Media> mediaSettings,
           IOptions<Smtp> smtpSettings,
           IOptions<Jugnoon.qa.Settings.General> generalQaSettings
           )
        {
            _context = context;
            // readable settings (global)
            Jugnoon.Settings.Configs.GeneralSettings = generalSettings.Value;
            Jugnoon.Settings.Configs.FeatureSettings = featureSettings.Value;
            Jugnoon.Settings.Configs.SmtpSettings = smtpSettings.Value;
            Jugnoon.Settings.Configs.MediaSettings = mediaSettings.Value;
            // readable settings (content specific)
            Jugnoon.qa.Configs.GeneralSettings = generalQaSettings.Value;

            SiteConfig.Config = settings.Value;
            SiteConfig.Cache = memoryCache;

            SiteConfig.generalLocalizer = generalLocalizer;
            SiteConfig.qaLocalizer = qaLocalizer;
            SiteConfig.Environment = _environment;
            SiteConfig.HttpContextAccessor = _httpContextAccessor;
        }

        #region Listing
        // GET: qa
        public async Task<IActionResult> Index(string order, string filter, int? pagenumber)
        {
            ViewBag.qaTabCss = "active";

            if (pagenumber == null)
                pagenumber = 1;
            
            string _order = "qa.created_at desc";
            var _dateFilter = DateFilter.AllTime;
            var _featuredFilter = FeaturedTypes.All;
            var _isResolved = ResolvedActions.All;
            var _isClosed = ClosedActions.All;

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
            var DefaultUrl = Config.GetUrl("qa/");
            var PaginationUrl = Config.GetUrl("qa/page/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;


            if (order != null)
            {
                DefaultUrl = Config.GetUrl("qa/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("qa/" + order.ToLower().Trim() + "/[p]/");
                switch (order)
                {
                    case "resolved":
                        selectedOrder = SiteConfig.generalLocalizer["_resolved"].Value;
                        _order = "qa.created_at desc";
                        _isResolved = ResolvedActions.Resolved;
                        break;
                    case "topvoted":
                        selectedOrder = "Top Voted";
                        _order = "qa.votes desc, qa.created_at desc";
                        break;
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "qa.created_at desc";
                         _featuredFilter = FeaturedTypes.Featured;
                        break;
                    case "closed":
                         selectedOrder = SiteConfig.generalLocalizer["_closed"].Value;
                        _order = "qa.created_at desc";
                        _isClosed = ClosedActions.Closed;
                        break;
                }
            }

            if (filter != null)
            {
                // pagination setting
                if (filter == "today" || filter == "thisweek" || filter == "thismonth")
                {
                    DefaultUrl = Config.GetUrl("qa/added/" + filter.ToLower().Trim());
                    PaginationUrl = Config.GetUrl("qa/added/" + filter.ToLower().Trim() + "/[p]/");
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
                         _dateFilter = DateFilter.ThisMonth;
                        break;
                }
            }

            /* List Initialization */
            var ListEntity = new qaListViewModel()
            {                
                isListStatus = true,
                isListNav = true,
                Navigation = prepareFilterLinks("/qa/", selectedOrder, selectedFilter),
                QueryOptions = new QAEntity()
                {
                    pagenumber = (int)pagenumber,
                    term = "",
                    iscache = true,
                    ispublic = true,
                    isresolved = _isResolved,
                    isclosed = _isClosed,
                    isfeatured = _featuredFilter,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    datefilter = _dateFilter,
                    order = _order,
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };

            ListEntity.TotalRecords = await QABLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await QABLL.LoadItems(_context, ListEntity.QueryOptions);
            
            // Page Meta Description
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }


        // GET: qa/category
        public async Task<IActionResult> category(string title, string order, string filter, int? pagenumber)
        {
            if (title == null)
                return Redirect(Config.GetUrl("qa/"));

            if (pagenumber == null)
                pagenumber = 1;

            string _term = UtilityBLL.ReplaceHyphinWithSpace(title);
            string categoryName = UtilityBLL.UppercaseFirst(_term);

            string _order = "qa.created_at desc";
            var _dateFilter = DateFilter.AllTime;
            var _featuredFilter = FeaturedTypes.All;
            var _isResolved = ResolvedActions.All;
            var _isClosed = ClosedActions.All;

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
            var DefaultUrl = Config.GetUrl("qa/category/" + title);
            var PaginationUrl = Config.GetUrl("qa/category/" + title + "/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;

            if (order != null)
            {
                DefaultUrl = Config.GetUrl("qa/category/" + title + "/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("qa/category/" + title + "/" + order.ToLower().Trim() + "/[p]/");

                switch (order)
                {
                    case "resolved":
                        selectedOrder = SiteConfig.generalLocalizer["_resolved"].Value;
                        _order = "qa.created_at desc";
                        _isResolved = ResolvedActions.Resolved;
                        break;
                    case "topvoted":
                        selectedOrder = SiteConfig.generalLocalizer["_top_voted"].Value;
                        _order = "qa.votes desc, qa.created_at desc";
                        break;
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "qa.created_at desc";
                         _featuredFilter = FeaturedTypes.Featured;
                        break;
                    case "closed":
                         selectedOrder = SiteConfig.generalLocalizer["_closed"].Value;
                        _order = "qa.created_at desc";
                         _isClosed = ClosedActions.Closed;
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
                        DefaultUrl = Config.GetUrl("qa/category/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order);
                        PaginationUrl = Config.GetUrl("qa/category/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order + "/[p]/");
                    }
                    else
                    {
                        DefaultUrl = Config.GetUrl("qa/category/filter/" + title + "/" + filter.ToLower().Trim());
                        PaginationUrl = Config.GetUrl("qa/category/filter/" + title + "/" + filter.ToLower().Trim() + "/[p]/");
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
            var ListEntity = new qaListViewModel()
            {
                isListStatus = true,
                isListNav = true,
                Navigation = prepareCategoryFilterLinks("/qa/category/", title, selectedOrder, selectedFilter),
                QueryOptions = new QAEntity()
                {
                    pagenumber = (int)pagenumber,
                    //categories_str = _term,
                    iscache = true,
                    ispublic = true,
                    isclosed = _isClosed,
                    isresolved = _isResolved,
                    isfeatured = _featuredFilter,
                    datefilter = _dateFilter,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    order = _order,
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await CategorizeQa.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await CategorizeQa.LoadItems(_context, ListEntity.QueryOptions);

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }
        
        // GET: qa/label
        public async Task<IActionResult> label(string title, string order, string filter, int? pagenumber)
        {
            if (title == null || title == "")
                return Redirect(Config.GetUrl("qa/"));

            if (pagenumber == null)
                pagenumber = 1;

            string _term = UtilityBLL.ReplaceHyphinWithSpace(title);
            string categoryName = UtilityBLL.UppercaseFirst(_term);
            
            string _order = "qa.created_at desc";
            var _dateFilter = DateFilter.AllTime;
            var _featuredFilter = FeaturedTypes.All;
            var _isResolved = ResolvedActions.All;
            var _isClosed = ClosedActions.All;

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
            var DefaultUrl = Config.GetUrl("qa/label/" + title);
            var PaginationUrl = Config.GetUrl("qa/label/" + title + "/[p]/");

            // order
            var selectedOrder = SiteConfig.generalLocalizer["_recent"].Value;
            var selectedFilter  = SiteConfig.generalLocalizer["_all_time"].Value;


            if (order != null)
            {
                DefaultUrl = Config.GetUrl("qa/label/" + title + "/" + order.ToLower().Trim());
                PaginationUrl = Config.GetUrl("qa/label/" + title + "/" + order.ToLower().Trim() + "/[p]/");

                switch (order)
                {
                    case "resolved":
                        selectedOrder = SiteConfig.generalLocalizer["_resolved"].Value;
                        _order = "qa.created_at desc";
                        _isResolved = ResolvedActions.Resolved;
                        break;
                    case "topvoted":
                        selectedOrder = SiteConfig.generalLocalizer["_top_voted"].Value;
                        _order = "qa.votes desc, qa.created_at desc";
                        break;
                    case "featured":
                        selectedOrder   = SiteConfig.generalLocalizer["_featured"].Value;
                        _order = "qa.created_at desc";
                         _featuredFilter = FeaturedTypes.Featured;
                        break;
                    case "closed":
                         selectedOrder = SiteConfig.generalLocalizer["_closed"].Value;
                        _order = "qa.created_at desc";
                         _isClosed = ClosedActions.Closed;
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
                        DefaultUrl = Config.GetUrl("qa/label/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order);
                        PaginationUrl = Config.GetUrl("qa/label/filter/" + title + "/" + filter.ToLower().Trim() + "/" + order + "/[p]/");
                    }
                    else
                    {
                        DefaultUrl = Config.GetUrl("qa/label/filter/" + title + "/" + filter.ToLower().Trim());
                        PaginationUrl = Config.GetUrl("qa/label/filter/" + title + "/" + filter.ToLower().Trim() + "/[p]/");
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
                         _dateFilter = DateFilter.ThisMonth;
                        break;
                }
            }

            /* List Initialization */
            var ListEntity = new qaListViewModel()
            {
                isListStatus = true,
                isListNav = true,
                Navigation = prepareCategoryFilterLinks("/qa/label/", title, selectedOrder, selectedFilter),

                QueryOptions = new QAEntity()
                {
                    pagenumber = (int)pagenumber,
                    tags = _term,
                    iscache = false,
                    ispublic = true,
                    isresolved = _isResolved,
                    isclosed = _isClosed,
                    isfeatured = _featuredFilter,
                    datefilter = _dateFilter,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    order = _order,
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = DefaultUrl,
                PaginationUrl = PaginationUrl,
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await QABLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await QABLL.LoadItems(_context, ListEntity.QueryOptions);

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;
            ViewBag.keywords = _meta.keywords;
            ViewBag.imageurl = _meta.imageurl;

            return View(ListEntity);
        }

        // GET: qa/archive
        public async Task<IActionResult> archive(string month, int? year, string order, int? pagenumber)
        {
            if (pagenumber == null)
                pagenumber = 1;

            if (month == null || year == null)
            {
                return Redirect(Config.GetUrl("qa/"));
            }

            string _order = "qa.created_at desc";
            string _orderIndex = ""; // for pagination

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
            var ListEntity = new qaListViewModel()
            {
                isListStatus = true,
                isListNav = false,
                QueryOptions = new QAEntity()
                {
                    pagenumber = (int)pagenumber,
                    term = "",
                    month = UtilityBLL.ReturnMonth(month),
                    year =  (int)year,
                    iscache = false,
                    ispublic = true,
                    isfeatured = FeaturedTypes.All,
                    pagesize = Jugnoon.Settings.Configs.GeneralSettings.pagesize,
                    order = _order,
                },
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                DefaultUrl = Config.GetUrl("qa/archive/" + month + "/" + year + "/"),
                PaginationUrl = Config.GetUrl("qa/archive/" + month + "/" + year + "/[p]/"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
            };
            ListEntity.TotalRecords = await QABLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await QABLL.LoadItems(_context, ListEntity.QueryOptions);

            if (_orderIndex != "")
            {
                ListEntity.DefaultUrl = Config.GetUrl("qa/archive/" + month + "/" + year + "" + _orderIndex);
                ListEntity.PaginationUrl = Config.GetUrl("qa/archive/" + month + "/" + year + "" + _orderIndex + "/[p]/");
            }

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        // GET: qa/categories
        public async Task<IActionResult> categories(int? pagenumber)
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

            /* List Initialization */
            var ListEntity = new CategoryListViewModel_v2()
            {
                isListStatus = true,
                isListNav = false,
                QueryOptions = new CategoryEntity()
                {
                    type = (int)CategoryBLL.Types.qa,
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
                    ItemType = ItemType.Link, // 0: div, 1: a
                    showRating = true,
                    showViews = true,
                    showDate = true
                },
                Path = "qa/", // category url path
                DefaultUrl = Config.GetUrl("qa/categories"),
                PaginationUrl = Config.GetUrl("qa/categories/[p]"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems
            };

            ListEntity.TotalRecords = await CategoryBLL.Count(_context, ListEntity.QueryOptions);
            if (ListEntity.TotalRecords > 0)
                ListEntity.DataList = await CategoryBLL.LoadItems(_context, ListEntity.QueryOptions);

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        // GET: qa/archivelist
        public  IActionResult archivelist()
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
                Type = ContentTypes.QA,
                Path = "qa/",
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems,
                isAll = true
            };

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        // GET: qa/labels
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
                Type = (int)TagsBLL.Types.QA, 
                Path = "qa/",
                DefaultUrl = Config.GetUrl("qa/labels"),
                PaginationUrl = Config.GetUrl("qa/labels/[p]/"),
                NoRecordFoundText = SiteConfig.generalLocalizer["_no_records"].Value,
                Action = "/qa/labels", // for search tags
                HeadingTitle = _meta.title,
                BreadItems = _meta.BreadItems
            };
          
            if (term != null && term.Length > 0)
            {
                ListEntity.Term = UtilityBLL.CleanSearchTerm(WebUtility.UrlDecode(term).Trim());
                ListEntity.DefaultUrl = Config.GetUrl("qa/labels/search/" + term);
                ListEntity.PaginationUrl = Config.GetUrl("qa/labels/search/" + term + "/[p]");
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
        public IActionResult taglist(TagListModelView model)
        {
            return Redirect(Config.GetUrl("qa/labels/search/" + WebUtility.UrlEncode(UtilityBLL.CleanSearchTerm(model.Query))));
        }

        #endregion

        #region Search
        // GET: qa/taglist
        public async Task<IActionResult> search(string term, string filter, int? pagenumber)
        {
            if (term == null)
                return Redirect("/qa/");
           
            var _sanitize = new HtmlSanitizer();
            term = _sanitize.Sanitize(UtilityBLL.ReplaceHyphinWithSpace(term));
           
            /* ***************************************/
            // Process Page Meta & BreaCrumb 
            /* ***************************************/
            var _meta = PageMeta.returnPageMeta(new PageQuery()
            {
                controller = ControllerContext.ActionDescriptor.ControllerName,
                index = ControllerContext.ActionDescriptor.ActionName,
                pagenumber = (int)pagenumber,
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
            var ListEntity = new qaListViewModel()
            {                
                QueryOptions = new QAEntity()
                {
                    term = term
                },
                BreadItems = _meta.BreadItems
            };

            /**********************************************/
            // Page Meta Setup
            /**********************************************/
            ViewBag.title = _meta.title;
            ViewBag.description = _meta.description;

            return View(ListEntity);
        }

        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult queryresult(SearchListModel model)
        {
            return Redirect(Config.GetUrl("qa/search/" + WebUtility.UrlEncode(UtilityBLL.CleanSearchTerm(model.Query))));
        }

        #endregion

        private qaListFilterViewModel prepareFilterLinks(string url, string selectedOrder, string selectedFilter)
        {
            return new qaListFilterViewModel()
            {
                selectedFilter = selectedFilter,
                selectedOrder = selectedOrder,
                order_resolved_url = url + "resolved",
                order_recent_url = url + "recent",
                order_closed_url = url + "closed",
                order_votes_url = url + "topvoted",
                order_featured_url = url + "featured",
                filter_date_alltime_url = url,
                filter_date_thismonth_url = url + "added/thismonth",
                filter_date_thisweek_url = url + "added/thisweek",
                filter_date_today_url = url + "added/today"
            };
        }

        private qaListFilterViewModel prepareCategoryFilterLinks(string url, string title, string selectedOrder, string selectedFilter)
        {
            return new qaListFilterViewModel()
            {
                selectedFilter = selectedFilter,
                selectedOrder = selectedOrder,
                order_resolved_url = url + "" + title + "/resolved",
                order_recent_url = url + "" + title + "/recent",
                order_closed_url = url + "" + title + "/closed",
                order_votes_url = url + "" + title + "/topvoted",
                order_featured_url = url + "" + title + "/featured",
                filter_date_alltime_url = url + "" + title,
                filter_date_thismonth_url = url + "filter/" + title + "/thismonth",
                filter_date_thisweek_url = url + "filter/" + title + "/thisweek",
                filter_date_today_url = url + "filter/" + title + "/today"
            };
        }
        
        // GET: qa/ask
        public async Task<IActionResult> ask(long? id)
        {
            var model = new AskModelView();
            model.AlertType = AlertTypes.Error;
            model.PostAccess = true;
            
            if (id != null)
                model.Qid = (long)id;

            if (!User.Identity.IsAuthenticated)
            {
                string redirect_url = Config.GetUrl() + "qa/ask";
                return Redirect(Config.GetUrl() + "login?returnUrl=" + redirect_url);
            }

            if(model.Qid > 0)
            {
                // authorization
                var _username = SiteConfig.userManager.GetUserName(User);
                if (!QABLL.Check(_context, model.Qid, _username))
                {
                    model.PostMessage = SiteConfig.generalLocalizer["_authentication_failed"].Value;
                    model.PostAccess = false;
                    return View(model);
                }
            }
            model.isAdmin = false;

            InitModel(model);

            model.UserName = SiteConfig.userManager.GetUserName(User);

            if (model.Qid > 0)
                model.HeadingTitle = SiteConfig.generalLocalizer["_edit_information"];
            else
                model.HeadingTitle = SiteConfig.generalLocalizer["_asked_question"];
          
            if (model.Qid > 0)
            {
                var _list = await QABLL.LoadItems(_context, new QAEntity()
                {
                    id = model.Qid,
                    nofilter = true
                });// (model.Qid);
                if (_list.Count > 0)
                {
                    model.Title= _list[0].title;
                    model.Description = _list[0].description;
                    model.Tags = _list[0].tags;
                    model.Categories = _list[0].categories;
                }
            }
            ViewBag.title= model.HeadingTitle;
            return View(model);
        }

        private void InitModel(AskModelView model)
        {
            if (Jugnoon.Settings.Configs.FeatureSettings.enable_categories)
            {
                int Categorytype = 11; // represent qa
                model.CategoryList = CategoryBLL.LoadItems(_context, new CategoryEntity()
                {
                    iscache = true,
                    type = Categorytype,
                    ispublic = true,
                    pagesize = 1000
                }).Result;
            }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> ask(AskModelView model)
        {
            if (ModelState.IsValid)
            {                
                /*if (model.Description == "" || model.Description.Length < 10)
                {
                    model.Message = SiteConfig.sharedLocalizer["blogs_post_message_03; // Please write your answer
                    return View(model);
                }*/
                // check title of blog
                if (model.Title.Length < 10)
                {
                    model.Message = SiteConfig.qaLocalizer["_qa_post_msg_01"].Value; // Title must be atleast 5 characters long.
                    InitModel(model);
                    return View(model);
                }

                if (UtilityBLL.isLongWordExist(model.Title) || UtilityBLL.isLongWordExist(model.Title))
                {
                    model.Message = SiteConfig.generalLocalizer["_invalid_title"]; // Long or bad word exist either in title or description, correct and post again
                    InitModel(model);
                    return View(model);
                }
           
                // validate tags
                if (Jugnoon.Settings.Configs.FeatureSettings.enable_tags && model.Tags != null)
                {
                    if (!TagsBLL.Validate_Tags(model.Tags))
                    {
                        model.Message = SiteConfig.generalLocalizer["_invalid_tags"]; // Problem exist in tag, please fix and post again.
                        InitModel(model);
                        return View(model);
                    }
                }

                if (model.Categories != null && model.Categories.Length ==0)
                {
                    model.Message = SiteConfig.generalLocalizer["_select"];
                    InitModel(model);
                    return View(model);
                }
               

                int isapproved = 1; // enable it bydefault
                string status = "posted";
                if (Jugnoon.Settings.Configs.GeneralSettings.content_approval == 0)
                {
                    // Moderator Review Required
                    isapproved = 0;
                    status = "pending";
                }
                    
                //XSS CLEANUP

                string content = "";
                if(model.Description != null)
                    content = UGeneral.SanitizeText(model.Description);
                // Process Contents -> links, bbcodes etc
                // content = UtilityBLL.Process_Content_Text(content);
              
                var qst = new JGN_Qa();
                qst.title= model.Title;
                if (qst.title.Length > 100)
                    qst.title= qst.title.Substring(0, 99);
                qst.description = content;
                qst.categories = model.Categories;

                if (model.Tags != null)
                {
                    qst.tags = model.Tags;
                    if (qst.tags.Length > 200)
                        qst.tags = qst.tags.Substring(0, 199);
                }
               
                qst.isapproved = (byte)isapproved;
                qst.userid = model.UserName;
                            
                if (model.Qid == 0)
                {
                    // Ask new qa
                    qst.isenabled = 1; // enabled by default
                    qst.comments = 0; // set default value
                    qst = await QABLL.Add(_context, qst, model.isAdmin);
                    
                    // send mail to admin or moderator
                    if (!model.isAdmin)
                    {
                        MailTemplateProcess(qst.id, qst.userid, qst.title, qst.description,model.isAdmin);
                    }
                }
                else
                {
                    status = "updated";
                    qst.id = model.Qid;
                    await QABLL.Update(_context, qst);
                }

                if(model.Tags != null && model.Tags != "")
                {
                    TagsBLL.Process_Tags(_context, model.Tags, TagsBLL.Types.QA, 0);
                }

                return Redirect(QAUrls.Prepare_QA_Url(qst, "?status=" + status));

            }

            InitModel(model);
            model.Message = "Validation Error";
            return View(model);
        }



        public async Task<IActionResult> remove()
        {
            if (!User.Identity.IsAuthenticated)
            {
                string redirect_url = Config.GetUrl() + "qa/ask";
                return Redirect(Config.GetUrl() + "login?ReturnUrl=" + redirect_url);
            }
            long Qid = 0;

            if (HttpContext.Request.Query["id"].Count > 0)
                Qid = Convert.ToInt64(HttpContext.Request.Query["id"]);

            var _username = SiteConfig.userManager.GetUserName(User);
            // validate whether id belong to this user.
            if (!QABLL.Check(_context, Qid, _username))
            {
                return Content(Config.SetHiddenMessage_v2(SiteConfig.generalLocalizer["_authentication_failed"].Value, "", true, 4));
            }

            await QABLL.Delete(_context, Qid, _username);

            return Content(Config.SetHiddenMessage_v2(SiteConfig.generalLocalizer["_record_deleted"], "", true, 4));
        }
        private void MailTemplateProcess(long id, string username, string title, string description, bool isAdmin)
        {
            //if sending mail option enabled
            if (Jugnoon.Settings.Configs.SmtpSettings.enable_email)
            {
                var lst = MailTemplateBLL.Get_Template(_context, "ASKqa").Result;
                if (lst.Count > 0)
                {//[username],[ptitle],[purl],[pdescription]
                    string subject = MailProcess.Process2(lst[0].subject, "\\[username\\]", username);

                    string contents = MailProcess.Process2(lst[0].contents, "\\[username\\]", username);
                    contents = MailProcess.Process2(contents, "\\[ptitle\\]", title);
                    contents = MailProcess.Process2(contents, "\\[pdescription\\]", description);

                    string qaurl = QAUrls.Prepare_QA_Url(id, title, "");
                    string url = "<a href=\"" + qaurl + "\">" + qaurl + "</a>";
                    contents = MailProcess.Process2(contents, "\\[purl\\]", url);

                    // attach signature
                    contents = MailProcess.Prepare_Email_Signature(contents);

                    string emailaddress = Jugnoon.Settings.Configs.GeneralSettings.admin_mail;
                    MailProcess.Send_Mail(emailaddress, subject, contents);
                }
            }
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
