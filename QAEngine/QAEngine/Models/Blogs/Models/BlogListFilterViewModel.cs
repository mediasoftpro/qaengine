
using Jugnoon.Models;

namespace Jugnoon.Blogs.Models
{
    public class BlogListFilterViewModel : ListFilterViewModel
    {
        // order dropdown urls
        public string order_recent_url { get; set; }
        public string order_featured_url { get; set; }
        // filter dropdown urls
        public string filter_date_today_url { get; set; }
        public string filter_date_thisweek_url { get; set; }
        public string filter_date_thismonth_url { get; set; }
        public string filter_date_alltime_url { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

