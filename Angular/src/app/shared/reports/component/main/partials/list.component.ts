/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { select } from "@angular-redux/store";
import { AbuseReportActions } from "../../../../../reducers/reports/abuse/actions";
import { DataService } from "../../../../qa/services/data.service";
import { Router } from "@angular/router";
import { CoreAPIActions } from "../../../../../reducers/core/actions";

@Component({
  selector: "app-abusereport-list",
  templateUrl: "./list.html"
})
export class ListComponent implements OnInit {
  constructor(
    private actions: AbuseReportActions,
    private dataService: DataService,
    private coreActions: CoreAPIActions,
    private router: Router
  ) {}

  @Input() route_path = "/reports/abuse/";
  @Input() isActionGranded = false;
  @Input() NoRecordText = "Not Report Available!";

  @select(["abuse", "posts"])
  readonly Data$: Observable<any>;

  @select(["abuse", "loading"])
  readonly loading$: Observable<boolean>;

  @select(["abuse", "pagination"])
  readonly pagination$: Observable<any>;
  
  @Output() View = new EventEmitter<any>();
  @Output() SelectedItems = new EventEmitter<any>();

  selectall = false;

  ngOnInit() {}

  getKey(_, item: any) {
    return item.id;
  }

  /* pagination click event */
  PaginationChange(value: number) {
    // update filter option to query database
    this.actions.applyFilter({ attr: "pagenumber", value: value });
    // update pagination current page (to hightlight selected page)
    this.actions.updatePaginationCurrentPage({ currentpage: value });
  }

  processChange() {
    this.actions.selectAll(this.selectall);
  }

  delete(item: any, index: number, event) {
    if (!this.isActionGranded) {
      this.coreActions.Notify({
        title: "Permission Denied",
        text: "",
        css: "bg-danger"
      });
      return;
    }
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteRecord(item, index, 0);
    }
  }

  action() {
    
  }
}
