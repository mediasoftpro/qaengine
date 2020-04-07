using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jugnoon.Models;

namespace Jugnoon.Framework
{
    public partial class JGN_QAnswers
    {
        [Key]
        public long id { get; set; }
        public long qid { get; set; }
        [MaxLength(100)]
        public string userid { get; set; }
        public string description { get; set; }
        public DateTime created_at { get; set; }
        public int votes { get; set; }
        public byte isenabled { get; set; }
        public byte isapproved { get; set; }
        public byte isanswer { get; set; }
        public int comments { get; set; }

        [NotMapped]
        public ApplicationUser author { get; set; }

        [NotMapped]
        public int answers { get; set; }

        [NotMapped]
        public string customize_date { get; set; }
    }
}
