using Jugnoon.Meta;
using Jugnoon.Utility;
using System.Collections.Generic;

namespace Jugnoon.Blogs
{
    public class Sitemap
    {
        /// <summary>
        /// Prepare core sitemap for blogs urls
        /// </summary>
        /// <returns></returns>
        public static List<SitemapMeta> Prepare()
        {
            var url = SiteConfiguration.URL;
            var Pages = new List<SitemapMeta>
            {
                 new SitemapMeta {
                     controller = "blogs",
                     index = "index",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             order = "recent",
                             title = SiteConfig.generalLocalizer["_recent"].Value,
                             url = url + "blogs/",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "blogs/recent/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["This Week"].Value,
                                     url = url + "blogs/added/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "blogs/added/thismonth"
                                 }
                             }
                         },
                         new SitemapMeta
                         {
                             order = "featured",
                             title = SiteConfig.generalLocalizer["_featured"].Value,
                             url = url + "blogs/featured",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     date = "today",
                                     title = SiteConfig.generalLocalizer["_today"].Value,
                                     url = url + "blogs/featured/today"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thisweek",
                                     title = SiteConfig.generalLocalizer["This Week"].Value,
                                     url = url + "blogs/featured/thisweek"
                                 },
                                 new SitemapMeta
                                 {
                                     date = "thismonth",
                                     title = SiteConfig.generalLocalizer["_this_month"].Value,
                                     url = url + "blogs/featured/thismonth"
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "category",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "category",
                             title = SiteConfig.generalLocalizer["_categories"].Value,
                             url = url + "blogs/categories",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     order = "recent",
                                     title = SiteConfig.generalLocalizer["_recent"].Value,
                                     url = url + "blogs/category/[MAT1]",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/today",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["This Week"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/thisweek",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/thismonth",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "featured",
                                     title = SiteConfig.generalLocalizer["_featured"].Value,
                                     url = url + "blogs/category/[MAT1]/featured",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/today/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["This Week"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/thisweek/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "blogs/category/filter/[MAT1]/thismonth/featured",
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "label",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                          new SitemapMeta
                         {
                             index = "label",
                             title = SiteConfig.generalLocalizer["_labels"].Value,
                             url = url + "blogs/labels",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     order = "recent",
                                     title = SiteConfig.generalLocalizer["_recent"].Value,
                                     url = url + "blogs/label/[MAT1]",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/today",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["This Week"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/thisweek",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/thismonth",
                                         }
                                     }
                                 },
                                 new SitemapMeta
                                 {
                                     order = "featured",
                                     title = SiteConfig.generalLocalizer["_featured"].Value,
                                     url = url + "blogs/label/[MAT1]/featured",
                                     child = new List<SitemapMeta>
                                     {
                                         new SitemapMeta
                                         {
                                             date = "today",
                                             title = SiteConfig.generalLocalizer["_today"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/today/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thisweek",
                                             title = SiteConfig.generalLocalizer["This Week"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/thisweek/featured",
                                         },
                                         new SitemapMeta
                                         {
                                             date = "thismonth",
                                             title = SiteConfig.generalLocalizer["_this_month"].Value,
                                             url = url + "blogs/label/filter/[MAT1]/thismonth/featured",
                                         }
                                     }
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "archive",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "archive",
                             title = SiteConfig.generalLocalizer["_archive_list"].Value,
                             url = url + "blogs/archivelist",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     index = "archive",
                                     title = "[MAT1] [MAT2]",
                                     url = url + "blogs/archive/[MAT1]/[MAT2]"
                                 }
                             }
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "categories",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "categories",
                             title = SiteConfig.generalLocalizer["_categories"].Value,
                             url = url + "blogs/categories"
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "archivelist",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "archivelist",
                             title = SiteConfig.generalLocalizer["_archive_list"].Value,
                             url = url + "blogs/archivelist"
                         }
                     }
                 },
                 new SitemapMeta
                 {
                     controller = "blogs",
                     index = "labels",
                     title = SiteConfig.generalLocalizer["_blogs"].Value,
                     url = url + "blogs/",
                     child = new List<SitemapMeta>
                     {
                         new SitemapMeta
                         {
                             index = "labels",
                             title = SiteConfig.generalLocalizer["_labels"].Value,
                             url = url + "blogs/labels",
                             child = new List<SitemapMeta>
                             {
                                 new SitemapMeta
                                 {
                                     index = "labels",
                                     order = "search",
                                     title = "[MAT1]",
                                     url = url + "blogs/labels/search/[MAT1]"
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
