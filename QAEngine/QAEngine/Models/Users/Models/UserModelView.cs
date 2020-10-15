
using Jugnoon.Utility;
using System.Collections.Generic;
using Jugnoon.Framework;
using Jugnoon.qa.Models;

/// <summary>
/// User Profile Model View
/// </summary>
namespace Jugnoon.Models
{
    public class UserModelView
    {
        public string UserName { get; set; } = ""; // username or userid
        public ApplicationUser user { get; set; }  // for general user data loading
        public List<JGN_Attr_Values> attr_values { get; set; }
        public NavModelView Nav { get; set; }
        public string Message { get; set; } = "";
        public AlertTypes AlertType { get; set; } = AlertTypes.Success;

        public bool UserExist { get; set; } = true;

        public bool OwnProfile { get; set; } = false;

        public string FullName { get; set; } = "";

        public string UserInfo { get; set; }

        public int ActiveIndex { get; set; }

        public qaListViewModel qa { get; set; }


    }
}