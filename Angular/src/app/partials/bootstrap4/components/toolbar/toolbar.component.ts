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
import * as selectors from "../../../../reducers/core/selectors";

@Component({
  selector: "app-toolbar-v2",
  templateUrl: "./toolbar.html",
})
export class BootstrapToolbarComponent implements OnInit {
  constructor(private _store: Store<IAppState>) {}

  @Input() Options: any;
  @Input() isItemsSelected = false;
  @Input() isAdmin = true;

  @Output() Action = new EventEmitter<any>();
  @Output() SelectAllCard = new EventEmitter<boolean>();
  @Input() ProfileView = false;

  selectall = false;

  readonly liststats$ = this._store.pipe(select(selectors.liststats));
  /*@select(["core", "liststats"])
  readonly liststats$: Observable<any>;*/

  ngOnInit() {
    // let pagination = new PaginationService(this.Options);
    // this.Links = pagination.ProcessPagination();
  }

  /* action trigger */
  toolbaraction(action, value, event) {
    this.Action.emit({ action, value });
    event.stopPropagation();
  }

  processChange() {
    this.SelectAllCard.emit(this.selectall);
  }
}
