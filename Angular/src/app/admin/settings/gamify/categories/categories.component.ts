/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../../reducers/store/model";

// services
import { SettingsService } from "../services/settings.service";
import { DataService } from "../services/data.service";
import { FormService } from "../services/form.service";

// shared services
import { CoreService } from "../../../core/coreService";

// reducer actions
import * as selectors from "../../../../reducers/settings/gamify/selectors";
import {
  filter_categories
} from "../../../../reducers/settings/gamify/actions";
import { Notify } from "../../../../reducers/core/actions";
import { auth } from "../../../../reducers/users/selectors";

import { fadeInAnimation } from "../../../../animations/core";
import { ContentTypes } from "../../../../configs/settings";
//import { ContentType } from '@angular/http/src/enums';

/* modal popup */
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { ViewComponent } from "../partials/modal.component";

import { PermissionService } from "../../../../admin/users/services/permission.service";

@Component({
  templateUrl: "./categories.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class GamifyCategoriesComponent implements OnInit {
  constructor(
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private _store: Store<IAppState>,
    private route: ActivatedRoute,
    private formService: FormService,
    private permission: PermissionService,
    private router: Router,
    private modalService: NgbModal
  ) {}

  SearchOptions: any;
  controls: any = [];
  showLoader = false;
  formHeading = "Manage Categories";
  CategoryTypes = ContentTypes.BADGES_TYPES;
  CategoryList = [];
  CategoryType = 1;
  FilterOptions: any;
  IsLoaded = false; // check data is loaded for first time

  readonly filteroptions$ = this._store.pipe(
    select(selectors.filteroptions)
  );
  readonly categories$ = this._store.pipe(select(selectors.filter_categories));
  readonly isloaded$ = this._store.pipe(select(selectors.isloaded));
  readonly auth$ = this._store.pipe(select(auth));

  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete
  ngOnInit() {
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1539515772897";
      const ReadOnlyAccessID = "1539515353167";
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
    // setup navigation list
    this.SearchOptions = this.settingService.getSearchOptions();
    this.SearchOptions.showSearchPanel = false;
    this.SearchOptions.actions = [];

    this.categories$.subscribe((categories: any) => {
      this.CategoryList = categories;
      /* if (this.CategoryList.length === 0) {
                this.LoadRecords();
            } */
    });

    // fetch param from url
    this.route.params.subscribe(params => {
      this.CategoryType = Number.parseInt(params["type"], 10);
      if (isNaN(this.CategoryType)) {
        this.CategoryType = 0;
      } else {
        this.LoadCategories();
      }
    });
    this.filteroptions$.subscribe(options => {
     this.FilterOptions = Object.assign({}, options);
    });

    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      if (!this.IsLoaded) {
        this.loadRecords(this.FilterOptions);
      }
    });
    this.LoadCategories();
  }

  loadRecords(options) {
    this.dataService.LoadRecords(options);
  }

  LoadCategories() {
    this._store.dispatch(new filter_categories(this.CategoryType));
  }

  filterCategories(obj, event) {
    this.CategoryType = obj.value;
    this.LoadCategories();
    event.stopPropagation();
  }

  toggleEditView(obj, event) {
    this._addCategory(obj);
    event.stopPropagation();
  }

  addCategory() {
    const entity = this.settingService.getInitCategoryObject();
    entity.type = this.CategoryType;
    this._addCategory(entity);
  }

  _addCategory(entity: any) {
    const _options: NgbModalOptions = {
      backdrop: false
    };
    const modalRef = this.modalService.open(ViewComponent, _options);
    modalRef.componentInstance.Info = {
      title: "Add Category",
      isActionGranded: this.isActionGranded,
      viewtype: 1, // 1: for manage categories, 0: for view code
      data: entity
    };
    modalRef.result.then(
      result => {
        result.data.type = this.CategoryType;
        this.dataService.AddCategory(result.data);
      },
      dismissed => {
        console.log("dismissed");
      }
    );
  }

  delete(item: any, index: number, event) {
    if (!this.isActionGranded) {
    this._store.dispatch(new Notify({
        title:  "Permission Denied",
        text: "",
        css: "bg-danger"
      }));
      return;
    }
    const r = confirm("Are you sure you want to delete selected record?");
    if (r === true) {
      this.dataService.DeleteCategory(item, index);
    }
  }
}
