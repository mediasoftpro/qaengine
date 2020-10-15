/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Store } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import { Component, OnInit, Input } from "@angular/core";
import { FormService } from "../services/form.service";
import { DataService } from "../services/data.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Notify } from "../../../../reducers/core/actions";

@Component({
  selector: "viewmodal",
  templateUrl: "./modal.html",
  providers: [FormService, DataService]
})
export class ViewComponent implements OnInit {
  @Input() Info: any;
  title: string;
  data: any;
  ViewType = 1; // 1: add / edit categories, 2: view code
  showLoader = false;
  heading: string;
  controls: any[];

  list: any[] = [];
  constructor(
    private _store: Store<IAppState>,
    public activeModal: NgbActiveModal,
    private service: FormService,
     private dataService: DataService
  ) {}

  ngOnInit() {
    this.title = this.Info.title;
    this.ViewType = this.Info.viewtype;

    this.controls = this.service.getCategoryControls(this.Info.data);
    console.log(this.controls);
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
    payload.id = this.Info.data.id;
    if (payload.id === 0) {
      payload.uniqueid = new Date().valueOf();
    } else {
      payload.uniqueid = "";
    }
    this.activeModal.close({
      data: payload
    });
  }
  close() {
    this.activeModal.dismiss("Cancel Clicked");
  }
}
