/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { Injectable } from "@angular/core";
// import { IDashboardAPIActions } from "../../../reducers/admin/dashboard/actions";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
// import { CoreAPIActions } from "../../../reducers/core/actions";

// reducer actions
import {
  loadStatsStarted,
  loadStatsSucceeded,
  loadStatsFailed
} from "../../../reducers/admin/dashboard/actions";



@Injectable()
export class DataService {
  constructor(
    private _store: Store<IAppState>,
    private settings: SettingsService,
    private http: HttpClient
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                           Core load data api call                          */
  /* -------------------------------------------------------------------------- */
  LoadStats() {
    const URL = this.settings.getApiOptions().load_stats;
    this._store.dispatch(new loadStatsStarted({}));
    this.http.post(URL, {}).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadStatsSucceeded(data));
      },
      err => {
        this._store.dispatch(new loadStatsFailed(err));
      }
    );
  }

}
