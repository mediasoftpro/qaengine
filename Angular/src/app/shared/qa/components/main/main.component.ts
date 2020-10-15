/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

// services
import { SettingsService } from "../../services/settings.service";
import { DataService } from "../../services/data.service";
import { PermissionService } from "../../../../admin/users/services/permission.service";

// shared services
import { CoreService } from "../../../../admin/core/coreService";

// reducer actions
import * as selectors from "../../../../reducers/qa/selectors";
import {
  applyFilter,
  updateItemsSelectionStatus,
  selectAll,
  updateFilterOptions,
  refresh_pagination,
} from "../../../../reducers/qa/actions";

import { Notify, refreshListStats } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";

import { fadeInAnimation } from "../../../../animations/core";

@Component({
  templateUrl: "./main.html",
  selector: "app-qa-mainlist",
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" },
})
export class MainQAComponent implements OnInit {

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
  @Input() reload = false;
  @Input() type = 0; // 0: My Qa, 1: Favorited Qa, 2: Liked Qa, 3: My Answer Qa
  @Input() PublicView = false;
  @Input() route_path = "/qa/";

  
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

  heading = "QA";
  subheading = "Management";
  SearchOptions: any;
  ToolbarOptions: any;
  IsLoaded = false;
  User: any = {};

  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters
  Records = 0;
  Pagination: any = {};

  showReportLink = false;

  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
      if (this.isAdmin) {
        const FullAccessID = "1521395965196";
        const ReadOnlyAccessID = "1521396022188";
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
    this.ToolbarOptions = this.settingService.getToolbarOptions(
      this.type,
      this.isAdmin
    );

    this.filteroptions$.subscribe((options) => {
      this.FilterOptions = Object.assign({}, options);
      if (this.reload) {
        // load directly without loading from store
        this.loadRecords(options);
      } else {
        if (options.track_filter) {
          this.loadRecords(options);
          // reset track filter to false again
          options.track_filter = false;
           this._store.dispatch(new updateFilterOptions(this.FilterOptions));
        }
      }
    });

    this.isItemSelected$.subscribe((selectedItems: boolean) => {
      this.isItemsSelected = selectedItems;
    });

    this.records$.subscribe((records) => {
      this.Records = records;
    });

    this.pagination$.subscribe((pagination) => {
      this.Pagination = pagination;
    });

    this.categories$.subscribe((categories) => {
      for (const category of categories) {
        this.SearchOptions.categories.push({
          key: category.id,
          value: category.title,
        });
      }
    });

    this.route.params.subscribe((params) => {
      if (params["tagname"] !== undefined) {
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
        if (params["abuse"] === "abuse") {
          this.FilterOptions.loadabusereports = true;
          this.showReportLink = true;
        } else if (params["abuse"] === "normallist") {
          this.FilterOptions.loadabusereports = false;
          this.showReportLink = false;
        }
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      if (!loaded || this.reload) {
        this.loadRecords(this.FilterOptions);
      } else {
        // loaded data from reducer store (cache)
        // update pagination (records & pagesize on load)
        this.refreshStats();
      }
    });
  }

  loadRecords(options: any) {
    switch (this.type) {
      case 0:
        // main records
        options.loadliked = false;
        options.loadfavorites = false;
        options.loadanswers = false;
        break;
      case 1:
        // favorited records
        // note userid also needed to load user favorited records
        if (options.userid !== undefined && options.userid !== "") {
          options.loadfavorites = true;
          options.loadliked = false;
          options.loadanswers = false;
        }
        break;
      case 2:
        // liked records
        // note userid also need to load user liked records
        if (options.userid !== undefined && options.userid !== "") {
          options.loadliked = true;
          options.loadfavorites = false;
          options.loadanswers = false;
        }
        break;
      case 2:
        // my answered records
        // note userid also need to load user my answered records
        if (options.userid !== undefined && options.userid !== "") {
          options.loadanswers = true;
          options.loadliked = false;
          options.loadfavorites = false;
        }
    }

    // render abuse report button with action
    this.coreService.renderAbuseReportBtn(
      this.SearchOptions.actions,
      options.loadabusereports
    );

    if (this.PublicView) {
      options.ispublic = true;
    }
    this.dataService.LoadRecords(options);
  }

  selectAll(selectall: boolean) {
    this._store.dispatch(new selectAll({
      type: this.type,
      checked: selectall,
    }));
  
  }

  /* toolbar actions */
  toolbaraction(selection: any) {
    switch (selection.action) {
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
    _filterOptions.userid = "";
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
    if (!this.isActionGranded) {
      this._store.dispatch(new updateFilterOptions({
        title: "Permission Denied",
        text: "",
        css: "bg-danger",
      }));
      
      return;
    }
    if (this.SelectedItems.length > 0) {
      for (const item of this.SelectedItems) {
        item.actionstatus = selection.actionstatus;
        // replace content auther userid with logged user id if type > 0
        if (this.type > 0) {
          item.userid = this.User.id;
        }
      }
      this.dataService.ProcessActions(this.SelectedItems, selection, 0);
    }
  }

  refreshStats() {
    this._store.dispatch(new refresh_pagination({
      type: this.type,
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
