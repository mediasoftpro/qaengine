/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
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
//import { CoreAPIActions } from "../../../../reducers/core/actions";

// reducer actions
import * as categoriesSelectors from "../../../../reducers/settings/categories/selectors";
import * as configSelectors from "../../../../reducers/configs/selectors";
import { reloadList} from "../../../../reducers/settings/categories/actions";
import { Notify } from "../../../../reducers/core/actions";
import {auth} from "../../../../reducers/users/selectors";

//import { CategoriesAPIActions } from "../../../../reducers/settings/categories/actions";
import { fadeInAnimation } from "../../../../animations/core";

import { PermissionService } from "../../../../admin/users/services/permission.service";
@Component({
  templateUrl: "./process.html",
  encapsulation: ViewEncapsulation.None,
  animations: [fadeInAnimation],
  host: { "[@fadeInAnimation]": "" }
})
export class ProcCategoriesComponent implements OnInit {
  constructor(
    private _store: Store<IAppState>,
    private settingService: SettingsService,
    private dataService: DataService,
    private coreService: CoreService,
    private route: ActivatedRoute,
    private formService: FormService,
    private permission: PermissionService,
    private router: Router
  ) {}

  CategoryID = 0;
  CategoryType = 0; // default type = 0
  CategoryList = [];
  SearchOptions: any;
  controls: any = [];
  showLoader = false;
  formHeading = "Add Category";
  submitText = "Add Category";
  ParentAdd = false;
  ParentID = 0;
  IsLoaded = false;

  readonly dropdownCategories$ = this._store.pipe(select(categoriesSelectors.dropdown_categories));
  readonly isloaded$ = this._store.pipe(select(categoriesSelectors.isloaded));
  readonly pagination$ = this._store.pipe(select(categoriesSelectors.pagination));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  readonly auth$ = this._store.pipe(select(auth));
  
  // permission logic
  isAccessGranted = false; // Granc access on resource that can be full access or read only access with no action rights
  isActionGranded = false; // Grand action on resources like add / edit /delete

  Configs: any;
  ngOnInit() {
    this.isloaded$.subscribe((loaded: boolean) => {
      this.IsLoaded = loaded;
      console.log("isload called");
      if (!this.IsLoaded) {
        this.router.navigate(["/settings/categories/"]);
      }
    });
    this.configs$.subscribe((configs: any) => {
      this.Configs = configs;
    });
    // user authentication & access right management
    // full resource access key and readonly key can be generated via roles management
    this.auth$.subscribe((auth: any) => {
      const FullAccessID = "1539515099045";
      const ReadOnlyAccessID = "1539515144335";
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
    // fetch param from url
    this.route.params.subscribe(params => {
      this.ParentID = Number.parseInt(params["parentid"], 10);
      if (isNaN(this.ParentID)) {
        this.ParentID = 0;
      }
      this.CategoryID = Number.parseInt(params["id"], 10);
      if (isNaN(this.CategoryID)) {
        this.CategoryID = 0;
      }
      if (this.CategoryID > 0) {
        this.formHeading = "Update Category";
        this.submitText = "Update";
        this.LoadInfo(this.CategoryID, false);
      } else if (this.ParentID > 0) {
        this.LoadInfo(this.ParentID, true);
      } else {
        // initialize controls with default values
        this.initializeControls(this.settingService.getInitObject());
        // load parent categories
        this.LoadDropdownCategories(this.CategoryType);
      }
    });

    // setup navigation list
    this.SearchOptions = this.settingService.getSearchOptions();
    this.SearchOptions.showSearchPanel = false;
    // this.SearchOptions.actions = [];

    this.dropdownCategories$.subscribe(categories => {
      this.CategoryList = categories;
      if (this.CategoryList.length > 0) {
        this.LoadDropdownCategories(this.CategoryType);
      } else {
        this.dataService.LoadDropdownCategories(this.CategoryType);
      }
    });
  }

  LoadDropdownCategories(type: any) {
    const dropdown_categories = [];
    for (const category of this.CategoryList) {
      console.log(category.type);
      if (category.type == type) {
        dropdown_categories.push({
          value: category.title,
          key: category.id.toString()
        });
      }
    }
    dropdown_categories.unshift({
      value: "No Parent",
      key: "0"
    });
    this.PoupulateParentCategories(dropdown_categories);
  }

  // dropdown selection event received here along with key reference: {key, value}
  OnDropdownSelection(payload: any) {
    // console.log(payload);
    if (payload.key === "type") {
      this.LoadDropdownCategories(payload.value);
    }
  }

  PoupulateParentCategories(categories: any) {
    for (const control of this.controls) {
      if (control.key === "parentid") {
        control.options = categories;
        if (this.ParentID > 0) {
          control.value = this.ParentID.toString();
        }
      }
    }
  }
  // event triggerred when uploaded file removed from list with possible values {key, file},
  // you can remove file from server
  FileRemoved(payload: any) {
    console.log(payload);
  }

  LoadInfo(id: number, isParent: boolean) {
    this.showLoader = true;
    this.dataService.GetInfo(id).subscribe((data: any) => {
      if (data.status === "success") {
        if (isParent) {
          // add category but within parent
          const entity = this.settingService.getInitObject();
          entity.type = data.post.type;
          entity.parentid = data.post.parentid;
          entity.priority = data.post.priority + 1;
          entity.isenabled = data.post.isenabled;
          this.initializeControls(entity);
          this.LoadDropdownCategories(entity.type);
        } else {
          // update category
          this.initializeControls(data.post);
          this.ParentID = data.post.parentid;
          this.LoadDropdownCategories(data.post.type);
        }
        this.showLoader = false;
      } else {
         this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-danger"
          }));
        this.initializeControls(this.settingService.getInitObject());
      }
    });
  }

  initializeControls(data: any) {
    this.controls = this.formService.getControls(
      data,
      this.Configs.general.media,
      this.Configs.general.category
    );
  }
  SubmitForm(payload) {
    if (payload.priority === null) {
      payload.priority = 0;
    }
    if (!this.isActionGranded) {
      this._store.dispatch(new Notify({
            title:  "Permission Denied",
            text: "",
            css: "bg-danger"
          }));
      return;
    }

    /*if (payload.file.length > 0) {
                payload.picturename = payload.file[0].filename;
            }
            console.log('picturename is ' + payload.picturename);
       */
    this.showLoader = true;
    let _status = "Added";
    if (this.CategoryID > 0) {
      payload.id = this.CategoryID;
      _status = "Updated";
    }
    this.dataService.AddRecord(payload).subscribe(
      (data: any) => {
        if (data.status === "error") {
          this._store.dispatch(new Notify({
            title: data.message,
            text: "",
            css: "bg-success"
          }));
        } else {
           this._store.dispatch(new Notify({
            title: "Record " + _status + " Successfully",
            text: "",
            css: "bg-success"
          }));

          // enable reload action to refresh data
          this._store.dispatch(new reloadList({}));
                   
          // redirect
          this.router.navigate(["/settings/categories/"]);
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
}
