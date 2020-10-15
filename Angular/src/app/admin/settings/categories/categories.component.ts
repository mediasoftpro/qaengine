/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { Router } from "@angular/router";


// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";

// shared services
import { CoreService } from "../../core/coreService";
//import { CoreAPIActions } from "../../../reducers/core/actions";

// reducer actions
import * as categoriesSelectors from "../../../reducers/settings/categories/selectors";
import {
  applyFilter,
  updateItemsSelectionStatus,
  addRecord,
  updateFilterOptions,
  refresh_pagination,
} from "../../../reducers/settings/categories/actions";

import { Notify, refreshListStats } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";
import * as configSelectors from "../../../reducers/configs/selectors";

//import { CategoriesAPIActions } from "../../../reducers/settings/categories/actions";
import { fadeInAnimation } from "../../../animations/core";

import { PermissionService } from "../../../admin/users/services/permission.service";
import { ContentTypes } from "../../../configs/settings";
@Component({
  templateUrl: "./categories.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class CategoriesComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private router: Router,
    public permission: PermissionService,
    private coreService: CoreService
  ) {}

  readonly filteroptions$ = this._store.pipe(
    select(categoriesSelectors.filteroptions)
  );
  
  readonly isloaded$ = this._store.pipe(select(categoriesSelectors.isloaded));
  readonly isItemSelected$ = this._store.pipe(
    select(categoriesSelectors.itemsselected)
  );
  readonly records$ = this._store.pipe(select(categoriesSelectors.records));
  readonly pagination$ = this._store.pipe(select(categoriesSelectors.pagination));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  readonly auth$ = this._store.pipe(select(auth));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  heading = "Categories";
  subheading = "Management";
  SearchOptions: any;
  ToolbarOptions: any;

  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters

  CategoryCaption = "";
  Records = 0;
  Pagination: any = {};
  Configs: any = {};
  CategoryTypes: any = [];
  ngOnInit() {
    this.configs$.subscribe((configs: any) => {
      this.Configs = configs;
      if (configs.general !== undefined) {
        for (const prop in configs.general.category) {
          this.CategoryTypes.push({
             id: configs.general.category[prop],
             title: prop
          })
        }
      }
    });
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
    this.ToolbarOptions = this.settingService.getToolbarOptions();

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
      if (options.track_filter) {
        this.dataService.LoadRecords(options);
        // reset track filter to false again
        this.FilterOptions.track_filter = false;
         this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }

      if (this.Configs.general !== undefined) {
        const categories: any = [];
        for (const prop in this.Configs.general.category) {
          if (this.Configs.general.category[prop] === options.type) {
            this.CategoryCaption = prop;
            this.ToolbarOptions.left_options[0].title = "[" + prop + "]";
          }
        }
      }
     
    });
    this.records$.subscribe(records => {
      this.Records = records;
    });

    this.pagination$.subscribe(pagination => {
      this.Pagination = pagination;
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.dataService.LoadRecords(this.FilterOptions);
      } else {
        // loaded data from reducer store (cache)
        // update pagination (records & pagesize on load)
        this.refreshStats();
      }
    });
    this.isItemSelected$.subscribe((selectedItems: boolean) => {
      this.isItemsSelected = selectedItems;
    });
  }

  /* toolbar actions */
  toolbaraction(selection: any) {
    switch (selection.action) {
      case "add":
        this.AddRecord();
        return;
      case "m_markas":
        this.ProcessActions(selection.value);
        return;
      case "f_type":
         this._store.dispatch(new applyFilter({ attr: "type", value: selection.value }));
        break;
      case "f_status":
        this._store.dispatch(new applyFilter({ attr: "isenabled", value: selection.value }));
        break;
      case "pagesize":
        this._store.dispatch(new applyFilter({ attr: "pagesize", value: selection.value }));
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

  /* Add Record */
  AddRecord() {
    this.router.navigate(["/settings/categories/process/"]);
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

  refreshStats() {
    this._store.dispatch(new refresh_pagination({
      type: 0,
      totalrecords: this.Records,
      pagesize: this.FilterOptions.pagesize
    }));
   
    // refresh list states
   
    this._store.dispatch(new refreshListStats({
      totalrecords: this.Records,
      pagesize: this.FilterOptions.pagesize,
      pagenumber: this.Pagination.currentPage
    }));
  }
}
