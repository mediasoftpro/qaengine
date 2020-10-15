/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from "@angular/router";

import { Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { IAppState } from "./reducers/store/model";
import {auth} from "./reducers/users/selectors";
import { Observable } from "rxjs/Observable";

@Injectable()
export class JMediaLazyGuard implements CanActivate {

 readonly auth$ = this._store.pipe(select(auth));

  isAuth: any;

  constructor(private _store: Store<IAppState>,
    private router: Router) {
    this.auth$.subscribe(auth => {
      this.isAuth = auth;
    });
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    if (this.isAuth.isAuthenticated) {
      return true;
    } else {
      this.router.navigate([""]);
      return false;
    }
  }
}