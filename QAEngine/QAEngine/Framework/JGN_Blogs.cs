using Jugnoon.Entity;
using Jugnoon.Models;
using Jugnoon.Utility;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jugnoon.Framework
{ 
    public partial class JGN_Blogs
    {
        [Key]
        public long id { get; set; }
        [MaxLength(450)]
        public string userid { get; set; }
        [MaxLength(200)]
        public string title { get; set; }
        public string description { get; set; }
        [MaxLength(400)]
        public string tags { get; set; }
        public byte isadult { get; set; }
        public DateTime created_at { get; set; }
        public byte isenabled { get; set; }
        public int views { get; set; }
        public int comments { get; set; }
        public int total_ratings { get; set; }
        public float ratings { get; set; }
        public float avg_rating { get; set; }
        public int favorites { get; set; }
        public byte iscomments { get; set; }
        public byte isapproved { get; set; }
        public int liked { get; set; }
        public int disliked { get; set; }
        [MaxLength(150)]
        public string fetch_url { get; set; }
        public string picture_url { get; set; }
        [MaxLength(150)]
        public string cover_url { get; set; }
        [MaxLength(200)]
        public string picture_caption { get; set; }
        public byte isfeatured { get; set; }
        public byte mode { get; set; }
        public long artistid { get; set; }

        // internal use only
        [NotMapped]
        public string url { get; set; }
        
        [NotMapped]
        public string videourl { get; set; }
       
        [NotMapped]
        public string author_url { get; set; }

        [NotMapped]
        public List<FileEntity> files { get; set; }
        [NotMapped]
        public ApplicationUser author { get; set; }

        [NotMapped]
        public string[] categories { get; set; }

        [NotMapped]
        public List<JGN_CategoryContents> category_list { get; set; }
    }
}
