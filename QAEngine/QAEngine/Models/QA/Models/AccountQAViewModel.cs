using Jugnoon.qa;
using Jugnoon.Utility;
using System.ComponentModel.DataAnnotations;


namespace Jugnoon.qa.Models
{
    public class AccountqaModelView
    {
        public long Qid { get; set; }
        public long Aid { get; set; }
        public string Title { get; set; }
        public bool isAdmin { get; set; }
        public string UserName { get; set; }
        public string AuthorUserName { get; set; }
        public int Answers { get; set; }
        public int isClosed { get; set; }
        public QAEntity Info { get; set; }

        public string Message { get; set; }

        public AlertTypes AlertType { get; set; }

        public string[] Categories { get; set; }

        
        [Required(ErrorMessage = "Content Required")]
        public string Content { get; set; }

        public bool isAllowed { get; set; }

        public string DetailMessage { get; set; }

        public bool EditMode { get; set; }

        public string HeadingTitle { get; set; }

    }

}

/*
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.md', which is part of this source code package.
 * Copyright 2007 - 2020 MediaSoftPro
 * For more information email at support@mediasoftpro.com
 */
