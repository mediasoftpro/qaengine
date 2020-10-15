/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../../reducers/store/model";
import * as selectors from "../../../../../reducers/reports/abuse/selectors";
import { applyFilter, updatePaginationCurrentPage, selectAll} from "../../../../../reducers/reports/abuse/actions";
import { Notify } from "../../../../../reducers/core/actions";

//import { AbuseReportActions } from "../../../../../reducers/reports/abuse/actions";
import { DataService } from "../../../../adlistings/services/data.service";
import { Router } from "@angular/router";
//import { CoreAPIActions } from "../../../../../reducers/core/actions";

@Component({
  selector: "app-abusereport-list",
  templateUrl: "./list.html"
})
export class ListComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private router: Router
  ) {}

  @Input() route_path = "/reports/abuse/";
  @Input() isActionGranded = false;
  @Input() NoRecordText = "Not Report Available!";

  
  readonly Data$ = this._store.pipe(select(selectors.posts));
  readonly loading$ = this._store.pipe(select(selectors.loading));
  readonly pagination$ = this._store.pipe(select(selectors.pagination));
  readonly selectAll$ = this._store.pipe(select(selectors.selectall));
  
  @Output() View = new EventEmitter<any>();
  @Output() SelectedItems = new EventEmitter<any>();

  selectall = false;

  Data: any = [];
  ngOnInit() {

    this.Data$.subscribe((data: any) => {
      this.Data = data.map(item => {
        return Object.assign({}, item);
      });
    });
  }

  getKey(_, item: any) {
    return item.id;
  }

  /* pagination click event */
  PaginationChange(value: number) {
    // update filter option to query database
    this._store.dispatch(new applyFilter({ attr: "pagenumber", value: value }));
    // update pagination current page (to hightlight selected page)
    this._store.dispatch(new updatePaginationCurrentPage({ currentpage: value }));
  }

  processChange() {
   this._store.dispatch(new selectAll(this.selectall));
  }

  delete(item: any, index: number, event) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
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
