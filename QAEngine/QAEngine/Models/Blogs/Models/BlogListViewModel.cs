using Jugnoon.Entity;
using Jugnoon.Framework;
using Jugnoon.Models;
using System.Collections.Generic;

namespace Jugnoon.Blogs.Models
{
    public class BlogListViewModel : ListViewModel
    {
        public int TotalRecords { get; set; }
        public List<JGN_Blogs> DataList { get; set; }
        public BlogEntity QueryOptions { set; get; }
        public BlogListFilterViewModel Navigation { get; set; }

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

