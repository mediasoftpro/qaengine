/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import * as selectors from "../../../../reducers/admin/dashboard/selectors";
import { Notify } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";

//import { BlogAPIActions } from "../../../../reducers/blogs/actions";
import { DataService } from "../../services/data.service";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
//import { CoreAPIActions } from "../../../../reducers/core/actions";
import { CoreService } from "../../../../admin/core/coreService";
@Component({
  selector: "app-smblogs-list-admin",
  templateUrl: "./smlist_admin.html",
  providers: [DataService, SettingsService]
})
export class SMBlogsAdminListComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private router: Router,
    private coreService: CoreService
  ) {}

  @Input() title = "My Blogs";
  @Input() type = 0; // 0: My , 1: Favorited, 2: Answered
  @Input() browse_url = '/';
  @Input() rout_url = '/';
  @Input() NoRecordText = "No Blogs Posted Yet!";
  @Input() isAdmin = false;
  @Input() stats = 0; 
  @Input() pagesize = 4;
  @Input() orderby = "blog.created_at desc";
  @Input() row_class = "col-md-4 col-sm-6 col-xs-12";
  
 readonly auth$ = this._store.pipe(select(auth));

  /*@select(["dashboard", "isloaded"])
  readonly isloaded$: Observable<any>;

  @select(["dashboard", "blogs"])
  readonly blogs$: Observable<any>;

  @select(["dashboard", "blog_loading"])
  readonly blog_loading$: Observable<any>;*/
 
  readonly isloaded$ = this._store.pipe(
    select(selectors.isloaded)
  );
  readonly blogs$ = this._store.pipe(select(selectors.blogs));
  readonly blog_loading$ = this._store.pipe(
    select(selectors.blog_loading)
  );

  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
       // this.LoadRecords(auth.User);
    });
    this.isloaded$.subscribe((loaded: boolean) => {
        if (!loaded) {
            this.LoadRecords()
        }
    });
  }

  LoadRecords() {
     const query: any = {
        order: this.orderby,
        pagesize: this.pagesize,
        isSummary: true,
        isapproved: 2,
        isenabled: 2,
        isfeatured: 3,
        loadstats: false,
        ispublic: false,
     };
     if (this.type === 1) {
         // favorited
         query.loadfavorites = true;
     }
     
     if (!this.isAdmin) {
        //query.userid = user.id;
     }
     
     
     this.dataService.LoadSmListReducer(query);
  }

  delete(item: any, index: number, event) {
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteRecord(item, index);
      // this.Data.splice(index, 1);
    }
    event.stopPropagation();
  }

}
