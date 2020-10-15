/* -------------------------------------------------------------------------- */
/*                          Product Name: VideoEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit } from "@angular/core";
import { AppNavigation } from "../../../configs/settings";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";

import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";
import { ConfigDataService } from "../../../configs/services/data.service";
import { TranslateService } from "@ngx-translate/core";
import { AppConfig } from "../../../configs/app.config";
import { auth } from "../../../reducers/users/selectors";
@Component({
  selector: "app-account-leftnavigation-v2",
  templateUrl: "./left-navigation.html",
  providers: [ConfigDataService],
})
export class AccountLeftNavigationV2Component implements OnInit {
  MyAccount_Menu: any = AppNavigation.MYACCOUNT_SETTINGS;
  leftMenuIndex = 0;
  topMenuIndex = 0;
  constructor(
    private _store: Store<IAppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private route: ActivatedRoute,
    public config: AppConfig
  ) {}

  readonly auth$ = this._store.pipe(select(auth));

  User: any = {};
  isAgencyAttached = false;

  ngOnInit(): void {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
      console.log(this.User);
      if (this.User.agency !== undefined) {
        this.isAgencyAttached = true;
      }
    });

    this.router.events
      .filter((event) => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map((route) => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter((route) => route.outlet === "primary")
      .mergeMap((route) => route.data)
      .subscribe((event) => {
        if (event["leftmenuIndex"] !== undefined) {
          this.leftMenuIndex = event["leftmenuIndex"];
        }
        if (event["topmenuIndex"] !== undefined) {
          this.topMenuIndex = event["topmenuIndex"];
        }
        this.initMenus();
      });
  }

  initMenus() {
    this.MyAccount_Menu = AppNavigation.MYACCOUNT_SETTINGS;
  }
}
