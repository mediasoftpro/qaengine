/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { AppConfig } from "../../../configs/app.config";

// import { IDashboardAPIActions } from "../../../reducers/admin/dashboard/actions";
import { SettingsService } from "../services/settings.service";
import { DataService } from "../services/data.service";

import { auth } from "../../../reducers/users/selectors";
import * as configSelectors from "../../../reducers/configs/selectors";
import * as dashboardSelectors from "../../../reducers/admin/dashboard/selectors";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.html",
  providers: [SettingsService, DataService],
})
export class AdminDashboardComponent implements OnInit {

  constructor(
    private _store: Store<IAppState>,
    public config: AppConfig,
    private dataService: DataService
  ) {}

  // Authenticated User Data
  readonly auth$ = this._store.pipe(select(auth));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  readonly isloaded$ = this._store.pipe(select(dashboardSelectors.isloaded));
  readonly stats$ = this._store.pipe(select(dashboardSelectors.stats));
  readonly stats_loading$ = this._store.pipe(select(dashboardSelectors.stats_loading));

  // Application Configuration Data
  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;

  @select(["dashboard", "isloaded"])
  readonly isloaded$: Observable<any>;

  @select(["dashboard", "stats"])
  readonly stats$: Observable<any>;

  @select(["dashboard", "stats_loading"])
  readonly stats_loading$: Observable<any>;*/

  User: any = {};
  isAdmin = true;
  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.loadStats();
      }
    });
  }

  loadStats() {
    this.dataService.LoadStats();
  }
}
