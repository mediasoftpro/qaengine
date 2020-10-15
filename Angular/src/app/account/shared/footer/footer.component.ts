/* -------------------------------------------------------------------------- */
/*                         Product Name: ForumEngine                          */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";

import { ConfigDataService } from "../../../configs/services/data.service";

import { Store } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";


@Component({
  selector: "app-account-footer",
  templateUrl: "./footer.html",
  providers: [ConfigDataService]
})
export class AccountFooterComponent implements OnInit {
  MyAccount_Menu: any = [];
  year = new Date().getFullYear();
  constructor(
    private _store: Store<IAppState>,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    
  }

}



