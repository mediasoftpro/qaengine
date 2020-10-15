/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import * as selectors from "../../../../reducers/qa/selectors";
import { applyFilter, updatePaginationCurrentPage, selectAll} from "../../../../reducers/qa/actions";
import { Notify } from "../../../../reducers/core/actions";
import { DataService } from "../../services/data.service";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes
} from "@angular/animations";
import { Router } from "@angular/router";


@Component({
  selector: "app-qa-list",
  templateUrl: "./list.html",
  animations: [
    trigger("fadeIn", [
      transition(":enter", [
        style({ opacity: "0", background: "#f5fb98" }),
        animate(
          "300ms ease-out",
          keyframes([
            style({ opacity: 0, transform: "translateY(-75%)", offset: 0 }),
            style({ opacity: 0.5, transform: "translateY(35px)", offset: 0.5 }),
            style({ opacity: 1, transform: "translateY(0)", offset: 1.0 })
          ])
        )
      ])
    ])
  ]
})
export class ListComponent implements OnInit {

  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private router: Router
  ) {}

  @Input() PublicView = false;
  @Input() isActionGranded = false;
  @Input() isAdmin = true;
  @Input() type = 0; // 0: My Qa, 1: Favorited Qa, 2: Liked Qa, 3: Answered Qa
  @Input() NoRecordText = "Not Questions Asked Yet!";
  @Input() route_path = '/qa/';
  @Input() showReportLink = false;

  // Content Type for Abuse Reporting (QA) => api ref (AbuseReport.Types)
  AbuseContentType = 11;

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
    this.selectAll$.subscribe((selectall: boolean) => {
      this.selectall = selectall;
      this.checkChange();
    });
  }

  viewRecord(obj, event) {
    this.router.navigate([this.route_path + "profile/" + obj.enc_id]);
    event.stopPropagation();
  }

  editRecord(obj, event) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
        title: "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
      return;
    }
    this.router.navigate([this.route_path + "process/" + obj.enc_id]);
    event.stopPropagation();
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

  delete(item: any, index: number, event) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
        title: "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
      return;
    }
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteRecord(item, index, this.type);
    }
  }

  processChange() {
    this._store.dispatch(new selectAll(this.selectall));
  }
  
  checkChange() {
    const _items = [];
    for (const item of this.Data) {
      if (item.Selected) {
        _items.push(item);
      }
    }
    this.SelectedItems.emit(_items);
  }

  
}
