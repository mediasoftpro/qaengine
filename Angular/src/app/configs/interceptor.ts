import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { Store, select } from "@ngrx/store";
import { IAppState } from "../reducers/store/model";
import { auth } from "../reducers/users/selectors";

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  /*@select(["users", "auth"])
    readonly auth$: Observable<any>;*/
  readonly auth$ = this._store.pipe(select(auth));
  User: any = {};
  Token = "";
  Authenticated = false;
  constructor(private _store: Store<IAppState>) {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
      this.Token = auth.Token;
      this.Authenticated = auth.isAuthenticated;
    });
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.Authenticated && this.Token !== "") {
      request = request.clone({
        setHeaders: {
          Authorization: `Basic ${this.Token}`,
        },
      });
    }

    return next.handle(request);
  }
}
