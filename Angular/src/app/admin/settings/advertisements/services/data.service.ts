/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import { Injectable } from "@angular/core";
// import { AdvertisementAPIActions } from "../../../../reducers/settings/advertisements/actions";
import { HttpClient } from "@angular/common/http";

import { SettingsService } from "./settings.service";
//import { CoreAPIActions } from "../../../../reducers/core/actions";
import { loadStarted, loadSucceeded, loadFailed, updateRecord} from "../../../../reducers/settings/advertisements/actions";
import { refreshListStats } from "../../../../reducers/core/actions";
import { Notify } from "../../../../reducers/core/actions";

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
  LoadRecords(FilterOptions) {
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadStarted({}));
    
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadSucceeded(data));
        // update list stats
        this._store.dispatch(new refreshListStats({
          totalrecords: data.records,
          pagesize: FilterOptions.pagesize,
          pagenumber: FilterOptions.pagenumber
        }));
       
      },
      err => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

  UpdateRecord(obj) {
    // update record in state
    this._store.dispatch(new updateRecord(obj));

    this.http
      .post(this.settings.getApiOptions().proc, JSON.stringify(obj))
      .subscribe(
        (data: any) => {
          this._store.dispatch(new Notify({
            title: "Record Updated Successfully",
            text: "",
            css: "bg-danger"
          }));
        },
        err => {
           this._store.dispatch(new Notify({
            title: "Error Occured",
            text: "",
            css: "bg-danger"
          }));
        }
      );
  }
}
