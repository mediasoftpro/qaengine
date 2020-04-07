/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { select } from "@angular-redux/store";
import { QAAPIActions } from "../../../../reducers/qa/actions";
import { DataService } from "../../services/data.service";
import { SettingsService } from "../../services/settings.service";
import { Router } from "@angular/router";
import { CoreAPIActions } from "../../../../reducers/core/actions";
import { CoreService } from "../../../../admin/core/coreService";

@Component({
  selector: "app-smqa-list",
  templateUrl: "./smlist.html",
  providers: [QAAPIActions, DataService, SettingsService]
})
export class SMQAListComponent implements OnInit {
  constructor(
    private actions: QAAPIActions,
    private coreActions: CoreAPIActions,
    private dataService: DataService,
    private router: Router,
    private coreService: CoreService
  ) {}

  @Input() title = "My Questions";
  @Input() type = 0; // 0: My , 1: Favorited, 2: Answered
  @Input() browse_url = '/';
  @Input() rout_url = '/';
  @Input() NoRecordText = "No Questions Asked Yet!";
  @Input() isAdmin = false;
  @Input() stats = 0; 
  @Input() pagesize = 4;
  @Input() orderby = "qa.created_at desc";

  @select(["users", "auth"])
  readonly auth$: Observable<any>;

  loaddata = false;
  Data: any =[];
  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
       this.LoadRecords(auth.User);
    });
     
  }

  LoadRecords(user: any) {
     const query: any = {
        order: this.orderby,
        pagesize: this.pagesize,
        isSummary: true,
        isresolved: 2,
        isfeatured: 3,
        isclosed: 2,
        ispublic: false,
        loadstats: false,
     };
     if (this.type === 1) {
         // favorited
         query.loadfavorites = true;
     }
     else if (this.type === 2) {
        // answered
        query.loadanswers = true;
     }
     if (!this.isAdmin) {
        query.userid = user.id;
     }
     
     this.loaddata = true;
     this.dataService.LoadSmList(query).subscribe(
        (data: any) => {
          this.Data = data.posts;
          for (const item of this.Data) {
            item.enc_id = this.coreService.encrypt(item.id);
          }
          this.loaddata = false;
        },
        err => {
          this.actions.loadFailed(err);
        }
      );
  }

  delete(item: any, index: number, event) {
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteRecord(item, index, this.type);
      this.Data.splice(index, 1);
    }
    event.stopPropagation();
  }

}
