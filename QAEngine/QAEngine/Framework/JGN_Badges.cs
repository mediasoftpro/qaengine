
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Jugnoon.Framework
{    
    public partial class JGN_Badges
    {
        /*public ga_badges()
        {
            this.ga_badge_events = new HashSet<ga_badge_events>();
            this.ga_level_associate = new HashSet<ga_level_associate>();
            this.ga_user_badges = new HashSet<ga_user_badges>();
        }*/
        [Key]
        public int id { get; set; }
        [MaxLength(150)]
        public string title { get; set; }
        public string description { get; set; }
        [MaxLength(150)]
        public string icon { get; set; }
        [MaxLength(150)]
        public string icon_sm { get; set; }
        [MaxLength(150)]
        public string icon_lg { get; set; }
        public short category_id { get; set; }
        public byte type { get; set; }
        [MaxLength(100)]
        public string icon_css { get; set; }
        public short priority { get; set; }
        public int credits { get; set; }
        public int xp { get; set; }
        public float price { get; set; }
        public string notification { get; set; }
        public byte isdeduct { get; set; }
        public short ilevel { get; set; }
        public byte ishide { get; set; }
        public byte ismultiple { get; set; }
    
        // public ICollection<JGN_Badge_Events> ga_badge_events { get; set; }
        public ICollection<JGN_Badges_LevelAssociates> ga_level_associate { get; set; }
        public ICollection<JGN_User_Badges> ga_user_badges { get; set; }

        // internal use only
        public string img_url { get; set; }
    }
}
