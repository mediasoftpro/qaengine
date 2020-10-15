/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Store } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { CoreService } from "../../../admin/core/coreService";
import {
  loadStarted,
  loadSucceeded,
  loadFailed,
  applyChanges,
  updateCategories,
} from "../../../reducers/qa/actions";
import {
  loadQAStarted,
  loadQASucceeded,
  loadQAFailed,
  loadQAReportStarted,
  loadQAReportFailed,
  loadQAReportSucceeded,
} from "../../../reducers/admin/dashboard/actions";
import { refreshListStats } from "../../../reducers/core/actions";
import { Notify } from "../../../reducers/core/actions";

@Injectable()
export class DataService {

  constructor(
    private _store: Store<IAppState>,
    private settings: SettingsService,
    private http: HttpClient,
    private coreService: CoreService
  ) {}

  /* -------------------------------------------------------------------------- */
  /*                             Load normal records                            */
  /* -------------------------------------------------------------------------- */
  LoadRecords(FilterOptions) {
   
    const URL = this.settings.getApiOptions().load;
     this._store.dispatch(new loadStarted({}));
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadSucceeded(data.posts));
        if (data.categories.length > 0) {
          // if enabled, api send list of categories too
          // update categories in state
          this._store.dispatch(new updateCategories(data.categories));
        }
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
  /*                       load few blogs (redux version)                       */
  /* -------------------------------------------------------------------------- */
  LoadSmListReducer(queryOptions: any) {
  
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadQAStarted({}));
    this.http.post(URL, JSON.stringify(queryOptions)).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadQASucceeded(data.posts));
      },
      err => {
        this._store.dispatch(new loadQAFailed(err));
      }
    );

  }

   /* -------------------------------------------------------------------------- */
  /*                      Generate Report                                       */
  /* -------------------------------------------------------------------------- */
  GenerateSummaryReport(queryOptions: any) {
    const URL = this.settings.getApiOptions().generate_report;
    this._store.dispatch(new loadQAReportStarted({}));
    this.http.post(URL, JSON.stringify(queryOptions)).subscribe(
      (data: any) => {
        // update core data
        let payload = this.coreService.initializeChartData(data.data.dataTable, data.data.chartType);
        this._store.dispatch(new loadQAReportSucceeded(payload));
      },
      err => {
        this._store.dispatch(new loadQAReportFailed(err));
      }
    );
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
    this._store.dispatch(new applyChanges({
      SelectedItems,
      isenabled,
      type: type
    }));
   
   
    this.http
      .post(this.settings.getApiOptions().action, JSON.stringify(SelectedItems))
      .subscribe(
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
