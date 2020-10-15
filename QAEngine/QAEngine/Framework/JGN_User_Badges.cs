using System;
using System.ComponentModel.DataAnnotations;

namespace Jugnoon.Framework
{    
    public partial class JGN_User_Badges
    {
        [Key]
        public string userid { get; set; }
        public int badge_id { get; set; }
        public byte type { get; set; }
        public Nullable<System.DateTime> created_at { get; set; }
        public short repeated { get; set; }
    
        //public virtual JGN_Badges ga_badges { get; set; }
        //public virtual ApplicationUser ga_users { get; set; }
    }
}
