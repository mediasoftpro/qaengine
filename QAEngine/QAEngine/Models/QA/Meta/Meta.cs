using Jugnoon.Meta;
using Jugnoon.Utility;
using System.Collections.Generic;

namespace Jugnoon.qa
{
    public class Meta
    {

        /// <summary>
        /// It is responsible for managing qa controller both static and dynamic pages meta data 
        /// </summary>
        /// <returns></returns>
        public static List<Page> Prepare()
        {
            var Pages = new List<Page>
            {
                // video controller
                new Page {
                    controller = "qa",
                    index = "index",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            index = "index",
                            title = SiteConfig.generalLocalizer["meta_rec_qa"].Value,
                            description = "",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page {
                                    index = "index",
                                    date = "today",
                                    title = SiteConfig.generalLocalizer["meta_rec_qa_today"].Value
                                },
                                new Page {
                                    index = "index",
                                    date = "thisweek",
                                    title = SiteConfig.generalLocalizer["meta_rec_qa_week"].Value
                                },
                                new Page {
                                    index = "index",
                                    date = "thismonth",
                                    title = SiteConfig.generalLocalizer["meta_rec_qa_month"].Value
                                }
                            }
                        },
                        new Page {
                            order = "resolved",
                            index = "index",
                            title = SiteConfig.generalLocalizer["meta_resolved_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_resolved_qa_today"].Value,
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_resolved_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_resolved_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "topvoted",
                            index = "index",
                            title = SiteConfig.generalLocalizer["meta_voted_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_voted_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_voted_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_voted_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "index",
                            title = SiteConfig.generalLocalizer["meta_featured_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_featured_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_featured_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_featured_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "closed",
                            index = "index",
                            title = SiteConfig.generalLocalizer["meta_closed_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_closed_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_closed_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "index",
                                    title = SiteConfig.generalLocalizer["meta_closed_qa_month"].Value
                                },
                            }
                        }
                    }
                },
                // Category Pages Adjustments
                new Page {
                    controller = "qa",
                    index = "category",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            index = "category",
                            title = SiteConfig.generalLocalizer["meta_category_rec_qa"].Value,
                            description = "",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_rec_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_rec_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_rec_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "resolved",
                            index = "category",
                            title = SiteConfig.generalLocalizer["meta_category_resolved_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_resolved_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_resolved_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_resolved_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "topvoted",
                            index = "category",
                            title = SiteConfig.generalLocalizer["meta_category_voted_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_voted_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_voted_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_voted_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "category",
                            title = SiteConfig.generalLocalizer["meta_category_featured_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_featured_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_featured_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_featured_qa_month"].Value
                                },
                            }
                        },
                        new Page {
                            order = "closed",
                            index = "category",
                            title = SiteConfig.generalLocalizer["meta_category_closed_qa"].Value,
                            child = new List<Page>
                            {
                                new Page {
                                    date = "today",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_closed_qa_today"].Value
                                },
                                new Page {
                                    date = "thisweek",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_closed_qa_week"].Value
                                },
                                new Page {
                                    date = "thismonth",
                                    index = "category",
                                    title = SiteConfig.generalLocalizer["meta_category_closed_qa_month"].Value
                                },
                            }
                        }
                    }
                },
                // Tags or Label Pages Adjustments
                new Page {
                    controller = "qa",
                    index = "label",
                    child = new List<Page>
                    {
                        new Page {
                            order = "recent",
                            index = "label",
                            title = SiteConfig.generalLocalizer["meta_label_rec_qa"].Value,
                            description = "",
                            imageurl = "",
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.generalLocalizer["meta_label_rec_qa_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.generalLocalizer["meta_label_rec_qa_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.generalLocalizer["meta_label_rec_qa_month"].Value }
                            }
                        },
                        new Page {
                            order = "resolved",
                            index = "label",
                            title = SiteConfig.generalLocalizer["meta_label_resolved_qa"].Value,
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.generalLocalizer["meta_label_resolved_qa_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.generalLocalizer["meta_label_resolved_qa_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.generalLocalizer["meta_label_resolved_qa_month"].Value },
                            }
                        },
                        new Page {
                            order = "topvoted",
                            index = "label",
                            title = SiteConfig.generalLocalizer["meta_label_voted_qa"].Value,
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.generalLocalizer["meta_label_voted_qa_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.generalLocalizer["meta_label_voted_qa_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.generalLocalizer["meta_label_voted_qa_month"].Value },
                            }
                        },
                        new Page {
                            order = "featured",
                            index = "label",
                            title = SiteConfig.generalLocalizer["meta_label_featured_qa"].Value,
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.generalLocalizer["meta_label_featured_qa_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.generalLocalizer["meta_label_featured_qa_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.generalLocalizer["meta_label_featured_qa_month"].Value },
                            }
                        },
                        new Page {
                            order = "closed",
                            index = "label",
                            title = SiteConfig.generalLocalizer["meta_label_closed_qa"].Value,
                            child = new List<Page>
                            {
                                new Page { date = "today", index = "label", title = SiteConfig.generalLocalizer["meta_label_closed_qa_today"].Value },
                                new Page { date = "thisweek", index = "label", title = SiteConfig.generalLocalizer["meta_label_closed_qa_week"].Value },
                                new Page { date = "thismonth", index = "label", title = SiteConfig.generalLocalizer["meta_label_closed_qa_month"].Value },
                            }
                        }
                    }
                },
                new Page {
                    controller = "qa",
                    index = "archive",
                    title = "meta_qa_archive",
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "qa",
                    index = "categories",
                    title = "meta_qa_categories",
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "qa",
                    index = "archivelist",
                    title = "meta_qa_archive_list",
                    description = "",
                    imageurl = ""
                },
                new Page {
                    controller = "qa",
                    index = "labels",
                    child = new List<Page>
                    {
                        new Page { order = "normal", title = SiteConfig.generalLocalizer["meta_qa_label_list"].Value },
                        // labels with search term (search label functionality)
                        new Page { order = "search", title = SiteConfig.generalLocalizer["meta_qa_label_list_search"].Value }
                    }
                },
                new Page {
                    controller = "qa",
                    index = "search",
                    title = "meta_qa_search"
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
