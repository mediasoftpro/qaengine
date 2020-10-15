using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QAEngine.Areas.api.Models
{
    public class SendMessageModelView
    {
        public long companyid { get; set; }
        public string subject { get; set; }
        public string message { get; set; }
        public string templatename { get; set; }
        public string to_uid { get; set; }
        public string from_uid { get; set; }
    }
}
