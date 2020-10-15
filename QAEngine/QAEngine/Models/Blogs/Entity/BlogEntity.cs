using Jugnoon.Entity;
using Jugnoon.Utility;
using System;
namespace Jugnoon.Blogs
{
    public class BlogEntity : ContentEntity
    {
        public string fetch_url { get; set; } = "";
        public long postid { get; set; } = 0;
        public DateTime created_at { get; set; } = DateTime.Now;
        public CommentActionTypes iscomments { get; set; } = CommentActionTypes.All;

    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */

