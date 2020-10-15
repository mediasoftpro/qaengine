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

// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";

// reducer actions
// import { AdvertisementAPIActions } from "../../../reducers/settings/advertisements/actions";
import * as advertismentSelectors from "../../../reducers/settings/advertisements/selectors";
import { applyFilter, updateFilterOptions} from "../../../reducers/settings/advertisements/actions";
import { Notify } from "../../../reducers/core/actions";
import {auth} from "../../../reducers/users/selectors";

import { PermissionService } from "../../../admin/users/services/permission.service";

@Component({
  templateUrl: "./advertisement.html"
})
export class AdvertisemntComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    public permission: PermissionService
  ) {}

  readonly filteroptions$ = this._store.pipe(select(advertismentSelectors.filteroptions));
  readonly isloaded$ = this._store.pipe(select(advertismentSelectors.isloaded));

 readonly auth$ = this._store.pipe(select(auth));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  SearchOptions: any;
  ToolbarOptions: any;
  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters

  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1521396255768";
      const ReadOnlyAccessID = "1521396280060";
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
    this.SearchOptions = this.settingService.getSearchOptions();
    this.ToolbarOptions = this.settingService.getToolbarOptions();

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
      if (options.track_filter) {
        this.dataService.LoadRecords(options);
        // reset track filter to false again
        this.FilterOptions.track_filter = false;
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }
    });
    this.isloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.dataService.LoadRecords(this.FilterOptions);
      }
    });
  }

  /* toolbar actions */
  toolbaraction(selection: any) {
    switch (selection.action) {
      case "f_type":
         this._store.dispatch(new applyFilter({ attr: "type", value: selection.value }));
        break;
    }
  }

  /* find records event trigger */
  FindRecords(filters: any) {
    const _filterOptions = filters.filters;
    _filterOptions.pagenumber = 1;
    _filterOptions.track_filter = true; // to force triggering load event via obvervable subscription
      this._store.dispatch(new updateFilterOptions(_filterOptions));
  }
}
