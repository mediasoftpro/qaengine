/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";
import {
  trigger,
  style,
  transition,
  animate,
  keyframes
} from "@angular/animations";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import { DataService } from "../services/data.service";
// reducer actions
import * as selectors from "../../../../reducers/settings/gamify/selectors";
import {
  updatePaginationCurrentPage,
  applyFilter,
  selectAll
} from "../../../../reducers/settings/gamify/actions";
import { Notify, refreshListStats } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";

@Component({
  selector: "app-list",
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
    private dataService: DataService
  ) {}

  @Input() isActionGranded = false;

  readonly Data$ = this._store.pipe(select(selectors.filter_posts));
  readonly loading$ = this._store.pipe(select(selectors.loading));
  readonly pagination$ = this._store.pipe(select(selectors.pagination));
  readonly selectAll$ = this._store.pipe(select(selectors.selectall));
 
  readonly auth$ = this._store.pipe(select(auth));

  @Output() View = new EventEmitter<any>();
  @Output() SelectedItems = new EventEmitter<any>();

  selectall = false;
  BadgeType = 1;
 
  Data: any = [];
  ngOnInit() {

    this.Data$.subscribe((data: any) => {
      this.Data = data.map(item => {
        return Object.assign({}, item);
      });
      if (this.Data.length > 0) {
        this.BadgeType =  this.Data[0].type;
      }
       // update list stats
       this._store.dispatch(new refreshListStats({
        totalrecords: this.Data.length,
        pagesize: 1000,
        pagenumber: 1
      }));
      
    });

    this.selectAll$.subscribe((selectall: boolean) => {
      this.selectall = selectall;
      this.checkChange();
    });

  }

  /* action trigger */
  viewRecord(obj, event) {
    this.View.emit({ action: "view", value: obj });
    event.stopPropagation();
  }

  // Since we're observing an array of items, we need to set up a 'trackBy'
  // parameter so Angular doesn't tear down and rebuild the list's DOM every
  // time there's an update.
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
        title:  "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
      return;
    }
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteRecord(item, index);
    }
  }

  showCode(item: any, index: number, event) {
    this.View.emit({ action: "showcode", value: item });
    event.stopPropagation();
  }

  processChange() {
    this._store.dispatch(new selectAll(this.selectall));
  }

  checkChange() {
    this.Data$.subscribe(items => {
      const _items = [];
      for (const item of items) {
        if (item.Selected) {
          _items.push(item);
        }
      }
      this.SelectedItems.emit(_items);
    });
  }
}
