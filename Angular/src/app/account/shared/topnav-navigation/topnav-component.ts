/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd, ActivatedRoute } from "@angular/router";
import "rxjs/add/operator/filter";
import "rxjs/add/operator/map";
import "rxjs/add/operator/mergeMap";

import { ConfigDataService } from "../../../configs/services/data.service";
import { TranslateService } from "@ngx-translate/core";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import * as configSelectors from "../../../reducers/configs/selectors";
import { auth } from "../../../reducers/users/selectors";


@Component({
  selector: "app-account-topnavigation",
  templateUrl: "./topnav-component.html",
  providers: [ConfigDataService]
})
export class AccountTopNavigationComponent implements OnInit {
  MyAccount_Menu: any = [];

  constructor(
    private _store: Store<IAppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private configdata: ConfigDataService,
    public translate: TranslateService
  ) {}

  topMenuIndex = 0;

  /*@select(["configuration", "configs"])
  readonly configs$: Observable<any>;*/
  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  Configs: any = {};

  ngOnInit(): void {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .map(() => this.activatedRoute)
      .map(route => {
        while (route.firstChild) {
          route = route.firstChild;
        }
        return route;
      })
      .filter(route => route.outlet === "primary")
      .mergeMap(route => route.data)
      .subscribe(event => {
        if (event["topmenuIndex"] !== undefined) {
          this.topMenuIndex = event["topmenuIndex"];
        }
      });

    this.configs$.subscribe((configs: any) => {
      this.Configs = configs;
      this.prepareNavList();
    });
  }

  prepareNavList() {
    if (this.Configs.general) {
      const conf = this.Configs.general.features;
     
      if (conf.enable_classified) {
        this.MyAccount_Menu.push({
          id: 7,
          title: "Listings",
          value: "/listings",
          index: 1
        });
      }

      this.MyAccount_Menu.push({
        id: 9,
        title: "Settings",
        value: "/",
        index: 0
      });

    }
  }
}

