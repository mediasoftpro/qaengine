
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
//import { ConfigurationsAPIActions } from "../../../../reducers/settings/configurations/actions";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
import { loadStarted, loadFailed} from "../../../../reducers/settings/configurations/actions";
import { loadSucceeded } from 'src/app/reducers/settings/configurations/actions';

@Injectable()
export class DataService {
  constructor(
    private _store: Store<IAppState>,
    private settings: SettingsService,
    private http: HttpClient
  ) {}

  LoadRecords() {
    const URL = this.settings.getApiOptions().load;
    this._store.dispatch(new loadStarted({}));
    this.http.post(URL, {}).subscribe(
      (data: any) => {
        // update core data
        
        this._store.dispatch(new loadSucceeded(data));
      },
      err => {
        this._store.dispatch(new loadFailed(err));
      }
    );
  }

  /* global function for handling all configuration updated data and route to proper api call */
  UpdateConfigurations(entity: any, prop: string, child_prop: string) {
    let URL = this.settings.getApiOptions()[prop][child_prop];
    return this.http.post(URL, entity);
  }

  
  SetupCompleted() {
    const URL = this.settings.getApiOptions().general.dbsetupcompleted;
    return this.http.post(URL, {});
  }
}
