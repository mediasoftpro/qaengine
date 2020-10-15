
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Jugnoon.Models;

namespace Jugnoon.Framework
{    
    public partial class JGN_Badges_User_Achievements
    {
        [Key]
        public long id { get; set; }
        public string userid { get; set; }
        public string description { get; set; }
        public System.DateTime created_at { get; set; }
        public byte type { get; set; }

        [NotMapped]
        public ApplicationUser author { get; set; }
    }
}
