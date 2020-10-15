
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
import * as selectors from "../../../../reducers/settings/roles/selectors";
import { reloadList} from "../../../../reducers/settings/roles/actions";
import { Notify } from "../../../../reducers/core/actions";
import {auth} from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";

import { PermissionService } from "../../../../admin/users/services/permission.service";
@Component({
  templateUrl: "./process.html",
  encapsulation: ViewEncapsulation.None
})
export class ProcRoleComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private permission: PermissionService,
    private formService: FormService,
    private router: Router
  ) {}

  RecordID = 0;
  SearchOptions: any;
  Info: any;
  showLoader = false;
  formHeading = "Add Role";
  submitText = "Add Role";
  ObjectList = [];
  selectall = false;

  readonly objects$ = this._store.pipe(select(selectors.objects));
  readonly isroleloaded$ = this._store.pipe(select(selectors.isroleloaded));
  /*
  @select(["roles", "objects"])
  readonly objects$: Observable<any>;

  @select(["roles", "isroleloaded"])
  readonly isroleloaded$: Observable<any>;*/


 readonly auth$ = this._store.pipe(select(auth));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1539516299310";
      const ReadOnlyAccessID = "1539516260338";
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
    this.isroleloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.router.navigate(["/settings/roles/"]);
      }
    });

    this.objects$.subscribe((objects: any) => {
      this.ObjectList = objects;
    });

    // fetch param from url
    this.route.params.subscribe(params => {
      this.RecordID = Number.parseInt(params["id"], 10);
      if (this.RecordID > 0) {
        this.formHeading = "Update Role Permissions";
        this.submitText = "Update Role";
        this.LoadInfo();
      } else {
        this.router.navigate(["/settings/roles/"]);
      }
    });

    // setup navigation list
    this.SearchOptions = this.settingService.getSearchOptions();
    this.SearchOptions.showSearchPanel = false;
    this.SearchOptions.actions = [];
  }

  LoadInfo() {
    this.showLoader = true;
    this.dataService.GetInfo(this.RecordID).subscribe((data: any) => {
      this.Info = data.posts;
      this.showLoader = false;
      // make all object selection false
      for (const object of this.ObjectList) {
        object.Selected = false;
      }
      for (const object of this.ObjectList) {
        for (const permission of this.Info.permissions) {
          if (permission.objectid === object.id) {
            object.Selected = true;
          }
        }
      }
    });
  }
  processChange() {
    for (const object of this.ObjectList) {
      object.Selected = this.selectall;
    }
  }

  checkChange() {
    for (const object of this.ObjectList) {
      if (object.Selected) {
        // console.log('step 2: selected');
      }
    }
  }

  updatePermission() {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
      return;
    }
    const arr = [];
    for (const object of this.ObjectList) {
      if (object.Selected) {
        arr.push({
          roleid: this.Info.id,
          objectid: object.id
        });
      }
    }
    console.log(arr);
    this.showLoader = true;
    this.dataService.UpdatePermission(arr).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-danger"
          }));
        } else {
          this._store.dispatch(new Notify({
            title: "Permission Updated Successfully",
            text: "",
            css: "bg-success"
          }));
         
          this.router.navigate(["/settings/roles/"]);
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
