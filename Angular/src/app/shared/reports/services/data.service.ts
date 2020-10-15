/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { Injectable } from "@angular/core";
// import { AbuseReportActions } from "../../../reducers/reports/abuse/actions";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
//import { CoreAPIActions } from "../../../reducers/core/actions";
import {
  loadStarted,
  loadSucceeded,
  loadFailed,
  applyChanges
} from "../../../reducers/reports/abuse/actions";

import { refreshListStats } from "../../../reducers/core/actions";
import { Notify } from "../../../reducers/core/actions";

/* -------------------------------------------------------------------------- */
/*             Core Data Access (API) Library for Ad Listings                 */
/* -------------------------------------------------------------------------- */
@Injectable()
export class DataService {

  constructor(
    private _store: Store<IAppState>,
    private settings: SettingsService,
    private http: HttpClient
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                       Core Load Ad Listins API Call                        */
  /* -------------------------------------------------------------------------- */

  LoadRecords(FilterOptions) {
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadStarted({}));
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadStarted({}));
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


  /* -------------------------------------------------------------------------- */
  /*                             Add API Call                             */
  /* -------------------------------------------------------------------------- */
  UpdateRecord(obj) {
    return this.http.post(
      this.settings.getApiOptions().proc,
      JSON.stringify(obj)
    );
  }
 
 
  /* -------------------------------------------------------------------------- */
  /*                            Delete Album API Call                           */
  /* -------------------------------------------------------------------------- */
  DeleteRecord(item, index, type) {
    item.actionstatus = "delete";
    item.type = 0; // 0: photos, 1: videos, 2: audio
    switch (type) {
      case 1:
        item.actionstatus = "delete_fav";
        break;
    }
    const arr = [];
    arr.push(item);
    this.ProcessActions(
      arr,
      "delete",
      this.settings.getApiOptions().action,
      type
    );
  }

 
  /* -------------------------------------------------------------------------- */
  /*                       Actions API Call                                     */
  /* -------------------------------------------------------------------------- */

  ProcessActions(
    SelectedItems: any,
    isenabled: string,
    url: string,
    type: number
  ) {

    // apply changes directory instate
    this._store.dispatch(new applyChanges({
      SelectedItems,
      isenabled,
      type: type
    }));
 
    this.http.post(url, JSON.stringify(SelectedItems)).subscribe(
      (data: any) => {
        // this.coreActions.Notify(data.message);
        let message = "Operation Performed";
        if (isenabled === "delete") {
          message = "Record Removed";
        }
       this._store.dispatch(new Notify({
          title: message,
          text: "",
          css: "bg-success"
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
