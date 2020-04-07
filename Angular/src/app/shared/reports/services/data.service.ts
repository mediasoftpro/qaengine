/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { AbuseReportActions } from "../../../reducers/reports/abuse/actions";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { CoreAPIActions } from "../../../reducers/core/actions";

/* -------------------------------------------------------------------------- */
/*             Core Data Access (API) Library for Ad Listings                 */
/* -------------------------------------------------------------------------- */
@Injectable()
export class DataService {
  constructor(
    private settings: SettingsService,
    private http: HttpClient,
    private actions: AbuseReportActions,
    private coreActions: CoreAPIActions
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                       Core Load Ad Listins API Call                        */
  /* -------------------------------------------------------------------------- */

  LoadRecords(FilterOptions) {
    const URL = this.settings.getApiOptions().load;
    this.actions.loadStarted();
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this.actions.loadSucceeded(data);
        // update list stats
        this.coreActions.refreshListStats({
          totalrecords: data.records,
          pagesize: FilterOptions.pagesize,
          pagenumber: FilterOptions.pagenumber
        });
      },
      err => {
        this.actions.loadFailed(err);
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
    this.actions.applyChanges({
      SelectedItems,
      isenabled,
      type: type
    });

    this.http.post(url, JSON.stringify(SelectedItems)).subscribe(
      (data: any) => {
        // this.coreActions.Notify(data.message);
        let message = "Operation Performed";
        if (isenabled === "delete") {
          message = "Record Removed";
        }
        this.coreActions.Notify({
          title: message,
          text: "",
          css: "bg-success"
        });
      },
      err => {
        this.coreActions.Notify({
          title: "Error Occured",
          text: "",
          css: "bg-danger"
        });
      }
    );
  }
  
}
