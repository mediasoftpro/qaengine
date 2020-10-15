using System.ComponentModel.DataAnnotations;
namespace Jugnoon.Framework
{
    public partial class JGN_User_Stats
    {
        [Key]
        public long id { get; set; }
        [MaxLength(100)]
        public string userid { get; set; }
        public int stat_qa { get; set; }
        public int stat_qaanswers { get; set; }
        public int stat_qa_fav { get; set; }

    }
}
