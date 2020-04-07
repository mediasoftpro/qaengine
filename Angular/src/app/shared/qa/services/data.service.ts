/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { QAAPIActions } from "../../../reducers/qa/actions";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { CoreAPIActions } from "../../../reducers/core/actions";

@Injectable()
export class DataService {
  constructor(
    private settings: SettingsService,
    private http: HttpClient,
    private actions: QAAPIActions,
    private coreActions: CoreAPIActions
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                             Load normal records                            */
  /* -------------------------------------------------------------------------- */
  LoadRecords(FilterOptions) {
   
    const URL = this.settings.getApiOptions().load;
    this.actions.loadStarted();
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this.actions.loadSucceeded(data);
        if (data.categories.length > 0) {
          // if enabled, api send list of categories too
          // update categories in state
          this.actions.updateCategories(data.categories);
        }
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
  /*                       load few qa (no pagination)                      */
  /* -------------------------------------------------------------------------- */
  LoadSmList(queryOptions: any) {
  
    return this.http.post(this.settings.getApiOptions().load, JSON.stringify(queryOptions));

  }

  /* -------------------------------------------------------------------------- */
  /*                       load reports (no pagination)                      */
  /* -------------------------------------------------------------------------- */
  LoadReports(queryOptions: any) {
  
    return this.http.post(this.settings.getApiOptions().load_reports, JSON.stringify(queryOptions));

  }
 
  /* -------------------------------------------------------------------------- */
  /*                              Get single record                             */
  /* -------------------------------------------------------------------------- */
  GetInfo(id: number) {
    const URL = this.settings.getApiOptions().getinfo;
    return this.http.post(URL, JSON.stringify({ id }));
  }

  /* -------------------------------------------------------------------------- */
  /*                               Add new record                               */
  /* -------------------------------------------------------------------------- */
  AddRecord(obj) {
    return this.http.post(
      this.settings.getApiOptions().proc,
      JSON.stringify(obj)
    );
  }

  PostAnswer(obj) {
    return this.http.post(
      this.settings.getApiOptions().panswer,
      JSON.stringify(obj)
    );
  }

  DeleteAnswer(obj) {
    return this.http.post(
      this.settings.getApiOptions().answeraction,
      JSON.stringify(obj)
    );
  }

  
  Authorize_Author(obj) {
    return this.http.post(
      this.settings.getApiOptions().authorize_author,
      JSON.stringify(obj)
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                    Delete normal and associated records                    */
  /* -------------------------------------------------------------------------- */
  DeleteRecord(item, index, type) {
    //if (this.config.getGlobalVar("isdelete")) {
      item.actionstatus = "delete";
      item.actionstatus = "delete";
      switch (type) {
        case 1:
          item.actionstatus = "delete_fav";
          break;
        case 2:
          item.actionstatus = "delete_like";
          break;
        case 3:
          item.actionstatus = "delete_ans";
          break;
      }
      const arr = [];
      arr.push(item);
      this.ProcessActions(arr, "delete", type);
    //}
  }

  /* -------------------------------------------------------------------------- */
  /*               Perform actions (enable, disable, approve) etc               */
  /* -------------------------------------------------------------------------- */
  ProcessActions(SelectedItems, isenabled, type) {
    // apply changes directory instate
    this.actions.applyChanges({
      SelectedItems,
      isenabled,
      type: type
    });

   
    this.http
      .post(this.settings.getApiOptions().action, JSON.stringify(SelectedItems))
      .subscribe(
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
