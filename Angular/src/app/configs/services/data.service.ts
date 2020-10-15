/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../reducers/store/model";
import { Injectable } from "@angular/core";
//import { ConfigAPIActions } from "../../reducers/configs/actions";
import { HttpClient } from "@angular/common/http";
import { ConfigSettingsService } from "./settings.service";
//import { CoreAPIActions } from "../../reducers/core/actions";
import {
  loadStarted,
  loadSucceeded,
  loadFailed
} from "../../reducers/configs/actions";

@Injectable()
export class ConfigDataService {
  
  constructor(
    private _store: Store<IAppState>,
    private settings: ConfigSettingsService,
    private http: HttpClient
  ) {
  }

  /* -------------------------------------------------------------------------- */
  /*                           Core load data api call                          */
  /* -------------------------------------------------------------------------- */
  LoadRecords(FilterOptions, app_type) {
    let URL = this.settings.getApiOptions().load;
    if (app_type === "admin") {
       URL = this.settings.getApiOptions().load_admin;
    }
    this._store.dispatch(new loadStarted({}));
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadSucceeded(data));
      },
      err => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

}
