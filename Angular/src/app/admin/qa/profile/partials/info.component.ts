
/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, Input, OnInit } from "@angular/core";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

/* modal popup */
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
// modal popup
import { ViewComponent } from "../../../../shared/qa/components/partials/modal.component";
import { SettingsService } from "../../../../shared/qa/services/settings.service";
import { DataService } from "../../../../shared/qa/services/data.service";

import { auth } from "../../../../reducers/users/selectors";

@Component({
  selector: "app-qa-info",
  templateUrl: "./info.html"
})
export class QAProfileInfoComponent implements OnInit {

  readonly auth$ = this._store.pipe(select(auth));

  constructor(
    private _store: Store<IAppState>,
    private modalService: NgbModal,
    private settingService: SettingsService,
    private dataService: DataService
  ) {}

  @Input() Info: any = {};
  @Input() Author_FullName = "";
  Auth: any = {};

  ngOnInit() {
    this.auth$.subscribe((auth: any) => {
      this.Auth = auth;
    });
  }

  PostAnswer() {
    const answer = this.settingService.getAnswerInitObject();
    answer.userid = this.Auth.User.id;
    answer.qid = this.Info.id;

    this.TriggleModal(answer);
  }

  editAnswer(answer: any, event: any) {
     this.TriggleModal(answer);
     event.stopPropagation();
  }

  TriggleModal(obj: any) {
    const _options: NgbModalOptions = {
      backdrop: false
    };
    let title = "Post Answer";
    if (obj.id > 0) {
      title = "Update Answer";
    }
    const modalRef = this.modalService.open(ViewComponent, _options);
    modalRef.componentInstance.Info = {
      title: title,
      data: obj,
      answers: this.Info.qa_answers.length,
      viewType: 0
    };
    modalRef.result.then(
      result => {
        if (result.isenabled === "Added") {
          this.Info.qa_answers.push(result.data);
        } else {
          for (const answer of this.Info.qa_answers) {
            if (answer.id === result.data.id) {
              answer.description = result.data.description;
            }
          }
        }
      },
      dismissed => {
        console.log("dismissed");
      }
    );
  }

  delete(item: any, index: number, event: any) {
    const r = confirm("Are you sure you want to delete selected answer?");
    item.answers = this.Info.qa_answers.length;
    if (r === true) {
      if (index > -1) {
        this.Info.qa_answers.splice(index, 1);
      }
    
      this.dataService.DeleteAnswer([item]).subscribe((data: any) => {
        console.log(data);
      });
    }
    event.stopPropagation();
  }
}
