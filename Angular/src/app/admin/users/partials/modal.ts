/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { FormService } from "../services/form.service";
import { DataService } from "../services/data.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Router } from "@angular/router";
//import { CoreAPIActions } from "../../../reducers/core/actions";
//import { UserAPIActions } from "../../../reducers/users/actions";
import { CoreService } from "../../../admin/core/coreService";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { addRecord } from "../../../reducers/users/actions";
import { Notify } from "../../../reducers/core/actions";
@Component({
  selector: "viewmodal",
  templateUrl: "./modal.html",
  providers: [FormService, DataService]
})
export class ViewComponent implements OnInit {
  @Input() Info: any;
  title: string;
  data: any;
  viewType: 1; // 1: create account, 2: edit profile, 3: change email, 4: change password, 5: change user type
  showLoader = false;
  heading: string;
  controls: any = [];

  list: any[] = [];
  constructor(
    private _store: Store<IAppState>,
    public activeModal: NgbActiveModal,
    private service: FormService,
    private dataService: DataService,
    private router: Router,
    private coreService: CoreService
  ) {}

  ngOnInit() {
    this.title = this.Info.title;
    this.viewType = this.Info.viewType;
    this.controls = this.service.getControls(this.Info.data, this.viewType);
  }

  SubmitForm(payload) {
    // permission check
    if (this.Info.isActionGranded !== undefined) {
      if (!this.Info.isActionGranded) {
        this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
        return;
      }
    }
    // custom validation
    if (this.Info.viewType === 1 || this.Info.viewType === 4) {
      if (payload.password !== payload.cpassword) {
        this._store.dispatch(new Notify({
          title:  "Password not matched",
          text: "",
          css: "bg-danger"
        }));
      }
    }

    this.showLoader = true;
    // adjust values with actual object
    if (this.Info.viewType !== 2) {
      for (const prop of Object.keys(this.Info.data)) {
        for (const payload_prop of Object.keys(payload)) {
          if (prop === payload_prop) {
            this.Info.data[prop] = payload[payload_prop];
          }
        }
      }
    }

    /*this.Info.data.attr_values = this.coreService.processDynamicControlsData(
      payload,
      this.Info.data
    );*/
  
    console.log(this.Info.data);
    this.dataService.AddRecord(this.Info.data).subscribe(
      (data: any) => {
        if (data.status === "error") {
           this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-danger"
          }));
        } else {
          let message = "Account Created Successfully";
          
          this._store.dispatch(new addRecord(data.record));
           this._store.dispatch(new Notify({
            title: message,
            text: "",
            css: "bg-success"
          }));

          if (this.Info.viewType === 1) {
            this.router.navigate(["/users/profile/" + data.record.id]);
          }

          this.activeModal.close({
            data: data.record
          });
          
        }
        this.showLoader = false;
      },
      err => {
        this.showLoader = false;
        this._store.dispatch(new Notify({
          title: "Error Occured",
          text: "",
          css: "bg-danger"
        }));
      }
    );
  }
  close() {
    this.activeModal.dismiss("Cancel Clicked");
  }
}
