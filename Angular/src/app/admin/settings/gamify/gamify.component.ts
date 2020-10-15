/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";

/* modal popup */
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";

// modal popup
import { ViewComponent } from "./partials/modal.component";

// shared services
import { CoreService } from "../../core/coreService";
//import { CoreAPIActions } from "../../../reducers/core/actions";
import { fadeInAnimation } from "../../../animations/core";
// reducer actions
import * as selectors from "../../../reducers/settings/gamify/selectors";
import {
  addRecord,
  filter_records,
  updateFilterOptions,
  applyFilter,
  refresh_pagination,
} from "../../../reducers/settings/gamify/actions";
import { Notify } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";

import { PermissionService } from "../../../admin/users/services/permission.service";

@Component({
  templateUrl: "./gamify.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class GamifyComponent implements OnInit {

  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private modalService: NgbModal,
    private coreService: CoreService,
    public permission: PermissionService,
    private router: Router
  ) {}

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

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  SearchOptions: any;
  ToolbarOptions: any;

  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters
  IsLoaded = false; // check data is loaded for first time
  BadgeType = 1;

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
    this.SearchOptions.showSearchPanel = true;
    this.SetupNavigationActions();
    this.ToolbarOptions = this.settingService.getToolbarOptions();

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
      if (options.track_filter) {
        this.dataService.LoadRecords(this.FilterOptions);
        // reset track filter to false again
        options.track_filter = false;
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }
    });

    this.isItemSelected$.subscribe((selectedItems: boolean) => {
      this.isItemsSelected = selectedItems;
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      if (!this.IsLoaded) {
        this.loadRecords(this.FilterOptions);
      }
    });
  }

  loadRecords(options: any) {
    this.dataService.LoadRecords(options);
  }
  /* toolbar actions */
  toolbaraction(selection: any) {
    switch (selection.action) {
      case "view":
        console.log(selection.value);
        // this.ViewRecord(selection.value);
        return;
      case "add":
        this.AddRecord();
        return;
      case "m_markas":
        this.ProcessActions(selection.value);
        return;
      case "f_type":
        this.BadgeType = selection.value;
        this._store.dispatch(new filter_records(selection.value));
        this.SetupNavigationActions();
        break;
      case "pagesize":
        this._store.dispatch(new applyFilter({ attr: "pagesize", value: selection.value }));
        break;
      case "categories":
        this.router.navigate(["/settings/gamify/categories/" + this.BadgeType]);
        break;
      case "showcode":
        this.showCode(selection.value);
        break;
    }
  }

  // refresh action buttons
  SetupNavigationActions() {
    this.SearchOptions.actions = this.settingService.initialize_actions(
      this.BadgeType
    );
  }

  /* find records event trigger */
  FindRecords(filters: any) {
    const _filterOptions = filters.filters;
    _filterOptions.pagenumber = 1;
    _filterOptions.track_filter = true; // to force triggering load event via obvervable subscription
    this._store.dispatch(new updateFilterOptions(_filterOptions));
  }

  /* Add Record */
  AddRecord() {
    this.router.navigate(["/settings/gamify/process/0/" + this.BadgeType]);
  }

  showCode(obj: any) {
    const _options: NgbModalOptions = {
      backdrop: false
    };
    const modalRef = this.modalService.open(ViewComponent, _options);
    modalRef.componentInstance.Info = {
      title: obj.title,
      viewtype: 0, // 1: for manage categories, 0: for view code
      data: obj
    };
    modalRef.result.then(
      result => {
        console.log("back result");
        console.log(result);
      },
      dismissed => {
        console.log("dismissed");
      }
    );
  }

  getSelectedItems(arr: any) {
    this.SelectedItems = arr;
    if (this.SelectedItems.length > 0) {
      this.isItemsSelected = true;
    } else {
      this.isItemsSelected = false;
    }
  }

  ProcessActions(selection: any) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
        title:  "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
      return;
    }
    if (this.SelectedItems.length > 0) {
      for (const item of this.SelectedItems) {
        item.actionstatus = selection.actionstatus;
      }
      this.dataService.ProcessActions(this.SelectedItems, selection);
    }
  }
}
