/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { loadStarted, loadSucceeded, loadFailed, addCategory, updateCategory, updateCategoryID, removeCategory, applyChanges} from "../../../../reducers/settings/gamify/actions";
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
      },
      err => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

  AddRecord(obj) {
    return this.http.post(
      this.settings.getApiOptions().add,
      JSON.stringify(obj)
    );
  }

  AddCategory(obj) {
    if (obj.id === 0) {
      this._store.dispatch(new addCategory(obj));
    } else {
      this._store.dispatch(new updateCategory(obj));
    }
    
    const URL = this.settings.getApiOptions().category.add;
    this.http.post(URL, JSON.stringify([obj])).subscribe(
      (data: any) => {
        if (obj.id === 0) {
          this._store.dispatch(new updateCategoryID(data.record));
        }
      },
      err => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                              Get Single Record                             */
  /* -------------------------------------------------------------------------- */
  GetInfo(id: number) {
    const URL = this.settings.getApiOptions().getinfo;
    return this.http.post(URL, JSON.stringify({ id: id }));
  }

  DeleteCategory(item, index) {
    this._store.dispatch(new removeCategory({ item, index }));
    item.actionstatus = "delete";
    this.http
      .post(
        this.settings.getApiOptions().category.action,
        JSON.stringify([item])
      )
      .subscribe(
        (data: any) => {},
        err => {
          this._store.dispatch(new Notify({
            title:  "Error Occured",
            text: "",
            css: "bg-danger"
          }));
        }
      );
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
    this._store.dispatch(new applyChanges({
      SelectedItems,
      isenabled
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
            title:  "Error Occured",
            text: "",
            css: "bg-danger"
          }));
         
        }
      );
  }
}
