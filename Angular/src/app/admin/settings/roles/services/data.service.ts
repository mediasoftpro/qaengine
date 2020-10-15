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
//import { ROLEAPIActions } from "../../../../reducers/settings/roles/actions";
import { HttpClient } from "@angular/common/http";

import { SettingsService } from "./settings.service";
//import { CoreAPIActions } from "../../../../reducers/core/actions";
import {
  loadStarted,
  loadSucceeded,
  loadFailed,
  loadObjectStarted,
  loadObjectSucceeded,
  loadObjectFailed,
  addRole,
  updateObject,
  addObject,
  applyRoleChanges,
  applyObjectChanges
} from "../../../../reducers/settings/roles/actions";
import { refreshListStats } from "../../../../reducers/core/actions";
import { Notify } from "../../../../reducers/core/actions";

@Injectable()
export class DataService {
  constructor(
    private _store: Store<IAppState>,
    private settings: SettingsService,
    private http: HttpClient
  ) {}

  LoadRoles() {
    const URL = this.settings.getApiOptions().load_roles;
    this._store.dispatch(new loadStarted({}));
    this.http.post(URL, {}).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadSucceeded(data));
      },
      (err) => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }
  LoadObjects() {
    const URL = this.settings.getApiOptions().load_objects;
    this._store.dispatch(new loadObjectStarted({}));
    this.http.post(URL, {}).subscribe(
      (data: any) => {
        // update core data
        this._store.dispatch(new loadObjectSucceeded(data));
      },
      (err) => {
        this._store.dispatch(new loadObjectFailed(err));
      }
    );
  }
  /* add record modal popup case */
  AddRole(obj) {
    console.log(this.settings.getApiOptions().add_role);
    this.http
      .post(this.settings.getApiOptions().add_role, JSON.stringify(obj))
      .subscribe(
        (data: any) => {
          // update core data
          this._store.dispatch(new addRole(data.record));
        },
        (err) => {
          this._store.dispatch(new loadObjectFailed(err));
        }
      );
  }

  AddObject(obj) {
    this.http
      .post(this.settings.getApiOptions().add_object, JSON.stringify(obj))
      .subscribe(
        (data: any) => {
          // update core data
          if (obj.id > 0) {
            this._store.dispatch(new updateObject(data.record));
          } else {
            this._store.dispatch(new addObject(data.record));
          }
        },
        (err) => {
          this._store.dispatch(new loadObjectFailed(err));
        }
      );
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Single Record                             */
  /* -------------------------------------------------------------------------- */
  GetInfo(id: number) {
    const URL = this.settings.getApiOptions().getinfo;
    return this.http.post(URL, JSON.stringify({ id }));
  }

  UpdatePermission(arr) {
    const URL = this.settings.getApiOptions().update_permission;
    return this.http.post(URL, JSON.stringify(arr));
  }

  DeleteRecord(item, index, url, type) {
    item.actionstatus = "delete";
    const arr = [];
    arr.push(item);
    this.ProcessActions(arr, "delete", url, type);
  }

  ProcessActions(SelectedItems, isenabled, url, type) {
    if (type === 1) {
      this._store.dispatch(new applyRoleChanges({
        SelectedItems,
        isenabled,
      }));
     
    } else {
      this._store.dispatch(new applyObjectChanges({
        SelectedItems,
        isenabled,
      }));
    }
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
}
