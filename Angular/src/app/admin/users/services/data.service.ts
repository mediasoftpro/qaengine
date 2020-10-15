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
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { CoreService } from "../../../admin/core/coreService";

import {
  loadStarted,
  loadSucceeded,
  loadFailed,
  applyChanges,
  UpdateThumb
} from "../../../reducers/users/actions";
import {
  loadUserStarted,
  loadUserSucceeded,
  loadUserFailed,
  loadUserReportStarted,
  loadUserReportFailed,
  loadUserReportSucceeded,
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
  /*                           Core load data api call                          */
  /* -------------------------------------------------------------------------- */
  LoadRecords(FilterOptions) {
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadStarted({}));
    this.http.post(URL, JSON.stringify(FilterOptions)).subscribe(
      (data: any) => {
        // update core data
        this.coreService.attachEncryptedId(data.posts);
        this._store.dispatch(new loadSucceeded(data));
        if (data.categories.length > 0) {
          // if enabled, api send list of categories too
          // update categories in state
          // this._store.dispatch(new updateCategories(data.categories));
        }
        // update list stats
        this._store.dispatch(
          new refreshListStats({
            totalrecords: data.records,
            pagesize: FilterOptions.pagesize,
            pagenumber: FilterOptions.pagenumber,
          })
        );
      },
      (err) => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                       load few users (redux versio)                         */
  /* -------------------------------------------------------------------------- */
  LoadSmListReducer(queryOptions: any) {
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadUserStarted({}));
    this.http.post(URL, JSON.stringify(queryOptions)).subscribe(
      (data: any) => {
        // update core data
        this.coreService.attachEncryptedId(data.posts);
        this._store.dispatch(new loadUserSucceeded(data));
      },
      (err) => {
        this._store.dispatch(new loadUserFailed(err));
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                      Generate Report                                       */
  /* -------------------------------------------------------------------------- */
  GenerateSummaryReport(queryOptions: any) {
    const URL = this.settings.getApiOptions().generate_report;
    this._store.dispatch(new loadUserReportStarted({}));
      this.http.post(URL, JSON.stringify(queryOptions)).subscribe(
      (data: any) => {
        // update core data
        let payload = this.coreService.initializeChartData(data.data.dataTable, data.data.chartType);
        this._store.dispatch(new loadUserReportSucceeded(payload));
      },
      (err) => {
        this._store.dispatch(new loadUserReportFailed(err));
      }
    );
  }

  AddRecord(obj: any) {
    let API_URL = "";
    // 1: create account, 2: edit profile, 3: change email, 4: change password, 5: change user type
    switch (obj.viewType) {
      case 1:
        API_URL = this.settings.getApiOptions().proc;
        break;
      case 2:
        API_URL = this.settings.getApiOptions().proc;
        break;
      case 3:
        API_URL = this.settings.getApiOptions().cemail;
        break;
      case 4:
        API_URL = this.settings.getApiOptions().chpass;
        break;
      case 5:
        API_URL = this.settings.getApiOptions().ctype;
        break;
    }
    if (obj.viewType === 2) {
      // edit profile
      obj.settings.userid = obj.id;
      obj.account.userid = obj.id;

      return this.http.post(
        API_URL,
        JSON.stringify({
          id: obj.id,
          firstname: obj.firstname,
          lastname: obj.lastname,
          mobile: obj.mobile,
          phoneNumber: obj.phoneNumber,
          attr_values: obj.attr_values,
          settings: obj.settings,
          account: obj.account,
          isadmin: true,
        })
      );
    } else {
      return this.http.post(API_URL, JSON.stringify(obj));
    }
  }

  UpdateThumb(info: any, images: any) {
    const URL = this.settings.getApiOptions().updatethumb;
    const param: any = {};
    param.Id = info.id;
    for (const image of images) {
      param.picturename = image.fname;
    }

    this.http.post(URL, JSON.stringify(param)).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(
            new Notify({
              title: data.message,
              text: "",
              css: "bg-danger",
            })
          );
        } else {
          this._store.dispatch(new UpdateThumb(data.record));
          this._store.dispatch(new Notify({
            title: "Photo updated successfully",
            text: "",
            css: "bg-success",
          }));
        }
      },
      (err) => {
        this._store.dispatch(new Notify({
          title: err,
          text: "",
          css: "bg-danger",
        }));
      }
    );
  }

  UpdateAvator(info: any) {
    const URL = this.settings.getApiOptions().updateavator;
    this.http.post(URL, JSON.stringify(info)).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(
            new Notify({
              title: data.message,
              text: "",
              css: "bg-danger",
            })
          );
        } else {
          this._store.dispatch(new UpdateThumb(data.record));
          this._store.dispatch(new Notify({
            title: "Photo updated successfully",
            text: "",
            css: "bg-success",
          }));
        }
      },
      (err) => {
        this._store.dispatch(new Notify({
          title: err,
          text: "",
          css: "bg-danger",
        }));
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Single Record                             */
  /* -------------------------------------------------------------------------- */
  GetInfo(userid: string) {
    const URL = this.settings.getApiOptions().getinfo;
    return this.http.post(URL, JSON.stringify({ id: userid }));
  }

  /* -------------------------------------------------------------------------- */
  /*                       load reports (no pagination)                      */
  /* -------------------------------------------------------------------------- */
  LoadReports(queryOptions: any) {
    return this.http.post(
      this.settings.getApiOptions().load_reports,
      JSON.stringify(queryOptions)
    );
  }

  Authenticate(user: any) {
    const URL = this.settings.getApiOptions().authenticate;
    return this.http.post(URL, JSON.stringify(user));
  }

  /* update control panel role */
  UpdateRole(user: any) {
    const URL = this.settings.getApiOptions().updaterole;
    return this.http.post(URL, JSON.stringify(user));
  }

  GetUserLog(userid: string) {
    const URL = this.settings.getApiOptions().userlog;
    return this.http.post(URL, JSON.stringify({ userid }));
  }

  DeleteAccount(user: any) {
    const URL = this.settings.getApiOptions().archive;
    return this.http.post(URL, JSON.stringify(user));
  }

  DeleteRecord(item, index) {
    item.actionstatus = "delete";
    const arr = [];
    arr.push(item);
    this.ProcessActions(arr, "delete");
  }

  /* -------------------------------------------------------------------------- */
  /*               Perform actions (enable, disable, approve) etc               */
  /* -------------------------------------------------------------------------- */
  ProcessActions(SelectedItems, isenabled) {
    // apply changes directory instate
    this._store.dispatch(
      new applyChanges({
        SelectedItems,
        isenabled,
      })
    );

    const arr = [];
    for (const item of SelectedItems) {
      arr.push({
        id: item.id,
        actionstatus: item.actionstatus,
      });
    }

    this.http
      .post(this.settings.getApiOptions().action, JSON.stringify(arr))
      .subscribe(
        (data: any) => {
          // this.coreActions.Notify(data.message);
          let message = "Operation Performed";
          if (isenabled === "delete") {
            message = "Record Removed";
          }
          this._store.dispatch(
            new Notify({
              title: message,
              text: "",
              css: "bg-success",
            })
          );
        },
        (err) => {
          this._store.dispatch(
            new Notify({
              title: "Error Occured",
              text: "",
              css: "bg-danger",
            })
          );
        }
      );
  }

  ProcessLogActions(SelectedItems, isenabled) {
    this._store.dispatch(new Notify({
      title: "Feature not yet implemented",
      text: "",
      css: "bg-success",
    }));
    
  }
}
