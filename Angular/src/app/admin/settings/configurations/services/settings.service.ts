/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as OPTIONS from "../configuration.model";
import { iUploadOptions } from "../../../core/core.model";
import { AppConfig } from "../../../../configs/app.config";
import { CoreService } from "../../../core/coreService";
import { ThemeCSS } from "../../../../configs/themeSettings";

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
      load: APIURL + "api/configuration/load",
      //proc: APIURL + 'api/configuration/proc',
      specific: {},
      general: {
        dbsetup: APIURL + "api/configuration/dbsetup",
        dbsetupcompleted: APIURL + "api/configuration/dbsetupcompleted",
        dbusersetup: APIURL + "api/user/dbusersetup",
        general: APIURL + "api/configuration/general",
        premium: APIURL + "api/configuration/premium",
        media: APIURL + "api/configuration/media",
        features: APIURL + "api/configuration/features",
        listings: APIURL + "api/configuration/listings",
        authentication: APIURL + "api/configuration/authentication",
        registration: APIURL + "api/configuration/registration",
        aws: APIURL + "api/configuration/aws",
        social: APIURL + "api/configuration/social",
        contact: APIURL + "api/configuration/contact",
        smtp: APIURL + "api/configuration/smtp",
        comment: APIURL + "api/configuration/comment",
        location: APIURL + "api/configuration/location",
        rechapcha: APIURL + "api/configuration/rechapcha"
      },
      qa: {
        general: APIURL + "api/qa/configs_general"
      }
    };

    this.init_toolbar_options();

    this.init_search_options([]);
  }

  init_search_options(navList: any) {
    this.searchOptions = {
      showpanel: true, // show, hide whole panel
      showSearchPanel: false,
      showAdvanceSearchLink: false,
      term: "",
      topselectioncheck: true,
      navList: navList,
      filters: [],
      dropdownFilters: [],
      checkFilters: [],
      categories: [],
      selectedcategory: "",
      singleaction: false,
      actions: []
    };
  }

  init_toolbar_options() {
    this.toolbarOptions = {
      showtoolbar: false,
      showsecondarytoolbar: false,
      showcheckAll: true,
      navbarcss: ThemeCSS.NAVBAR_CSS,
      left_options: [],
      left_caption: "Filter:",
      right_caption: "",
      right_options: [],
      actions: []
    };
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

  getSearchOptions(navList: any) {
    this.init_search_options(navList);
    return this.searchOptions;
  }
}
