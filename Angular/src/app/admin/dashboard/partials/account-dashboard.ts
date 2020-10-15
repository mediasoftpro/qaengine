/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { auth } from "../../../reducers/users/selectors";
import * as configSelectors from "../../../reducers/configs/selectors";
import { AppConfig } from "../../../configs/app.config";
import { DataService } from "../../../admin/users/services/data.service";

@Component({
  selector: "app-account-dashboard",
  templateUrl: "./account-dashboard.html",
  providers: [DataService],
})
export class AccountDashboardComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    public config: AppConfig,
    private dataService: DataService
  ) {}

  // Authenticated User Data
  readonly auth$ = this._store.pipe(select(auth));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));

  // Application Configuration Data
  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;*/

  @Output() View = new EventEmitter<any>();
  @Output() SelectedItems = new EventEmitter<any>();

  User: any = {};
  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
    });
  }

  onImageUploaded(info: any) {
    console.log("cropper hit");
    this.dataService.UpdateAvator(info);
  }
}
