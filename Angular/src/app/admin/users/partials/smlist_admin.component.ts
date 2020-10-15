/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import * as selectors from "../../../reducers/admin/dashboard/selectors";
import { Notify } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";
//import { UserAPIActions } from "../../../reducers/users/actions";
import { DataService } from "../services/data.service";
import { SettingsService } from "../services/settings.service";
import { Router } from "@angular/router";
//import { CoreAPIActions } from "../../../reducers/core/actions";
import { CoreService } from "../../../admin/core/coreService";

@Component({
  selector: "app-smuser-list-admin",
  templateUrl: "./smlist_admin.html",
  providers: [DataService, SettingsService],
})
export class SMAdminUserListComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private router: Router,
    private coreService: CoreService
  ) {}

  @Input() title = "User List";
  @Input() type = 0; // 0: My , 1: Favorited
  @Input() browse_url = "/";
  @Input() rout_url = "/";
  @Input() NoRecordText = "No Users Found!";
  @Input() isAdmin = false;
  @Input() stats = 0;
  @Input() row_class = "col-md-4 col-sm-6 col-xs-12";
  @Input() pagesize = 6;
  @Input() orderby = "created_at desc";

  readonly auth$ = this._store.pipe(select(auth));
  readonly isloaded$ = this._store.pipe(select(selectors.isloaded));
  readonly users$ = this._store.pipe(select(selectors.users));
  readonly user_loading$ = this._store.pipe(select(selectors.user_loading));
  /*
  @select(["dashboard", "isloaded"])
  readonly isloaded$: Observable<any>;

  @select(["dashboard", "users"])
  readonly users$: Observable<any>;

  @select(["dashboard", "user_loading"])
  readonly user_loading$: Observable<any>;
*/
  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      //this.LoadRecords(auth.User);
    });
    this.isloaded$.subscribe((loaded: boolean) => {
      if (!loaded) {
        this.LoadRecords();
      }
    });
  }

  LoadRecords() {
    const query: any = {
      order: this.orderby,
      pagesize: this.pagesize,
      isSummary: true,
      loadstats: false,
      ispublic: false,
    };

    if (!this.isAdmin) {
      //  query.userid = user.id;
    }

    this.dataService.LoadSmListReducer(query);
  }
}
