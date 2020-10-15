/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, ViewEncapsulation, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../reducers/store/model";

import { FormService } from "../../admin/users/services/form.service";
import { DataService } from "../../admin/users/services/data.service";
import { SettingsService } from "../../admin/users/services/settings.service";

// shared services
import { CoreService } from "../../admin/core/coreService";

// reducer actions
import {auth} from "../../reducers/users/selectors";

import { CookieService } from "ngx-cookie-service";
import { Notify } from "../../reducers/core/actions";

@Component({
  selector: "app-emailoptions",
  templateUrl: "./email.options.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    DataService,
    SettingsService,
    FormService,
    CookieService
  ]
})
export class EmailOptionsComponent implements OnInit {
  controls: any = [];
  showLoader = true;
  submitText = "Save Changes";
  User: any = {};

  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private formService: FormService,
    private router: Router,
    private cookieService: CookieService
  ) {}


  readonly auth$ = this._store.pipe(select(auth));

  ngOnInit() {
    this.auth$.subscribe(Info => {
      this.User = Info.User;
      this.initializeControls(Info.User);
      this.showLoader = false;
    });
  }

  initializeControls(data: any) {
    this.controls = this.formService.getControls(data, 3,false);
  }

  SubmitForm(payload) {
    this.User.password = payload.password;
    this.User.email = payload.email;
    this.User.viewType = 3; // change email
    this.showLoader = true;
    // skip admin related additional edit options
    this.User.isadmin = false;

    this.dataService.AddRecord(this.User).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-danger"
          }));
        } else {
          const message = "Email change request submitted successfully";
          this._store.dispatch(new Notify({
            title: message,
            text: "",
            css: "bg-success"
          }));
          
          this.router.navigate(["/"]);
        }
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        this._store.dispatch(new Notify({
          title: "Error Occured",
          text: "",
          css: "bg-danger"
        }));
        
      }
    );
  }
}
