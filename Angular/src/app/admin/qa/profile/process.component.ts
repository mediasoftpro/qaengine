/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";

// services
import { SettingsService } from "../../../shared/qa/services/settings.service";
import { DataService } from "../../../shared/qa/services/data.service";

// reducer actions
import { Notify } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";
import { fadeInAnimation } from "../../../animations/core";

/* modal popup */
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";

// modal popup
import { ViewComponent } from "../../../shared/qa/components/partials/modal.component";
import { CoreService } from "../../../admin/core/coreService";

import { PermissionService } from "../../../admin/users/services/permission.service";
@Component({
  templateUrl: "./process.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class QAProfileComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private permission: PermissionService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ToolbarOptions: any;
  ToolbarLogOptions: any;
  isItemsSelected = true;
  RecordID = 0;
  FilterOptions: any = {};
  controls: any = [];
  showLoader = false;
  formHeading = "QA Information";
  submitText = "Submit";
  Info: any = {};
  uploadedFiles = [];
  SelectedItems: any = [];
  Author_FullName = "";

  readonly auth$ = this._store.pipe(select(auth));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete
  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1521395965196";
      const ReadOnlyAccessID = "1521396022188";
      if (
        this.permission.GrandResourceAccess(
          false,
          FullAccessID,
          ReadOnlyAccessID,
          auth.Role
        )
      ) {
        this.isAccessGranted = true;
        if (this.permission.GrandResourceAction(FullAccessID, auth.Role)) {
          this.isActionGranded = true;
        }
      }
    });
    
    this.ToolbarOptions = this.settingService.getToolbarOptions(0, true);
    this.ToolbarOptions.showtoolbar = false;
    this.ToolbarOptions.showcheckAll = false;
    this.ToolbarOptions.showsecondarytoolbar = true;
    this.ToolbarOptions.ProfileView = true;

    // fetch param from url
    this.route.params.subscribe(params => {
      this.RecordID = this.coreService.decrypt(params["id"]);
      if (isNaN(this.RecordID)) {
        this.RecordID = 0;
      }
      if (this.RecordID > 0) {
        this.LoadInfo();
      }
    });
  }

  LoadInfo() {
    this.showLoader = true;
    this.dataService.GetInfo(this.RecordID).subscribe((data: any) => {
      if (data.status === "error") {
       this._store.dispatch(new Notify({
            title:  data.message,
            text: "",
            css: "bg-success"
          }));
        // redirect to main page
        this.router.navigate(["/qa"]);
      } else {
        this.Info = data.post;

        // tag processing
        if (this.Info.tags !== null && this.Info.tags !== "") {
          this.Info.tags_arr = this.ProcessCategories(
            this.Info.tags.split(",")
          );
        } else {
          this.Info.tags_arr = [];
        }
        // for actions like enable / disable / delete
        this.SelectedItems = []; // reset
        this.SelectedItems.push(this.Info);
      }
      this.showLoader = false;
    });
  }
  ProcessCategories(categories) {
    const arr = [];
    for (const category of categories) {
      arr.push({
        title: category.trim(),
        slug: category
          .trim()
          .replace(/\s+/g, "-")
          .toLowerCase()
      });
    }

    return arr;
  }
  toolbaraction(selection: any) {
    switch (selection.action) {
      case "m_markas":
        this.ProcessActions(selection.value);
        break;
      case "add":
        this.Trigger_Modal({
          title: "Ask Question",
          isActionGranded: this.isActionGranded,
          data: this.settingService.getInitObject(),
          viewType: 1
        });
        return;
      case "edit":
        this.Trigger_Modal({
          title: "Edit Question",
          isActionGranded: this.isActionGranded,
          data: this.Info,
          viewType: 2
        });
        return;
    }
  }

  /* Add Record */
  Trigger_Modal(InstanceInfo: any) {
    const _options: NgbModalOptions = {
      backdrop: false
    };
    const modalRef = this.modalService.open(ViewComponent, _options);
    modalRef.componentInstance.Info = InstanceInfo;
    modalRef.result.then(
      result => {
        // this.closeResult = `Closed with: ${result}`;
      },
      dismissed => {
        console.log("dismissed");
      }
    );
  }

  ProcessActions(selection: any) {
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
        title: "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
     
      return;
    }
    if (this.SelectedItems.length > 0) {
      for (const item of this.SelectedItems) {
        item.actionstatus = selection.actionstatus;
      }
      this.dataService.ProcessActions(this.SelectedItems, selection, 0);
    }
  }
}
