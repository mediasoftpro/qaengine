/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, EventEmitter, Input, Output } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import * as advertismentSelectors from "../../../../reducers/settings/advertisements/selectors";
import { applyFilter, updatePaginationCurrentPage} from "../../../../reducers/settings/advertisements/actions";
import { Notify } from "../../../../reducers/core/actions";
import { DataService } from "../services/data.service";

@Component({
  selector: "app-list",
  templateUrl: "./list.html"
})
export class ListComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService
  ) {}

  @Input() isActionGranded = false;

  readonly Data$ = this._store.pipe(select(advertismentSelectors.posts));
  readonly loading$ = this._store.pipe(select(advertismentSelectors.loading));
  readonly pagination$ = this._store.pipe(select(advertismentSelectors.pagination));
  

  ngOnInit() {}

  toggleEditView(item: any, event) {
    if (!item.editview) {
      item.editview = true;
    } else {
      item.editview = false;
    }
    event.stopPropagation();
  }

  _UpdateRecord(item: any) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
      return;
    }
    item.editview = false;
    this.dataService.UpdateRecord(item);
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
}
