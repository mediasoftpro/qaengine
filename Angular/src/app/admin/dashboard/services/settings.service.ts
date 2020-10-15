/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Injectable } from "@angular/core";
import * as OPTIONS from "../model";
import { iUploadOptions } from "../../core/core.model";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../core/coreService";
import { ButtonCSS, ICONCSS, ThemeCSS } from "../../../configs/themeSettings";

@Injectable()
export class SettingsService {
  // configurations
  private apiOptions: OPTIONS.IAPIOptions;
 

  constructor(private coreService: CoreService, public config: AppConfig) {
    const APIURL = config.getConfig("host");
    this.apiOptions = {
      load_stats: APIURL + "api/analytics/load_stats"
    };
  }
  
  getApiOptions() {
    return this.apiOptions;
  }

}
