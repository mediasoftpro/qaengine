/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "./reducers/store/model";

import { NotifyService } from "./partials/components/pnotify/pnotify.service";
import { AppState } from "./configs/themeSettings";
import { CookieService } from "ngx-cookie-service";

// Config Service
import { ConfigDataService } from "./configs/services/data.service";
import { ConfigSettingsService } from "./configs/services/settings.service";

// Auth Service
import { UserService } from "./admin/users/services/auth.service";
//import { CoreAPIActions } from "./reducers/core/actions";

// selectors
import * as coreSelectors from "./reducers/core/selectors";
import {auth} from "./reducers/users/selectors";
import * as configSelectors from "./reducers/configs/selectors";
// actions
import { toggleLoader } from "./reducers/core/actions";
import { AppConfig } from "./configs/app.config";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  providers: [UserService, ConfigDataService, ConfigSettingsService]
})
export class AppComponent implements OnInit {
  loadApp = true;
  message = "";
  year = new Date().getFullYear();

  constructor(
    private _store: Store<IAppState>,
    private translate: TranslateService,
    private pnotify: NotifyService,
    private cookieService: CookieService,
    private userService: UserService,
    public config: AppConfig,
    private configdata: ConfigDataService
  ) {
    const _value = this.cookieService.get("_LANG");
    if (_value === undefined || _value === "") {
      this.cookieService.set("_LANG", AppState.DEFAULT_LANG);
    } else {
      AppState.DEFAULT_LANG = _value;
    }
    // console.log("selected language " + AppState.DEFAULT_LANG);
    translate.addLangs(AppState.SUPPORTED_LANGS);
    translate.setDefaultLang(AppState.DEFAULT_LANG);
    translate.use(AppState.DEFAULT_LANG);
  }

  readonly notify$ = this._store.pipe(select(coreSelectors.notify));
  
  readonly loader$ = this._store.pipe(select(coreSelectors.loader));
  readonly auth_failed$ = this._store.pipe(select(coreSelectors.auth_failed));
  readonly auth$ = this._store.pipe(select(auth));
  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  readonly settingLoading$ = this._store.pipe(select(configSelectors.loading));

  /*@select(["core", "notify"])
  readonly notify$: Observable<any>;

  @select(["core", "loader"])
  readonly loader$: Observable<any>;

  @select(["core", "error_message"])
  readonly error_message$: Observable<any>;
  
  @select(["core", "auth_failed"])
  readonly auth_failed$: Observable<any>;
  
 readonly auth$ = this._store.pipe(select(auth));

  @select(["configuration", "configs"])
  readonly configs$: Observable<any>;

  @select(["configuration", "loading"])
  readonly settingLoading$: Observable<any>;*/

  ngOnInit() {

    this.notify$.subscribe(notify =>
      setTimeout(() => {
         if (notify.title !== "") {
          this.pnotify.render(notify.title, notify.text, notify.css);
        }
      }, 0)
    );

    if (this.config.getGlobalVar("userid") === "") {
      this.message = "Error occured while loading application.";
    }

    const APIURL = this.config.getConfig("host");
    if (APIURL === "[HOST]") {
      this.loadApp = false;
    } else {
      if (
        this.config.getGlobalVar("apptype") === "admin" ||
        this.config.getGlobalVar("apptype") === "account"
      ) {
        // enable global loader
        this._store.dispatch(new toggleLoader(true));
        // this.coreAction.toggleLoader(true);
        // load application settings
        this.configdata.LoadRecords({}, this.config.getGlobalVar("apptype"));
        // load & authorize user info
        this.userService.AuthorizeUser(this.config.getGlobalVar("userid"));
      }
    }
  }
}
