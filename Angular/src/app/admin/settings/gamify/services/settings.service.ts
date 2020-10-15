/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as OPTIONS from "../gamify.model";
import { iUploadOptions } from "../../../core/core.model";
import { AppConfig } from "../../../../configs/app.config";
import { CoreService } from "../../../core/coreService";
import {
  ButtonCSS,
  ICONCSS,
  ThemeCSS
} from "../../../../configs/themeSettings";
import { ContentTypes } from "../../../../configs/settings";

@Injectable()
export class SettingsService {
  // configurations
  private apiOptions: OPTIONS.IAPIOptions;
  private uploadOptions: iUploadOptions;
  private toolbarOptions: any;
  private searchOptions: any;

  constructor(private coreService: CoreService, public config: AppConfig) {
    const APIURL = config.getConfig("host");
    this.apiOptions = {
      load: APIURL + "gamify/badge/load",
      getinfo: APIURL + "gamify/badge/getinfo",
      add: APIURL + "gamify/badge/add",
      remove: APIURL + "gamify/badge/remove",
      maxid: APIURL + "gamify/badge/maxid",
      action: APIURL + "gamify/badge/action",
      levelassociate: {
        load: APIURL + "gamify/levelassociate/load",
        add: APIURL + "gamify/levelassociate/add"
      },
      category: {
        load: APIURL + "gamify/category/load",
        add: APIURL + "gamify/category/add",
        action: APIURL + "gamify/category/action"
      }
    };

    this.init_toolbar_options();

    this.init_search_options();
  }

  init_search_options() {
    this.searchOptions = {
      showpanel: true, // show, hide whole panel
      showSearchPanel: true,
      showAdvanceSearchLink: false,
      term: "",
      topselectioncheck: true,
      navList: this.coreService.getSettingsNavList(),
      filters: [],
      dropdownFilters: [],
      checkFilters: [],
      categories: [],
      selectedcategory: "",
      singleaction: true,
      actions: []
    };
  }
  initialize_actions(type: number) {
    let title = "Add Badge";
    let tooltip = "Add new Badge";
    for (const option of ContentTypes.BADGES_TYPES) {
      if (option.value === type.toString()) {
        title = option.add_title;
        tooltip = option.add_tooltip;
      }
    }
    return [
      {
        id: 1,
        title: title, // 'Add Template',
        tooltip: tooltip, // 'Add new mail template',
        row: 1,
        icon: "icon-file-plus",
        options: {},
        css: "btn m-b-5 btn-block btn-success",
        event: "add"
      },
      {
        id: 2,
        title: "Manage Categories",
        tooltip: "Manage gamification categories",
        row: 1,
        icon: "icon-file-plus",
        options: {},
        css: "btn m-b-5 btn-block btn-info",
        event: "categories"
      }
    ];
  }

  init_toolbar_options() {
    this.toolbarOptions = {
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

    // supported mailtemplates content types
    for (const type of ContentTypes.BADGES_TYPES) {
      this.toolbarOptions.left_options.push({
        title: type.title,
        ismultiple: false,
        icon: "", // icon-sort-amount-desc position-left
        Options: [],
        clickevent: "f_type",
        value: type.value,
        tooltip: "Load " + type.title
      });
    }

    // this.toolbarOptions.right_options.push(this.coreService.getPaginationSettings());

    this.toolbarOptions.actions.push({
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
  }

  getApiOptions() {
    return this.apiOptions;
  }

  getUploadOptions() {
    return this.uploadOptions;
  }

  getToolbarOptions() {
    return this.toolbarOptions;
  }

  getSearchOptions() {
    return this.searchOptions;
  }
  getInitCategoryObject(): OPTIONS.GamiftyCategoryEntity {
    return {
      id: 0,
      type: 1,
      title: "",
      shorttitle: "",
      description: "",
      priority: 0
    };
  }
  getInitObject(): OPTIONS.GamifyEntity {
    return {
      id: 0,
      title: "",
      description: "",
      shorttitle: "",
      notification: "",
      categoryid: 0,
      ilevel: 0,
      type: 0,
      icon_css: "",
      priority: 0,
      price: 0,
      credits: 0,
      xp: 0,
      isdeduct: 0,
      ishide: 0,
      ismultiple: 0,
      icon: "",
      img_url: "",
      file: []
    };
  }
}
