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

// services
import { DataService } from "../../attr/services/data.service";

// reducer actions
import { Notify } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";
//import * as configSelectors from "../../../reducers/configs/selectors";

import { fadeInAnimation } from "../../../animations/core";

/* modal popup */
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ViewComponent } from "../../attr/partials/modal.component";

@Component({
  selector: "app-dynamic-attributes",
  templateUrl: "./attributes.html",
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class DynamicAttributesComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private dataService: DataService,
    private modalService: NgbModal
  ) {}

  @Input() Attr_Type = 0; // 0: Ad, 1: Agency / Company, 2: Artist, 3: User Profile
  controls: any = [];
  showLoader = false;
  formHeading = "Manage Dynamic Attributes";
  Attributes = [];
  @Input() RecordID = 0;

  ngOnInit() {
      if (this.RecordID > 0) {
        this.LoadInfo();
      }
  }

  LoadInfo() {
    this.showLoader = true;
    this.dataService
      .LoadAttributes({ sectionid: this.RecordID, nofilter: true })
      .subscribe((data: any) => {
        this.Attributes = data.posts;
        this.showLoader = false;
      });
  }

  AddAttribute() {
    this._processTemplate(
      {
        id: 0,
        title: "",
        value: "",
        sectionid: this.RecordID,
        priority: 0,
        options: "",
        attr_type: this.Attr_Type,
        element_type: 0,
        isrequired: 0, // 0: not required, 1: reqired
        variable_type: 0, // 0: string, 1: number
        min: 0,
        max: 0,
        postfix: '',
        prefix: '',
        tooltip: '',
        url: '',
        icon: ""
      },
      2, // 0: add template, 1: add section, 2: add attribute
      "Add Attribute"
    );
  }

  EditAttribute(obj: any, event: any) {
    console.log(obj);
    this._processTemplate(
      obj,
      2, // 0: add template, 1: add section, 2: add attribute
      "Update Attribute"
    );
    event.stopPropagation();
  }

  RemoveAttribute(obj: any, index: number, event: any) {
    this.Attributes.splice(index, 1);
    this.dataService.DeleteAttribute(
      [obj]
    );
    event.stopPropagation();
  }

  _processTemplate(obj: any, viewtype: number, title: string) {
    const _options: NgbModalOptions = {
      backdrop: false
    };
    const modalRef = this.modalService.open(ViewComponent, _options);
    modalRef.componentInstance.Info = {
      title: title,
      viewtype: viewtype,
      data: obj
    };
    modalRef.result.then(
      result => {
        // template
        let options = "";
        for (let option of result.data.options) {
           if (option.value !== '') {
              if (options !== '') {
                 options += ",";
              }
              options += option.value;
           }
        }
        result.data.options = options;
        result.data.sectionid = this.RecordID;
        result.data.attr_type = this.Attr_Type;
        let isUpdate = false;
        if (result.data.id > 0) {
          isUpdate = true;
        } 
        // update database
        this.UpdateDatabase(result.data, isUpdate);
      },
      dismissed => {
        console.log("dismissed");
      }
    );
  }

  UpdateDatabase(data: any, isUpdate: boolean) {
    this.showLoader = true;
   
    this.dataService.AddAttribute(
      data
    ).subscribe(
      (data: any) => {

        if (!isUpdate) {
          this.Attributes.push(data.record);
        } else {
          // update
          for (let setting of this.Attributes) {
             if (setting.id === data.record.id) {
                 setting.title = data.record.title;
                 setting.options = data.record.options;
                 setting.value = data.record.value;
                 setting.priority = data.record.priority;
                 setting.isrequired = data.record.isrequired;
                 setting.variable_type = data.record.variable_type;
                 setting.element_type = data.record.element_type;
                 setting.helpblock = data.record.helpblock;
                 setting.icon = data.record.icon;
                 setting.min = data.record.min;
                 setting.max = data.record.max;
             }
          }
        }
        this._store.dispatch(new Notify({
          title:  "Record Saved",
          text: "",
          css: "bg-success"
        }));
        

        this.showLoader = false;

      },
      err => {
        this._store.dispatch(new Notify({
          title:  "Record not saved",
          text: "",
          css: "bg-danger"
        }));
        
      }
    );
  }
}
