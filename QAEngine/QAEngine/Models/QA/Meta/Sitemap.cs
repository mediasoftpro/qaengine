using Jugnoon.Meta;
using Jugnoon.Utility;
using System.Collections.Generic;

namespace Jugnoon.qa
{
    public class Sitemap
    {
        /// <summary>
        /// Prepare core sitemap for qa urls
        /// </summary>
        /// <returns></returns>
        public static List<SitemapMeta> Prepare()
        {
            var url = SiteConfiguration.URL;
            var Pages = new List<SitemapMeta>
            {
                 new SitemapMeta {
                     controller = "qa",
                     index = "index",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             order = "recent",
                             title = SiteConfig.generalLocalizer["_recent"].Value,
                             url = url + "qa/",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/recent/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/added/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/added/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "topvoted",
                             title = SiteConfig.generalLocalizer["Top Voted"].Value,
                             url = url + "qa/mostviewed",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/mostviewed/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/mostviewed/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/mostviewed/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "toprated",
                             title = SiteConfig.generalLocalizer["Top Rated"].Value,
                             url = url + "qa/toprated",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/toprated/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/toprated/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/toprated/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "resolved",
                             title = SiteConfig.generalLocalizer["_resolved"].Value,
                             url = url + "qa/resolved",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/resolved/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/resolved/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/resolved/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "featured",
                             title = SiteConfig.generalLocalizer["_featured"].Value,
                             url = url + "qa/featured",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/featured/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/featured/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/featured/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "closed",
                             title = SiteConfig.generalLocalizer["_closed"].Value,
                             url = url + "qa/featured",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "qa/closed/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["_this_week"].Value,
                                     url = url + "qa/closed/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "qa/closed/thismonth"
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "category",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "category",
                             title = SiteConfig.generalLocalizer["_categories"].Value,
                             url = url + "qa/categories",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     order = "recent",
                                     title = SiteConfig.generalLocalizer["_recent"].Value,
                                     url = url + "qa/category/[MAT1]",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/category/filter/[MAT1]/today",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thisweek",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thismonth",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "topvoted",
                                     title = SiteConfig.generalLocalizer["Top Voted"].Value,
                                     url = url + "qa/category/[MAT1]/topvoted",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/category/filter/[MAT1]/today/topvoted",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thisweek/topvoted",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thismonth/topvoted",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "resolved",
                                     title = SiteConfig.generalLocalizer["_resolved"].Value,
                                     url = url + "qa/category/[MAT1]/resolved",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/category/filter/[MAT1]/today/resolved",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thisweek/resolved",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thismonth/resolved",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "featured",
                                     title = SiteConfig.generalLocalizer["_featured"].Value,
                                     url = url + "qa/category/[MAT1]/featured",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/category/filter/[MAT1]/today/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thisweek/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thismonth/featured",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "closed",
                                     title = SiteConfig.generalLocalizer["_closed"].Value,
                                     url = url + "qa/category/[MAT1]/closed",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/category/filter/[MAT1]/today/closed",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thisweek/closed",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/category/filter/[MAT1]/thismonth/closed",
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "label",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                          new SitemapMeta
                         {
                             index = "label",
                             title = SiteConfig.generalLocalizer["_labels"].Value,
                             url = url + "qa/labels",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     order = "recent",
                                     title = SiteConfig.generalLocalizer["_recent"].Value,
                                     url = url + "qa/label/[MAT1]",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/label/filter/[MAT1]/today",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thisweek",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thismonth",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "resolved",
                                     title = SiteConfig.generalLocalizer["_resolved"].Value,
                                     url = url + "qa/label/[MAT1]/resolved",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/label/filter/[MAT1]/today/resolved",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thisweek/resolved",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thismonth/resolved",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "topvoted",
                                     title = SiteConfig.generalLocalizer["Top Voted"].Value,
                                     url = url + "qa/label/[MAT1]/topvoted",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/label/filter/[MAT1]/today/topvoted",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thisweek/topvoted",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thismonth/topvoted",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "featured",
                                     title = SiteConfig.generalLocalizer["_featured"].Value,
                                     url = url + "qa/label/[MAT1]/featured",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/label/filter/[MAT1]/today/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thisweek/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thismonth/featured",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "closed",
                                     title = SiteConfig.generalLocalizer["_closed"].Value,
                                     url = url + "qa/label/[MAT1]/closed",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "qa/label/filter/[MAT1]/today/closed",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["_this_week"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thisweek/closed",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "qa/label/filter/[MAT1]/thismonth/closed",
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "archive",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "archive",
                             title = SiteConfig.generalLocalizer["_archive_list"].Value,
                             url = url + "qa/archivelist",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     index = "Archive",
                                     title = "[MAT1] [MAT2]",
                                     url = url + "qa/archive/[MAT1]/[MAT2]"
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "categories",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "categories",
                             title = SiteConfig.generalLocalizer["_categories"].Value,
                             url = url + "qa/categories"
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "archivelist",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "archivelist",
                             title = SiteConfig.generalLocalizer["_archive_list"].Value,
                             url = url + "qa/archivelist"
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "qa",
                     index = "labels",
                     title = SiteConfig.generalLocalizer["_questions"].Value,
                     url = url + "qa/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "labels",
                             title = SiteConfig.generalLocalizer["_labels"].Value,
                             url = url + "qa/labels",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     index = "Labels",
                                     order = "search",
                                     title = "[MAT1]",
                                     url = url + "qa/labels/search/[MAT1]"
                                 }
                             }
                         }
                     }
                 }
              
            };

            return Pages;
        }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
