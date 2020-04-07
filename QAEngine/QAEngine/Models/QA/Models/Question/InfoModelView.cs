using Jugnoon.Framework;
using System;
using System.Collections.Generic;
using Jugnoon.Models;

namespace Jugnoon.qa.Models
{
    public class InfoModelView
    {
        //public int type = 11; // 1: qa Question, 2: qa Answer
        public string title { get; set; } = "";
        public int total_comments { get; set; } = 0;
        public long qid { get; set; } = 0;
        public string description { get; set; } = "";
        public ApplicationUser author { get; set; }

        /// <summary>
        /// Content category info object (Included detail information for all categories associated with content)
        /// </summary>
        public List<JGN_CategoryContents> category { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public string tags { get; set; } = "";
        protected string post_handler { get; set; } = "";
        protected string post_params { get; set; } = "";
        public bool isadmin { get; set; } = false;
        public int iscomment { get; set; } = 1; // 1: on, 0: off
        public string content_type { get; set; } = "Question";
        public int pagenumber { get; set; } = 1;
        public bool show_author_photo { get; set; } = false;
        public int pagesize { get; set; } = 5;
        public string order { get; set; } = "c.level desc"; // c.clevel order must be used in case reply is on. "points desc, created_at desc";
        public int comment_template_id { get; set; } = 3; // light version
        public bool show_reply_link { get; set; } = true;
        public bool show_vote_link { get; set; } = true;
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
