using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Jugnoon.Framework
{  
    public partial class JGN_BadgeCategories
    {
        public JGN_BadgeCategories()
        {
            //this.ga_badges = new HashSet<ga_badges>();
        }
        [Key]
        public short id { get; set; }
        [MaxLength(140)]
        public string title { get; set; }
        [MaxLength(50)]
        public string shorttitle { get; set; }
        public string description { get; set; }
        public byte type { get; set; }
        public int priority { get; set; }
    
        public ICollection<JGN_Badges> ga_badges { get; set; }
    }
}
