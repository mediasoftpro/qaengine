/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export class NormalRegex {
  static readonly USERNAME_REGEX = "^[a-z0-9_-]{5,15}$";
  static readonly PASSWORD_REGEX =
    "^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$";
  static readonly WEBSITE_REGEX =
    "https?://(www.)?[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)";
}

export class AppNavigation {
  
  // myaccount sub menus
  static readonly MYACCOUNT_SETTINGS = [
    { title: "Dashboard", value: "/", index: 0, icon: "fa fa-map-marker" },
    { title: "Edit Profile", value: "/profile-setup", index: 1, icon: "fa fa-user" },
    { title: "My Questions", value: "/my-qa", index: 2 , icon: "fa fa-list"},
    { title: "Answered Questions", value: "/my-qa/answered", index: 9 , icon: "fa fa-list"},
    { title: "Favorited Questions", value: "/my-qa/favorites", index: 10 , icon: "fa fa-list"},
    { title: "Liked Questions", value: "/my-qa/liked", index: 11 , icon: "fa fa-list"},
    { title: "Change Password", value: "/manage-account", index: 4, icon: "fa fa-lock" },
    { title: "Log Out", value: "/", index: 8, icon: "fas fa-sign-out-alt" }
  ];
  
}

export class NavigationMenuIndex {
  // Index to highlight and load appropriate sub menus for different contents
  // top menu index
  static readonly TOPMENU_SETTINGS_INDEX = 0;
  static readonly TOPMENU_FORUMS_INDEX = 1;


  // settings sub menu indexes
  static readonly SETTINGS_OVERVIEW_INDEX = 0;
  static readonly SETTINGS_PROFILE_SETUP_INDEX = 1;
  static readonly SETTINGS_MESSAGES_INDEX = 9;

  static readonly SETTINGS_EMAIL_OPTIONS_INDEX = 2;
  static readonly SETTINGS_MANAGE_ACCOUNT_INDEX = 4;

  // qa
  static readonly QA_MY_INDEX = 0;
  static readonly QA_ANSWERED_INDEX = 1;
  static readonly QA_FAVORITED_INDEX = 2;
  static readonly QA_LIKED_INDEX = 3;
 }

export class ContentTypes {
  
  static readonly BADGES_TYPES = [
    {
      title: "Badges",
      value: "1",
      add_title: "Add Badge",
      add_tooltip: "Add new badge"
    },
    {
      title: "Rewards",
      value: "2",
      add_title: "Add Reward",
      add_tooltip: "Add new reward"
    },
    {
      title: "Levels",
      value: "3",
      add_title: "Add Level",
      add_tooltip: "Add new level"
    },
    {
      title: "Points",
      value: "4",
      add_title: "Add Points",
      add_tooltip: "Add new points"
    },
    {
      title: "Credits",
      value: "5",
      add_title: "Add Credits",
      add_tooltip: "Add new credits"
    },
    {
      title: "Packages",
      value: "6",
      add_title: "Add Packages",
      add_tooltip: "Add new packages"
    }
  ];

  static readonly ROLE_TYPES = [
    {
      title: "Roles",
      value: "1",
      add_title: "Add Role",
      add_tooltip: "Add new role"
    },
    {
      title: "Role Objects",
      value: "2",
      add_title: "Add Role Object",
      add_tooltip: "Add new role"
    }
  ];

  static readonly USER_TYPES = [
    { title: "User", value: "Member" },
    { title: "Administrator", value: "Admin" },
    { title: "Certified User", value: "Manager" }
  ];
}
