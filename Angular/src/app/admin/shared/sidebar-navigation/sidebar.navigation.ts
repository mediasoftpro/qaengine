/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component } from "@angular/core";
import { AppState } from "../../../configs/themeSettings";
import { TranslateService } from "@ngx-translate/core";
import { CookieService } from "ngx-cookie-service";
import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
// reducer actions
import { UserService } from "../../users/services/auth.service";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../core/coreService";

//import { Notify } from "../../../reducers/core/actions";
import { auth } from "../../../reducers/users/selectors";
import * as configSelectors from "../../../reducers/configs/selectors";

@Component({
  selector: "app-admin-sidebar",
  templateUrl: "./sidebar.navigation.html",
  providers: [UserService],
})
export class SideBarNavigationComponent {

  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;*/

  readonly auth$ = this._store.pipe(select(auth));

  constructor(
    private _store: Store<IAppState>,
    private translate: TranslateService,
    private coreService: CoreService,
    public config: AppConfig,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {}

  signout(event: any) {
    this.userService.SignOut();
    this.router.navigate([""]);
    event.stopPropagation();
  }
}
