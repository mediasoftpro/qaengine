/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, Input } from "@angular/core";
import { FormService } from "./form.service";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
//import { CoreAPIActions } from "../../../reducers/core/actions";

@Component({
  selector: "viewmodal",
  templateUrl: "./modal.html",
  providers: [FormService]
})
export class FormViewComponent implements OnInit {
  @Input() Info: any;
  title: string;
  data: any;

  showLoader = false;
  heading: string;
  controls: any[];


  constructor(
    public activeModal: NgbActiveModal,
    private service: FormService
  ) {}

  ngOnInit() {

    this.title = this.Info.title;
    this.controls = this.service.getControls(this.Info.data, this.Info.isedit);
  }

  SubmitForm(payload) {
    this.activeModal.close({
      data: payload
    });
  }

  close() {
    this.activeModal.dismiss("Cancel Clicked");
  }
}
