using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jugnoon.Models;

namespace Jugnoon.Framework
{        
    public partial class JGN_Qa
    {
        [Key]
        public long id { get; set; }
        [MaxLength(150)]
        public string title { get; set; }
        public string description { get; set; }
        [MaxLength(100)]
        public string userid { get; set; }
        [MaxLength(300)]
        public string tags { get; set; }
        public DateTime created_at { get; set; }
        public int votes { get; set; }
        public int views { get; set; }
        public int favorites { get; set; }
        public int answers { get; set; }
        public byte isenabled { get; set; }
        public byte isapproved { get; set; }
        public byte isadult { get; set; }
        public byte isclosed { get; set; }
        public byte isfeatured { get; set; }
        public byte mode { get; set; }
        public byte isresolved { get; set; }
        public int comments { get; set; }
        public long contentid { get; set; }
        public byte contenttype { get; set; }

        [NotMapped]
        public string url { get; set; }
        [NotMapped]
        public string author_url { get; set; }
        [NotMapped]
        public string editurl { get; set; }
        [NotMapped]
        public ApplicationUser author { get; set; }
        [NotMapped]
        public List<JGN_QAnswers> qa_answers { get; set; }

        [NotMapped]
        public string customize_date { get; set; }

        [NotMapped]
        public string[] categories { get; set; }

        [NotMapped]
        public List<JGN_CategoryContents> category_list { get; set; }


        [NotMapped]
        public bool isadmin { get; set; }
    }
}
