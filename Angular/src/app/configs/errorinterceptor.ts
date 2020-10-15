import { Store } from "@ngrx/store";
import { IAppState } from "../reducers/store/model";
import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { Notify } from "../reducers/core/actions";
// import { CoreAPIActions } from "../reducers/core/actions";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private _store: Store<IAppState>) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        if (err.status === 401) {
          location.reload(true);
        }
        if (err.status === 500) {
          this._store.dispatch(
            new Notify({
              title:
                err.status + " | Error Occured While Processsing Your Request",
              text: "",
            })
          );
        }
        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
