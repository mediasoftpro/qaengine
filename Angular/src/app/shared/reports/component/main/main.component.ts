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

// services
import { SettingsService } from "../../services/settings.service";
import { DataService } from "../../services/data.service";

import { ActivatedRoute, Router } from "@angular/router";

// shared services
import { CoreService } from "../../../../admin/core/coreService";
//import { CoreAPIActions } from "../../../../reducers/core/actions";
import { fadeInAnimation } from "../../../../animations/core";
//import { AbuseReportActions } from "../../../../reducers/reports/abuse/actions";
import { PermissionService } from "../../../../admin/users/services/permission.service";

// reducer actions
import * as selectors from "../../../../reducers/reports/abuse/selectors";
import {
  applyFilter,
  updateItemsSelectionStatus,
  selectAll,
  updateFilterOptions,
  refresh_pagination,
} from "../../../../reducers/reports/abuse/actions";

import { Notify, refreshListStats } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";

@Component({
  selector: "app-mainabuse",
  templateUrl: "./main.html",
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class MainAbuseReportComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    public permission: PermissionService,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService
  ) {}

  @Input() route_path = "/reports/abuse/";
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
  /*@select(["abuse", "filteroptions"])
  readonly filteroptions$: Observable<any>;

  @select(["abuse", "itemsselected"])
  readonly isItemSelected$: Observable<any>;

  @select(["abuse", "records"])
  readonly records$: Observable<any>;

  @select(["abuse", "pagination"])
  readonly pagination$: Observable<any>;

 readonly auth$ = this._store.pipe(select(auth));*/

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  IsLoaded = false;
  SelectedItems: any; // selected items in list by check / uncheck options
  isItemsSelected = false; // check the isenabled of items there or not
  FilterOptions: any; // local copy of observable query filters
  Records = 0;
  Pagination: any = {};

  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1521395185368";
      const ReadOnlyAccessID = "1521395801970";
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

    this.filteroptions$.subscribe(options => {
      this.FilterOptions = Object.assign({}, options);
    });

    this.isItemSelected$.subscribe((selectedItems: boolean) => {
      this.isItemsSelected = selectedItems;
    });

    this.records$.subscribe(records => {
      this.Records = records;
    });

    this.pagination$.subscribe(pagination => {
      this.Pagination = pagination;
    });

    this.route.params.subscribe(params => {
      if (params["type"] !== undefined) {
        console.log('type exist');
        this.FilterOptions.type = params["type"];
      }

      if (params["id"] !== undefined) {
        this.FilterOptions.contentid = this.coreService.decrypt(params["id"]);
        this.FilterOptions.track_filter = true; // to force triggering load event via obvervable subscription
        console.log('contentid exist');
        this._store.dispatch(new updateFilterOptions(this.FilterOptions));
      }

    });

  }

  loadRecords(options: any) {
    
    // load records
    this.dataService.LoadRecords(options);
  }

  refreshStats() {
    console.log(this.Records + "records");
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
