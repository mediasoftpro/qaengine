using Jugnoon.Models;
using Jugnoon.qa;
using Jugnoon.Utility;

namespace Jugnoon.qa.Models
{
    public class QuestionViewModel
    {
        public QAEntity Data { get; set; }
        
        public qaActionViewModel Action { get; set; }

        public InfoModelView Info { get; set; }

        public AnsViewModel Ans { get; set; }

        public AccountqaModelView aPost { get; set; }

        public string PreviewUrl { get; set; }

        public string DetailMessage { get; set; }

        public bool isAllowed { get; set; }

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
