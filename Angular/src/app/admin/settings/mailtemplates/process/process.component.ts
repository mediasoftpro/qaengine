/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

// services
import { SettingsService } from "../services/settings.service";
import { DataService } from "../services/data.service";
import { FormService } from "../services/form.service";

// shared services
import { CoreService } from "../../../core/coreService";

// reducer actions
import { reloadList} from "../../../../reducers/settings/mailtemplates/actions";
import { Notify } from "../../../../reducers/core/actions";
import {auth} from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";
// reducer actions

import { fadeInAnimation } from "../../../../animations/core";

import { PermissionService } from "../../../../admin/users/services/permission.service";
@Component({
  templateUrl: "./process.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class ProcMailTemplateComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private formService: FormService,
    private permission: PermissionService,
    private router: Router
  ) {}

  MailTemplateID = 0;
  SearchOptions: any;
  controls: any = [];
  showLoader = false;
  formHeading = "Add Mail Tempalte";
  submitText = "Add Template";

 readonly auth$ = this._store.pipe(select(auth));
 readonly configs$ = this._store.pipe(select(configSelectors.configs));
  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;*/

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete
  Configs: any;
  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1539516196296";
      const ReadOnlyAccessID = "1539516133459";
      if (
        this.permission.GrandResourceAccess(
          false,
          FullAccessID,
          ReadOnlyAccessID,
          auth.Role
        )
      ) {
        this.isAccessGranted = true;
        if (this.permission.GrandResourceAction(FullAccessID, auth.Role)) {
          this.isActionGranded = true;
        }
      }
    });

    this.configs$.subscribe((configs: any) => {
      this.Configs = configs;
    });

    // fetch param from url
    this.route.params.subscribe(params => {
      this.MailTemplateID = Number.parseInt(params["id"], 10);
      if (this.MailTemplateID > 0) {
        this.formHeading = "Update Mail Template";
        this.submitText = "Update Template";
        this.LoadInfo();
      } else {
        // initialize controls with default values
        this.initializeControls(this.settingService.getInitObject());
      }
    });

    // setup navigation list
    this.SearchOptions = this.settingService.getSearchOptions();
    this.SearchOptions.showSearchPanel = false;
    this.SearchOptions.actions = [];
  }

  LoadInfo() {
    this.showLoader = true;
    this.dataService.GetInfo(this.MailTemplateID).subscribe((data: any) => {
      this.initializeControls(data.posts);
      this.showLoader = false;
    });
  }

  initializeControls(data: any) {
    this.controls = this.formService.getControls(data, this.Configs.general.mailtemplates);
  }
  SubmitForm(payload) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
      return;
    }
    this.showLoader = true;
    let _status = "Added";
    if (this.MailTemplateID > 0) {
      payload.id = this.MailTemplateID;
      _status = "Updated";
    }
    this.dataService.AddRecord(payload).subscribe(
      (data: any) => {
        console.log("returned data is ");
        console.log(data);

        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-success"
          }));
        } else {
           this._store.dispatch(new Notify({
            title: "Record " + _status + " Successfully",
            text: "",
            css: "bg-success"
          }));

          // enable reload action to refresh data
          this._store.dispatch(new reloadList({}));

          // redirect
          this.router.navigate(["/settings/mailtemplates/"]);
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
