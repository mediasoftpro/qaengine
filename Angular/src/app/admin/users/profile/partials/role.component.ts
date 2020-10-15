/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

// role services
import * as RoleDataService from "../../../settings/roles/services/data.service";
import * as RoleSettingService from "../../../settings/roles/services/settings.service";
//import { ROLEAPIActions } from "../../../../reducers/settings/roles/actions";

// services
import { DataService } from "../../services/data.service";

// shared services
//import { CoreAPIActions } from "../../../../reducers/core/actions";

// reducer actions
// import * as selectors from "../../../../reducers/users/selectors";
import * as roleSelectors from "../../../../reducers/settings/roles/selectors";
import { Notify } from "../../../../reducers/core/actions";
//import { auth } from "../../../../reducers/users/selectors";
//import * as configSelectors from "../../../../reducers/configs/selectors";

@Component({
  selector: "app-role",
  templateUrl: "./role.html",
  providers: [RoleDataService.DataService, RoleSettingService.SettingsService],
})
export class UserRoleComponent implements OnInit {
  @Input() Info: any = {};
  @Input() isActionGranded = false;
  isLoading = false;

  // load all available roles
  /* @select(["roles", "roles"])
  readonly roles$: Observable<any>;

  @select(["roles", "isroleloaded"])
  readonly isroleloaded$: Observable<any>;
  */

  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private roledataService: RoleDataService.DataService
  ) {}

  readonly roles$ = this._store.pipe(select(roleSelectors.roles));
  readonly isroleloaded$ = this._store.pipe(select(roleSelectors.isroleloaded));

  ngOnInit() {
    this.isroleloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.roledataService.LoadRoles();
      }
    });
  }

  updateRole() {
    if (!this.isActionGranded) {
      this._store.dispatch(
        new Notify({
          title: "Permission Denied",
          text: "",
          css: "bg-danger",
        })
      );
      return;
    }
    this.isLoading = true;

    this.dataService.UpdateRole(this.Info).subscribe(
      (data: any) => {
        if (data.status === "error") {
          new Notify({
            title: data.message,
            text: "",
            css: "bg-danger",
          })
        } else {
          this._store.dispatch(
            new Notify({
              title: data.message,
              text: "",
              css: "bg-success",
            })
          );
        }
        this.isLoading = false;
      },
      (err) => {
        this.isLoading = false;
        this._store.dispatch(
          new Notify({
            title: "Error Occured",
            text: "",
            css: "bg-danger",
          })
        );
      }
    );
  }
}
