/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { select } from "@angular-redux/store";
import { Observable } from "rxjs/Observable";

// services
import { SettingsService } from "../../services/settings.service";
import { DataService } from "../../services/data.service";

import { ActivatedRoute, Router } from "@angular/router";

// shared services
import { CoreService } from "../../../../admin/core/coreService";
import { CoreAPIActions } from "../../../../reducers/core/actions";
import { fadeInAnimation } from "../../../../animations/core";
import { AbuseReportActions } from "../../../../reducers/reports/abuse/actions";
import { PermissionService } from "../../../../admin/users/services/permission.service";

@Component({
  selector: "app-mainabuse",
  templateUrl: "./main.html",
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class MainAbuseReportComponent implements OnInit {
  constructor(
    private settingService: SettingsService,
    private dataService: DataService,
    public permission: PermissionService,
    private coreActions: CoreAPIActions,
    private actions: AbuseReportActions,
    private router: Router,
    private route: ActivatedRoute,
    private coreService: CoreService
  ) {}

  @Input() route_path = "/reports/abuse/";

  @select(["abuse", "filteroptions"])
  readonly filteroptions$: Observable<any>;

  @select(["abuse", "itemsselected"])
  readonly isItemSelected$: Observable<any>;

  @select(["abuse", "records"])
  readonly records$: Observable<any>;

  @select(["abuse", "pagination"])
  readonly pagination$: Observable<any>;

  @select(["users", "auth"])
  readonly auth$: Observable<any>;

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
      this.FilterOptions = options;
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
        this.actions.updateFilterOptions(this.FilterOptions);
      }

    });

  }

  loadRecords(options: any) {
    
    // load records
    this.dataService.LoadRecords(options);
  }

  refreshStats() {
    console.log(this.Records + "records");
    this.actions.refresh_pagination({
      type: 0,
      totalrecords: this.Records,
      pagesize: this.FilterOptions.pagesize
    });
    // refresh list states
    this.coreActions.refreshListStats({
      totalrecords: this.Records,
      pagesize: this.FilterOptions.pagesize,
      pagenumber: this.Pagination.currentPage
    });
  }
}
