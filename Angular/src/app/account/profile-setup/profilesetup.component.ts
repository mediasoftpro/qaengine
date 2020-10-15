
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
//import { CoreAPIActions } from "../../reducers/core/actions";
import { CoreService } from "../../admin/core/coreService";

// reducer actions
import { CookieService } from "ngx-cookie-service";
import { auth } from "../../reducers/users/selectors";
import { Notify } from "../../reducers/core/actions";

@Component({
  selector: "app-profilesetup",
  templateUrl: "./profilesetup.html",
  encapsulation: ViewEncapsulation.None,
  providers: [
    DataService,
    SettingsService,
    FormService,
    CookieService,
    CoreService
  ]
})

export class ProfileSetupComponent implements OnInit {
  controls: any = [];
  showLoader = true;
  submitText = "Save Changes";
  User: any = {};
  uploadedFiles = [];
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private formService: FormService,
    private router: Router,
    private coreService: CoreService
  ) {}

   readonly auth$ = this._store.pipe(select(auth));

  ngOnInit() {
    this.auth$.subscribe(Info => {

      // load extended information including dynamic profile data to edi
      this.LoadInfo(Info.User.id);
      /*this.User = Info.User;
      // dynamic attribute processing
      console.log(this.User);
      this.coreService.prepareDynamicControlData(this.User);

      this.initializeControls(Info.User);
      this.showLoader = false;
      */
    });
  }

  LoadInfo(UserId: string) {
    this.showLoader = true;
    this.dataService.GetInfo(UserId).subscribe((data: any) => {
      if (data.status === "error") {
          this._store.dispatch(new Notify({
            title:  data.message,
            text: "",
            css: "bg-success"
          }));
        // redirect to user page
        this.router.navigate(["/"]);
      } else {
        this.User = data.post;

        // dynamic attribute processing
        this.coreService.prepareDynamicControlData(this.User);

        this.initializeControls(this.User);
      }
      this.showLoader = false;
    });
  }

  initializeControls(data: any) {
    this.controls = this.formService.getControls(data, 2, false);
  }

  SubmitForm(payload) {
    for (const prop of Object.keys(this.User)) {
      for (const payload_prop of Object.keys(payload)) {
        if (prop === payload_prop) {
          this.User[prop] = payload[payload_prop];
        }
      }
    }

    this.User.attr_values = this.coreService.processDynamicControlsData(payload, this.User);
    // skip admin related additional edit options
    this.User.isadmin = false;

    // console.log(this.User);

    this.User.viewType = 2; // edit profile
 
    this.showLoader = true;
    this.dataService.AddRecord(this.User).subscribe(
      (data: any) => {
        if (data.status === "error") {
           this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-danger"
          }));
        } else {
          const message = "Profile Updated";
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
