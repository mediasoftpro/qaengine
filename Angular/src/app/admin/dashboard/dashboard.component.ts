/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../reducers/store/model";

import { FormService } from "../../admin/users/services/form.service";
import { DataService } from "../../admin/users/services/data.service";
import { SettingsService } from "../../admin/users/services/settings.service";

// reducer actions
import { auth } from "../../reducers/users/selectors";
import * as configSelectors from "../../reducers/configs/selectors";
//import { UserAPIActions } from "../../reducers/users/actions";
import { CookieService } from "ngx-cookie-service";
import { PermissionService } from "../../admin/users/services/permission.service";
import { AppConfig } from "../../configs/app.config";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    DataService,
    SettingsService,
    FormService,
    CookieService
  ]
})
export class DashboardComponent implements OnInit {
  showLoader = false;

  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    public permission: PermissionService,
    public config: AppConfig
  ) {}

 readonly auth$ = this._store.pipe(select(auth));
 readonly configs$ = this._store.pipe(select(configSelectors.configs));
  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;*/

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  User: any = {};
  uploadedFiles = [];
  ngOnInit() {
    this.auth$.subscribe(Info => {
      this.User = Info.User;
      const _files = [];
      if (this.User.img_url !== "") {
        _files.push();
        this.uploadedFiles.push({
          fname: this.User.img_url,
          filename: this.User.img_url,
          filetype: ".jpg",
          url: this.User.img_url
        });
      }
    });
  }

  OnUploadedImages(images: any) {
    this.dataService.UpdateThumb(this.User, images);
  }
}
