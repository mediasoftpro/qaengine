using Jugnoon.Meta;
using Jugnoon.Utility;
using System.Collections.Generic;

namespace Jugnoon.Blogs
{
    public class Meta
    {

        /// <summary>
        /// It is responsible for managing blogs controller both static and dynamic pages meta data 
        /// </summary>
        /// <returns></returns>
        public static List<Page> Prepare()
        {
            var Pages = new List<Page>
            {
                // video controller
                new Page {
                    controller = "blogs",
                    index = "index",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            index = "index",
                            title = SiteConfig.blogLocalizer["meta_rec_blogs"].Value,
                            description = "",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_rec_blogs_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_rec_blogs_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_rec_blogs_month"].Value
                                }
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "index",
                            title = SiteConfig.blogLocalizer["meta_featured_blogs"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_featured_blogs_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_featured_blogs_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.blogLocalizer["meta_featured_blogs_month"].Value
                                },
                            }
                        }
                    }
                },
                // Category Pages Adjustments
                new Page {
                    controller = "blogs",
                    index = "category",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            title = SiteConfig.blogLocalizer["meta_category_rec"].Value,
                            description = "",
                            index = "category",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_rec_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_rec_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_rec_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "category",
                            title = SiteConfig.blogLocalizer["meta_category_featured"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_featured_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_featured_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.blogLocalizer["meta_category_featured_month"].Value
                                },
                            }
                        }
                    }
                },
                // Tags or Label Pages Adjustments
                new Page {
                    controller = "blogs",
                    index = "label",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            index = "label",
                            title = SiteConfig.blogLocalizer["meta_label_rec"].Value,
                            description = "",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.blogLocalizer["meta_label_rec_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.blogLocalizer["meta_label_rec_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.blogLocalizer["meta_label_rec_month"].Value }
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "label",
                            title = SiteConfig.blogLocalizer["meta_label_featured"].Value,
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.blogLocalizer["meta_label_featured_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.blogLocalizer["meta_label_featured_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.blogLocalizer["meta_label_featured_month"].Value },
                            }
                        }
                    }
                },
                new Page {
                    controller = "blogs",
                    index = "archive",
                    title = "meta_archive",
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "blogs",
                    index = "categories",
                    title = SiteConfig.blogLocalizer["meta_label_featured_month"].Value,
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "blogs",
                    index = "archivelist",
                    title = SiteConfig.blogLocalizer["meta_archive_list"].Value,
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "blogs",
                    index = "labels",
                    child = new List<Page>
                    {
                        new Page { order = "normal", index = "labels", title = SiteConfig.blogLocalizer["meta_label_list"].Value },
                        // labels with search term (search label functionality)
                        new Page { order = "search", index = "labels", title = SiteConfig.blogLocalizer["meta_label_list_search"].Value }
                    }
                },
                new Page {
                    controller = "blogs",
                    index = "search",
                    title =  SiteConfig.blogLocalizer["meta_search"].Value,
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
