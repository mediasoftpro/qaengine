
/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";
import { Component, OnInit, Input } from "@angular/core";
import { FormService } from "../../services/form.service";
import { DataService } from "../../services/data.service";
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
    this.controls = this.service.getAnswerControls(this.Info.data);
  }

  SubmitForm(payload) {
    // permission check
    if (this.Info.isActionGranded !== undefined) {
      if (!this.Info.isActionGranded) {
        this._store.dispatch(new Notify({
          title: "Permission Denied",
          text: "",
          css: "bg-danger"
        }));
       
        return;
      }
    }
    payload.id = this.Info.data.id;
    payload.userid = this.Info.data.userid;
    payload.qid = this.Info.data.qid;
    payload.answers = this.Info.answers;
    let _status = "Added";
    if (this.Info.data.id > 0) {
      payload.id = this.Info.data.id;
      _status = "Updated";
    }
    this.showLoader = true;
    this.dataService.PostAnswer(payload).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-error"
          }));
         
        } else {
          this._store.dispatch(new Notify({
            title: "Record " + _status + " Successfully",
            text: "",
            css: "bg-success"
          }));
         

          this.activeModal.close({
            data: data.record,
            isenabled: _status
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
