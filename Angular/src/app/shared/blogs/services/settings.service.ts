/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as OPTIONS from "../blogs.model";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";
import { ButtonCSS, ICONCSS, ThemeCSS } from "../../../configs/themeSettings";

@Injectable()
export class SettingsService {
  // configurations
  private apiOptions: OPTIONS.IAPIOptions;

  constructor(private coreService: CoreService, public config: AppConfig) {
    const APIURL = config.getConfig("host");
    this.apiOptions = {
      load: APIURL + "api/blogs/load",
      generate_report: APIURL + "api/blogs/generate_report",
      load_reports: APIURL + "api/blogs/load_reports",
      getinfo: APIURL + "api/blogs/getinfo",
      action: APIURL + "api/blogs/action",
      proc: APIURL + "api/blogs/proc",
      load_categories: APIURL + "api/categories/load_nm",
      authorize_author: APIURL + "api/blogs/authorize_author"
    };
  }

  init_account_search_options() {
    return {
      showpanel: true, // show, hide whole panel
      showSearchPanel: true,
      showAdvanceSearchLink: true,
      term: "",
      topselectioncheck: true,
      navList: [],
      filters: [],
      dropdownFilters: [
        {
          id: 1,
          value: 0,
          group: "datefilter",
          caption: "Added",
          attr: "datefilter",
          options: [
            {
              id: 1,
              title: "Today",
              value: 1
            },
            {
              id: 2,
              title: "This Week",
              value: 2
            },
            {
              id: 3,
              title: "This Month",
              value: 3
            },
            {
              id: 4,
              title: "This Year",
              value: 4
            },
            {
              id: 5,
              title: "All Time",
              value: 0
            }
          ]
        },
        {
          id: 2,
          value: "blog.created_at desc",
          group: "order",
          caption: "Order",
          attr: "order",
          options: [
            {
              id: 1,
              title: "Posted Date",
              value: "blog.created_at desc"
            },
            {
              id: 2,
              title: "Title ASC",
              value: "blog.title asc"
            },
            {
              id: 3,
              title: "Title DESC",
              value: "blog.title desc"
            }
          ]
        }
      ],
      checkFilters: [],
      categories: [],
      selectedcategory: "",
      singleaction: false,
      actions: this.navActions(false)
    };
  }

  init_admin_search_options() {
    return {
      showpanel: true, // show, hide whole panel
      showSearchPanel: true,
      showAdvanceSearchLink: true,
      term: "",
      topselectioncheck: true,
      navList: [],
      filters: [
        {
          id: 1,
          title: "Featured",
          value: 1,
          default_value: 2,
          selected: false,
          attr: "isfeatured"
        },
        {
          id: 3,
          title: "Adult",
          value: 1,
          default_value: 2,
          selected: false,
          attr: "isadult"
        }
      ],
      dropdownFilters: [ {
        id: 1,
        value: 2,
        group: "isenabled",
        caption: "Enable Status",
        attr: "isenabled",
        options: [
          {
            id: 4,
            title: "Active",
            value: 1
          },
          {
            id: 5,
            title: "Inactive",
            value: 0
          },
          {
            id: 6,
            title: "Any",
            value: 2
          }
        ]
      },
      {
        id: 1,
        value: 2,
        group: "isapproved",
        caption: "Approval Status",
        attr: "isapproved",
        options: [
          {
            id: 4,
            title: "Approved",
            value: 1
          },
          {
            id: 5,
            title: "Under Review",
            value: 0
          },
          {
            id: 6,
            title: "Any",
            value: 2
          }
        ]
      },
      {
        id: 1,
        value: 0,
        group: "datefilter",
        caption: "Added",
        attr: "datefilter",
        options: [
          {
            id: 1,
            title: "Today",
            value: 1
          },
          {
            id: 2,
            title: "This Week",
            value: 2
          },
          {
            id: 3,
            title: "This Month",
            value: 3
          },
          {
            id: 4,
            title: "All Time",
            value: 0
          }
        ]
      }],
      checkFilters: [],
      categories: [],
      multiselectOptions: this.coreService.getMultiCategorySettings(),
      selectedcategory: [],
      singleaction: false,
      actions: this.navActions(true)
    };
  }

  init_admin_toolbar_options() {
    let options = {
      showtoolbar: true,
      showsecondarytoolbar: true,
      showcheckAll: true,
      navbarcss: ThemeCSS.NAVBAR_CSS,
      left_options: [],
      left_caption: "",
      right_caption: "",
      right_options: [],
      actions: []
    };
    options.left_options.push({
      title: "Status",
      ismultiple: true,
      icon: "", // icon-sort-amount-desc position-left
      Options: [
        {
          id: "1",
          title: "Show All",
          value: 0,
          isclick: true,
          clickevent: "f_reset",
          tooltip: "Show all items"
        },
        { id: "2", separator: true },
        {
          id: "2",
          title: "Featured",
          value: 1,
          isclick: true,
          clickevent: "f_featured",
          tooltip: "Load Featured Posts"
        },
        {
          id: "4",
          title: "Approved",
          value: 1,
          isclick: true,
          clickevent: "f_isapproved",
          tooltip: "Load Approved Posts"
        },
        {
          id: "4",
          title: "Unapproved",
          value: 0,
          isclick: true,
          clickevent: "f_isapproved",
          tooltip: "Load Unapproved Posts"
        },
        {
          id: "5",
          title: "Enabled",
          value: 1,
          isclick: true,
          clickevent: "f_status",
          tooltip: "Load Enabled Posts"
        },
        {
          id: "6",
          title: "Disabled",
          value: 0,
          isclick: true,
          clickevent: "f_status",
          tooltip: "Load Disabled Posts"
        },
        {
          id: "6",
          title: "Adult",
          value: 1,
          isclick: true,
          clickevent: "f_adult",
          tooltip: "Load Adult Posts"
        },
        {
          id: "6",
          title: "Non Adult",
          value: 1,
          isclick: true,
          clickevent: "f_adult",
          tooltip: "Load Non Adult Posts"
        }
      ]
    });

    options.right_options.push({
      title: "Order",
      ismultiple: true,
      position: "right",
      icon: "icon-sort-by-order-alt position-left",
      Options: [
        {
          id: "0",
          title: "Date",
          value: "created_at",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by records by Date"
        },
        {
          id: "1",
          title: "Title",
          value: "title",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Title"
        },
        {
          id: "3",
          title: "Featured",
          value: "isfeatured",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Featured"
        },
        {
          id: "5",
          title: "Approved",
          value: "isapproved",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Approval Status"
        },
        {
          id: "8",
          title: "Status",
          value: "isenabled",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Status"
        },
        {
          id: "6",
          title: "Liked",
          value: "liked",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Likes"
        },
        {
          id: "7",
          title: "Views",
          value: "views",
          isclick: true,
          clickevent: "orderby",
          tooltip: "Order by Views"
        }
      ]
    });

    options.actions.push({
      title: "Mark As",
      ismultiple: true,
      icon: "",
      Options: [
        {
          id: "0",
          title: "Approve",
          value: 1,
          actionstatus: "approve",
          attr: "isapproved",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Approve selected records"
        },
        {
          id: "1",
          title: "Enable",
          value: 1,
          actionstatus: "enable",
          attr: "isenabled",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Enable selected records"
        },
        {
          id: "2",
          title: "Disable",
          value: 0,
          actionstatus: "disable",
          attr: "isenabled",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Disable selected records"
        },
        {
          id: "0",
          title: "Featured",
          value: 1,
          actionstatus: "featured",
          attr: "isfeatured",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Mark as featured"
        },
        {
          id: "1",
          title: "Normal",
          value: 0,
          actionstatus: "featured",
          attr: "isfeatured",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Mark as normal post"
        },
        {
          id: "3",
          title: "Adult",
          value: 1,
          actionstatus: "adult",
          isclick: true,
          attr: "isadult",
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Mark as adult"
        },
        {
          id: "4",
          title: "Non Adult",
          value: 0,
          actionstatus: "nonadult",
          attr: "isadult",
          isclick: true,
          clickevent: "m_markas",
          icon: "",
          css: ButtonCSS.SUCCESS_BUTTON,
          tooltip: "Mark as non adult"
        },
        {
          id: "2",
          title: "Delete",
          value: 0,
          actionstatus: "delete",
          css: ButtonCSS.DANGER_BUTTON,
          attr: "",
          isclick: true,
          clickevent: "m_markas",
          icon: ICONCSS.DELETE_ICON,
          tooltip: "Delete selected records"
        }
      ]
    });

    return options;
  } 

  init_account_toolbar_options() {
    let options = {
      showtoolbar: true,
      showsecondarytoolbar: true,
      showcheckAll: true,
      navbarcss: ThemeCSS.NAVBAR_CSS,
      left_options: [],
      left_caption: "",
      right_caption: "",
      right_options: [],
      actions: []
    };

    options.right_options.push({
      title: "Sort By",
      ismultiple: true,
      icon: "",
      Options: [
        {
          id: "1",
          title: "Posted Date",
          value: 'blog.created_at desc',
          isclick: true,
          clickevent: "order",
          tooltip: ""
        },
        {
          id: "2",
          title: "View Count",
          value: 'blog.views desc, blog.created_at desc',
          isclick: true,
          clickevent: "order",
          tooltip: ""
        },
        {
          id: "3",
          title: "Rating",
          value: 'blog.avg_rating desc, blog.created_at desc',
          isclick: true,
          clickevent: "order",
          tooltip: ""
        }
      ]
    });

    options.actions.push({
      title: "Mark As",
      ismultiple: true,
      icon: "",
      Options: [
        {
          id: "2",
          title: "Delete",
          value: 0,
          actionstatus: "delete",
          css: ButtonCSS.DANGER_BUTTON,
          attr: "",
          isclick: true,
          clickevent: "m_markas",
          icon: ICONCSS.DELETE_ICON,
          tooltip: "Delete selected records"
        }
      ]
    });

    return options;
  }

  navActions(isAdmin) {
    if (isAdmin) {
      return [
        {
          id: 1,
          title: "Create Post",
          tooltip: "Create new article",
          row: 1,
          icon: "icon-file-plus",
          options: {},
          css: "btn btn-info btn-block",
          event: "add"
        },
        {
          id: 100,
          title: "Abuse Reports",
          tooltip: "Load Reported Records",
          css: "btn btn-block m-b-5 btn-danger",
          event: "abuse"
        },
        {
          id: 101,
          title: "Reports",
          tooltip: "Load Reports",
          css: "btn btn-block m-b-5 btn-info",
          event: "reports"
        }
      ];
    } else {
      return [
        {
          id: 1,
          title: "Create Post",
          tooltip: "Create new article",
          row: 1,
          icon: "icon-file-plus",
          options: {},
          css: "btn btn-block m-b-5 btn-success",
          event: "add"
        }
      ];
    }
  }

  navList() {
    return [];
  }

  /* -------------------------------------------------------------------------- */
  /*                       Options for left search options                      */
  /* -------------------------------------------------------------------------- */
  init_search_options() {
    return {
      showSearchPanel: true,
      term: "",
      filters: [
        /*
        Example Usage
        {
          id: 1,
          title: "Featured",
          value: 1,
          default_value: 2,
          selected: false,
          attr: "isfeatured"
        },
        {
          id: 2,
          title: "isAdult",
          value: 1,
          default_value: 2,
          selected: false,
          attr: "isadult"
        } 
        */
      ],
      dropdownFilters: [
        /* 
        Example Usage
        {
          id: 2,
          value: "created_at desc",
          group: "order",
          caption: "Order",
          attr: "order",
          options: [
            {
              id: 1,
              title: "Posted Date",
              value: "created_at desc"
            },
            {
              id: 2,
              title: "Title ASC",
              value: "title asc"
            }
          ]
        }
        */
      ],
      checkFilters: [
        /*
        Example Usage
        {
          id: 1,
          value: 0,
          group: "datefilter",
          caption: "Added",
          attr: "datefilter",
          options: [
            {
              id: 1,
              title: "Today",
              value: 1
            },
            {
              id: 2,
              title: "This Week",
              value: 2
            },
            {
              id: 3,
              title: "This Month",
              value: 3
            },
            {
              id: 4,
              title: "All Time",
              value: 0
            }
          ]
        } */
      ],
      categories: []
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                       Options for top search options                       */
  /* -------------------------------------------------------------------------- */
  init_top_search_options() {
    return {
      NavList: [
        {
          id: 1,
          title: "Upload Date",
          value: 0,
          attr: "datefilter",
          options: [
            { id: 1, title: "Today", value: 1 },
            { id: 2, title: "This Week", value: 2 },
            { id: 3, title: "This Month", value: 3},
            { id: 4, title: "This Year", value: 4},
            { id: 5, title: "All Time", value: 0}
          ]
        },
        {
          id: 1,
          title: "Categories",
          value: 0,
          attr: "categorid",
          options: []
        },
        {
          id: 2,
          title: "Sort By",
          value: 'blog.created_at desc',
          attr: "order",
          options: [
            { id: 1, title: 'Posted Date', value: 'blog.created_at desc' },
            { id: 2, title: 'Featured', value: 'blog.isfeatured desc, blog.created_at desc' },
            { id: 3, title: 'View Count', value: 'blog.views desc, blog.created_at desc' }
          ]
        }
      ]
    };
  }

  getApiOptions() {
    return this.apiOptions;
  }

  getToolbarOptions(isAdmin) {
    if (isAdmin) {
      return this.init_admin_toolbar_options();
    } else {
      return this.init_account_toolbar_options();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                        for admin navigation options                        */
  /* -------------------------------------------------------------------------- */
  getSearchOptions(isAdmin) {
    if (isAdmin) {
      return this.init_admin_search_options();
    } else {
      return this.init_account_search_options();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                          for public search options                         */
  /* -------------------------------------------------------------------------- */
  getSearchSettings() {
    return this.init_search_options();
  }

  getTopSearchSettings() {
     return this.init_top_search_options();
  }

  getInitObject(): OPTIONS.BlogEntity {
    return {
      id: 0,
      userid: "",
      title: "",
      description: "",
      categories: [],
      category_list: [],
      tags: "",
      picture_caption: "",
      picture_url: "",
      fetch_url: "",
      isadult: 0,
      cover_url: "",
      files: [],
      img_url: ""
    };
  }
}
