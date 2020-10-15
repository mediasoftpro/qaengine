
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Jugnoon.Framework
{   
    public partial class JGN_Badges_LevelAssociates
    {
        [Key]
        public int id { get; set; }
        public int levelid { get; set; }
        public int rewardid { get; set; }
        public string description { get; set; }

        [NotMapped]
        public JGN_Badges ga_badges { get; set; }
    }
}
