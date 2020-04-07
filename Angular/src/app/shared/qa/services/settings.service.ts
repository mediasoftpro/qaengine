/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as OPTIONS from "../qa.model";
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
      load: APIURL + "api/qa/load",
      load_reports: APIURL + "api/qa/load_reports",
      getinfo: APIURL + "api/qa/getinfo",
      action: APIURL + "api/qa/action",
      answeraction: APIURL + "api/qa/ansaction",
      panswer: APIURL + "api/qa/postanswer",
      proc: APIURL + "api/qa/proc",
      load_categories: APIURL + "api/categories/load_nm",
      authorize_author: APIURL + "api/qa/authorize_author"
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
          default_value: 3,
          selected: false,
          attr: "isfeatured"
        }
      ],
      dropdownFilters: [],
      checkFilters: [
        {
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
        }
      ],
      categories: [],
      multiselectOptions: this.coreService.getMultiCategorySettings(),
      selectedcategory: "",
      singleaction: false,
      actions: this.navActions(true)
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
      categories: [],
      selectedcategory: "",
      singleaction: false,
      actions: this.navActions(false)
    };
  }

  navActions(isadmin: boolean) {
    if (isadmin) {
      return [
        {
          id: 1,
          title: "Ask Question",
          tooltip: "Ask new question",
          row: 1,
          icon: "icon-file-plus",
          options: {},
          css: "btn m-b-5 btn-block btn-success",
          event: "add"
        },
        {
          id: 100,
          title: "Abuse Reports",
          tooltip: "Load Reported Records",
          css: "btn m-b-5 btn-block btn-danger",
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
          title: "Ask Question",
          tooltip: "Ask new question",
          row: 1,
          icon: "icon-file-plus",
          options: {},
          css: "btn btn-success",
          event: "add"
        }
      ];
    }
  }

  init_admin_toolbar_options() {
    let options = {
      showtoolbar: true,
      showsecondarytoolbar: true,
      showcheckAll: false,
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
          tooltip: "Load Featured Questions"
        },
        {
          id: "3",
          title: "Normal",
          value: 0,
          isclick: true,
          clickevent: "f_featured",
          tooltip: "Load Normal Questions"
        },
        {
          id: "4",
          title: "Approved",
          value: 1,
          isclick: true,
          clickevent: "f_isapproved",
          tooltip: "Load Approved Questions"
        },
        {
          id: "4",
          title: "Unapproved",
          value: 0,
          isclick: true,
          clickevent: "f_isapproved",
          tooltip: "Load Unapproved Questions"
        },
        {
          id: "5",
          title: "Enabled",
          value: 1,
          isclick: true,
          clickevent: "f_status",
          tooltip: "Load Enabled Questions"
        },
        {
          id: "6",
          title: "Disabled",
          value: 0,
          isclick: true,
          clickevent: "f_status",
          tooltip: "Load Disabled Questions"
        },
        {
          id: "6",
          title: "Adult",
          value: 1,
          isclick: true,
          clickevent: "f_adult",
          tooltip: "Load Adult Questions"
        },
        {
          id: "6",
          title: "Non Adult",
          value: 1,
          isclick: true,
          clickevent: "f_adult",
          tooltip: "Load Non Adult Questions"
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
          tooltip: "Mark as premium"
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

  init_account_toolbar_options(type: number) {
    let options = {
      showtoolbar: true,
      showsecondarytoolbar: true,
      showcheckAll: false,
      navbarcss: ThemeCSS.NAVBAR_CSS,
      left_options: [],
      left_caption: "",
      right_caption: "",
      right_options: [],
      actions: []
    };
    let actionstatus = "delete";
    switch (type) {
      case 1:
        actionstatus = "delete_fav";
        break;
      case 2:
        actionstatus = "delete_like";
        break;
      case 3:
        actionstatus = "delete_ans";
        break;
    }
    options.actions.push({
      title: "Mark As",
      ismultiple: true,
      icon: "",
      Options: [
        {
          id: "2",
          title: "Delete",
          value: 0,
          actionstatus: actionstatus,
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

  navList() {
    return [];
  }

  getApiOptions() {
    return this.apiOptions;
  }

  getToolbarOptions(type: number, isadmin: boolean) {
    if (isadmin) {
      return this.init_admin_toolbar_options();
    } else {
      return this.init_account_toolbar_options(type);
    }
  }

  getSearchOptions(isadmin: boolean) {
    if (isadmin) {
      return this.init_admin_search_options();
    } else {
      return this.init_account_search_options();
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                       Options for top search options                       */
  /* -------------------------------------------------------------------------- */
  getTopSearchSettings() {
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
            { id: 3, title: "This Month", value: 3 },
            { id: 4, title: "This Year", value: 4 },
            { id: 5, title: "All Time", value: 0 }
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
          value: "qa.created_at desc",
          attr: "order",
          options: [
            { id: 1, title: "Upload Date", value: "qa.created_at desc" },
            {
              id: 2,
              title: "View Count",
              value: "qa.views desc, qa.created_at desc"
            },
            {
              id: 3,
              title: "Rating",
              value: "qa.avg_rating desc, qa.created_at desc"
            }
          ]
        }
      ]
    };
  }

  getInitObject(): OPTIONS.QAEntity {
    return {
      id: 0,
      userid: "",
      title: "",
      description: "",
      category_list: [],
      tags: "",
      isenabled: 1,
      isapproved: 1
    };
  }

  getAnswerInitObject(): OPTIONS.QANSWERENTITY {
    return {
      id: 0,
      qid: 0,
      userid: "",
      description: ""
    };
  }
}
