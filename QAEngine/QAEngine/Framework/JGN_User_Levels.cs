
using System.ComponentModel.DataAnnotations;

namespace Jugnoon.Framework
{    
    public partial class JGN_User_Levels
    {
        [Key]
        public int id { get; set; }

        [MaxLength(100)]
        public string userid { get; set; }
        public short levels { get; set; }
        public int points { get; set; }
        public int credits { get; set; }
        public int init_points { get; set; }
        public int max_points { get; set; }
        public int level_id { get; set; }
    
        // public virtual ga_users ga_users { get; set; }
    }
}
