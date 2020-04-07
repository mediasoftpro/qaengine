
/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { ConfigurationsAPIActions } from "../../../../reducers/settings/configurations/actions";
import { HttpClient } from "@angular/common/http";

import { SettingsService } from "./settings.service";

@Injectable()
export class DataService {
  constructor(
    private settings: SettingsService,
    private http: HttpClient,
    private actions: ConfigurationsAPIActions
  ) {}

  LoadRecords() {
    const URL = this.settings.getApiOptions().load;
    this.actions.loadStarted();
    this.http.post(URL, {}).subscribe(
      (data: any) => {
        // update core data
        this.actions.loadSucceeded(data);
      },
      err => {
        this.actions.loadFailed(err);
      }
    );
  }

  /* global function for handling all configuration updated data and route to proper api call */
  UpdateConfigurations(entity: any, prop: string, child_prop: string) {
    let URL = "";
    switch (prop) {
      case "general":
        switch (child_prop) {
          case "dbsetup":
            URL = this.settings.getApiOptions().general.dbsetup;
            break;
          case "dbusersetup":
            URL = this.settings.getApiOptions().general.dbusersetup;
            break;
          case "general":
            URL = this.settings.getApiOptions().general.general;
            break;
         
          case "media":
            URL = this.settings.getApiOptions().general.media;
            break;
          case "features":
            URL = this.settings.getApiOptions().general.features;
            break;
          case "listings":
            URL = this.settings.getApiOptions().general.listings;
            break;
          case "authentication":
            URL = this.settings.getApiOptions().general.authentication;
            break;
          case "registration":
            URL = this.settings.getApiOptions().general.registration;
            break;
          case "aws":
            URL = this.settings.getApiOptions().general.aws;
            break;
          case "social":
            URL = this.settings.getApiOptions().general.social;
            break;
          case "contact":
            URL = this.settings.getApiOptions().general.contact;
            break;
          case "smtp":
            URL = this.settings.getApiOptions().general.smtp;
            break;
          case "rechapcha":
            URL = this.settings.getApiOptions().general.rechapcha;
            break;
        }
        break;
    
      case "qa":
        switch (child_prop) {
          case "general":
            URL = this.settings.getApiOptions().qa.general;
            break;
        }
        break;
     
    }
   
    return this.http.post(URL, entity);
  }

  
  SetupCompleted() {
    const URL = this.settings.getApiOptions().general.dbsetupcompleted;
    return this.http.post(URL, {});
  }
}
