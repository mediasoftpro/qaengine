/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
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

// reducer actions
import * as selectors from "../../../../reducers/settings/gamify/selectors";
import {
  filter_categories,
  reloadList
} from "../../../../reducers/settings/gamify/actions";
import { Notify } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";

import { fadeInAnimation } from "../../../../animations/core";
import { PermissionService } from "../../../../admin/users/services/permission.service";

@Component({
  templateUrl: "./process.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class ProcGamifyComponent implements OnInit {

  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private permission: PermissionService,
    private formService: FormService,
    private router: Router
  ) {}

  BadgeID = 0;
  BadgeType = 1;
  SearchOptions: any;
  controls: any = [];
  showLoader = false;
  formHeading = "Add Badge";
  submitText = "Submit";
  FilterOptions: any;
  IsLoaded = false;
  Info: any = {};

  
  readonly categories$ = this._store.pipe(select(selectors.filter_categories));
  readonly filteroptions$ = this._store.pipe(
    select(selectors.filteroptions)
  );
  
  readonly isloaded$ = this._store.pipe(select(selectors.isloaded));
  readonly isItemSelected$ = this._store.pipe(
    select(selectors.itemsselected)
  );
  readonly records$ = this._store.pipe(select(selectors.records));
  readonly pagination$ = this._store.pipe(select(selectors.pagination));
  readonly auth$ = this._store.pipe(select(auth));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete
  Configs: any = {};

  ngOnInit() {
    this.configs$.subscribe((configs: any) => {
      this.Configs = configs;
    });
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1539515772897";
      const ReadOnlyAccessID = "1539515353167";
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
    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      if (!this.IsLoaded) {
        
        this.router.navigate(["/settings/gamify/"]);
      }
    });

    // setup navigation list
    this.SearchOptions = this.settingService.getSearchOptions();
    this.SearchOptions.showSearchPanel = false;
    this.SearchOptions.actions = [];

    // fetch param from url
    this.route.params.subscribe(params => {
      this.BadgeID = Number.parseInt(params["id"], 10);
      if (isNaN(this.BadgeID)) {
        this.BadgeID = 0;
      }
      this.BadgeType = Number.parseInt(params["type"], 10);
      if (isNaN(this.BadgeType)) {
        this.BadgeType = 1;
      }
      if (this.BadgeID > 0) {
        this.formHeading = "Update Badge";
        this.submitText = "Update";
        this.LoadInfo();
      } else {
        // initialize controls with default values
        this.Info = this.settingService.getInitObject();
        this.Info.type = this.BadgeType;
        this.initializeControls(this.Info);
      }
    });

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
    });

    this.categories$.subscribe((categories: any) => {

      if (this.controls.length > 0) {
        
        for (const control of this.controls) {
          if (control.key === "categoryid") {
            for (const category of categories) {
              control.options.push({
                key: category.id,
                value: category.title
              });
            }
          }
        }
      }
    });
  }

  LoadInfo() {
    this.showLoader = true;
    this.dataService.GetInfo(this.BadgeID).subscribe((data: any) => {
      if (data.posts.length > 0) {
        this.Info = data.posts[0];
        this.initializeControls(this.Info);
      }
      this.showLoader = false;
    });
  }

  initializeControls(data: any) {
    if (this.IsLoaded) {
      this.controls = this.formService.getControls(
        data,
        this.Configs.general.media
      );
      this.loadCategories();
    }
  }

  loadCategories() {
    this._store.dispatch(new filter_categories(this.BadgeType));
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
    payload.type = this.BadgeType;
    let _status = "Added";
    if (this.BadgeID > 0) {
      payload.id = this.BadgeID;
      // payload.uniqueid = '';
      _status = "Updated";
    } else {
      // payload.uniqueid = new Date().valueOf();
    }
    // adjust values with actual object
    for (const prop of Object.keys(this.Info)) {
      for (const payload_prop of Object.keys(payload)) {
        if (prop === payload_prop) {
          this.Info[prop] = payload[payload_prop];
        }
      }
    }

    console.log(this.Info);
    // console.log(payload);
    this.dataService.AddRecord(this.Info).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title:  data.message,
            text: "",
            css: "bg-danger"
          }));
        } else {
          this._store.dispatch(new Notify({
            title:  "Record " + _status + " Successfully",
            text: "",
            css: "bg-danger"
          }));
         

          // enable reload action to refresh data
          this._store.dispatch(new reloadList({}));
         
          // redirect
          this.router.navigate(["/settings/gamify/"]);
        }
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        this._store.dispatch(new Notify({
          title:  "Error Occured",
          text: "",
          css: "bg-danger"
        }));
      }
    );
  }
}
