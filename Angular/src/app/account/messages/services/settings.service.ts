import { Injectable } from "@angular/core";

import * as OPTIONS from "../messages.model";
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
      load: APIURL + "api/messages/load",
      load_recipents: APIURL + "api/messages/load_recipents",
      marked_as_read: APIURL + "api/messages/marked_as_read",
      getinfo: APIURL + "api/messages/getinfo",
      action: APIURL + "api/messages/action",
      proc: APIURL + "api/messages/send_message",
    };
  }

  getApiOptions() {
    return this.apiOptions;
  }
}
