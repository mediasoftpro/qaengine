/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

// services
import { SettingsService } from "../../services/settings.service";
import { DataService } from "../../services/data.service";


// reducer actions
import * as selectors from "../../../../reducers/blogs/selectors";
import {
  applyFilter,
  updateItemsSelectionStatus,
  selectAll,
  updateFilterOptions,
  refresh_pagination,
} from "../../../../reducers/blogs/actions";

import { Notify, refreshListStats } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";

// shared services
import { CoreService } from "../../../../admin/core/coreService";
import { fadeInAnimation } from "../../../../animations/core";

import { Router, ActivatedRoute } from "@angular/router";
import { PermissionService } from "../../../../admin/users/services/permission.service";

@Component({
  templateUrl: "./main.html",
  selector: "app-blog-mainlist"
})
export class BlogsV2Component implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    public permission: PermissionService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  @Input() isAdmin = true;
  @Input() route_path = "/blogs/";
  @Input() PublicView = false;
  @Input() type = 0;

  readonly filteroptions$ = this._store.pipe(
    select(selectors.filteroptions)
  );
  readonly isloaded$ = this._store.pipe(select(selectors.isloaded));
  readonly categories$ = this._store.pipe(select(selectors.categories));
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

  heading = "Blogs";
  subheading = "Management";
  SearchOptions: any;
  ToolbarOptions: any;

  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters
  IsLoaded = false;

  Records = 0;
  Pagination: any = {};

  showReportLink = false;

  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      if (this.isAdmin) {
        const FullAccessID = "1521396112858";
        const ReadOnlyAccessID = "1521396141248";
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
      } else {
        this.isAccessGranted = true;
        this.isActionGranded = true;
      }
    });

    this.SearchOptions = this.settingService.getSearchOptions(this.isAdmin);
    this.ToolbarOptions = this.settingService.getToolbarOptions(this.isAdmin);

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
      if (options.track_filter) {
        this.loadRecords(this.FilterOptions);
        // reset track filter to false again
        this.FilterOptions.track_filter = false;
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }
    });

    this.records$.subscribe(records => {
      this.Records = records;
    });

    this.pagination$.subscribe(pagination => {
      this.Pagination = pagination;
    });

    this.isItemSelected$.subscribe((selectedItems: boolean) => {
      this.isItemsSelected = selectedItems;
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      if (!this.IsLoaded) {
        this.loadRecords(this.FilterOptions);
      } else {
        // loaded data from reducer store (cache)
        // update pagination (records & pagesize on load)
        this.refreshStats();
      }
    });

    this.categories$.subscribe(categories => {
      for (const category of categories) {
        this.SearchOptions.categories.push({
          key: category.id,
          value: category.title
        });
      }
    });

    this.route.params.subscribe(params => {
      // this.Params = params;
      if (params["tagname"] !== undefined) {
        console.log("tag filter initiated");
        this.FilterOptions.tags = params["tagname"];
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }

      if (params["catname"] !== undefined) {
        this.FilterOptions.categoryname = params["catname"];
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }

      if (params["uname"] !== undefined) {
        this.FilterOptions.userid = params["uname"];
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }

      if (params["abuse"] !== undefined) {
        if (params["abuse"] === 'abuse') {
           this.FilterOptions.loadabusereports = true;
           this.showReportLink = true;
          
        } else if (params["abuse"] === 'normallist') {
            this.FilterOptions.loadabusereports = false;
            this.showReportLink = false;
        }
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }
      
    });
  }

  loadRecords(options: any) {
    // render abuse report button with action
    this.coreService.renderAbuseReportBtn(
      this.SearchOptions.actions,
      options.loadabusereports
    );

    if (this.PublicView) {
      options.ispublic = true;
    }
    
    // load records
    this.dataService.LoadRecords(options);
  }

  selectAll(selectall: boolean) {
    this._store.dispatch(new selectAll(selectall));
  }
  /* toolbar actions */
  toolbaraction(selection: any) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
      return;
    }
    switch (selection.action) {
      case "view":
        this.router.navigate([this.route_path + "profile/0"]);
        return;
      case "add":
        this.router.navigate([this.route_path + "process/0"]);
        return;
      case "abuse":
        this.router.navigate([this.route_path + "filter/abuse"]);
        return;
      case "normallist":
        this.router.navigate([this.route_path + "filter/normallist"]);
        return;
      case "reports":
        this.router.navigate([this.route_path + "reports"]);
        return;
      case "m_markas":
        this.ProcessActions(selection.value);
        return;
      case "f_type":
         this._store.dispatch(new applyFilter({ attr: "type", value: selection.value }));
        break;
      case "f_isapproved":
        this._store.dispatch(new applyFilter({ attr: "isapproved", value: selection.value }));
        break;
      case "f_status":
        this._store.dispatch(new applyFilter({ attr: "isenabled", value: selection.value }));
        break;
      case "f_adult":
        this._store.dispatch(new applyFilter({ attr: "isadult", value: selection.value }));
        break;
      case "pagesize":
        this._store.dispatch(new applyFilter({ attr: "pagesize", value: selection.value }));
        break;
      case "m_filter":
        this._store.dispatch(new applyFilter({ attr: "datefilter", value: selection.value }));
        break;
      case "sort":
        this._store.dispatch(new applyFilter({ attr: "direction", value: selection.value }));
        break;
    }
  }

  /* find records event trigger */
  FindRecords(filters: any) {
    const _filterOptions = filters.filters;
    // reset some attributes if search / find record is used to avoid any confusion in search listing
    _filterOptions.tags = "";
    _filterOptions.pagenumber = 1;
    _filterOptions.track_filter = true; // to force triggering load event via obvervable subscription
      this._store.dispatch(new updateFilterOptions(_filterOptions));
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
    if (this.SelectedItems.length > 0) {
      for (const item of this.SelectedItems) {
        item.actionstatus = selection.actionstatus;
      }
      this.dataService.ProcessActions(this.SelectedItems, selection);
    }
  }

  refreshStats() {
    this._store.dispatch(new refresh_pagination({
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
