using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Jugnoon.Entity;
using Jugnoon.Framework;
using Jugnoon.Utility;


namespace Jugnoon.qa.Models
{
    public class AskModelView
    {
        public long GroupID { get; set; }

        public long Qid { get; set; }

        public string UserName { get; set; }

        public string HeadingTitle { get; set; }

        public bool PostAccess { get; set; }

        public string PostMessage { get; set; }

        public bool isAdmin { get; set; }

        [Required(ErrorMessage = "Title Required")]
        [Display(Name = "Title")]
        [StringLength(100, MinimumLength = 3, ErrorMessage = "Title length not valid")]
        public string Title { get; set; }
              
        [Display(Name = "Description")]
        public string Description { get; set; }

        [StringLength(300, ErrorMessage = "Tags must not exceeds 300 chars.")]
        public string Tags { get; set; }
       
        public string[] Categories { get; set; }
              
        public List<JGN_Categories> CategoryList { get; set; }
           
        public string Message { get; set; }

        public AlertTypes AlertType { get; set; }
    }
}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
