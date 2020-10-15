/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import { Store, select } from "@ngrx/store";
import { IAppState } from "../../../reducers/store/model";
import { Injectable } from "@angular/core";
//import { UserAPIActions } from "../../../reducers/users/actions";
import { CookieService } from "ngx-cookie-service";
import { HttpClient } from "@angular/common/http";
import { SettingsService } from "./settings.service";
//import { CoreAPIActions } from "../../../reducers/core/actions";
import { AppConfig } from "../../../configs/app.config";
import { SignOut, Authenticate} from "../../../reducers/users/actions";
import { updateFilter as qaUpdateFilter } from "../../../reducers/qa/actions";
import { updateFilter as blogsUpdateFilter } from "../../../reducers/blogs/actions";
import { refreshListStats } from "../../../reducers/core/actions";
import { Notify, ErrorNotify, toggleLoader } from "../../../reducers/core/actions";
// Actions
// import { AdListingAPIActions } from "../../../reducers/adlistings/actions";

@Injectable()
export class UserService {
  constructor(
    private _store: Store<IAppState>,
    public config: AppConfig,
    private settings: SettingsService,
    private http: HttpClient,
    private cookieService: CookieService
  ) {}

  SignOut() {
    this.cookieService.delete("_AUTH");
    this._store.dispatch(new SignOut({}));
  }
  CheckAuthentication() {
    const _auth = this.cookieService.get("_AUTH");
    if (_auth !== undefined && _auth !== "") {
      // authenticated (authenticate until user full data receiving)
      this._store.dispatch(new Authenticate({
        isAuthenticated: true,
        User: JSON.parse(_auth)
      }));
      this._store.dispatch(new Notify({
        title: "Logged in successfully",
        text: "",
        css: "bg-success"
      }));
    }
  }

  AuthorizeUser(userid: string) {
    this.GetInfo(userid).subscribe((data: any) => {
      if (data.status === "error") {
        this._store.dispatch(new ErrorNotify({
          title: data.message,
        }));
        this._store.dispatch(new toggleLoader(false));
      } else {
        if (this.config.getGlobalVar("apptype") == "account") {
          // my account
         
          const obj = {
            isAuthenticated: true,
            User: data.post,
            Token: data.token,
            Role: []
          };
          this._store.dispatch(new Authenticate(obj));

          // apply user filter
          this._store.dispatch(new qaUpdateFilter(obj.User));
          this._store.dispatch(new blogsUpdateFilter(obj.User));
        } else {
          // admin account
          this._store.dispatch(new Authenticate({
            isAuthenticated: true,
            User: data.post,
            Token: data.token,
            Role: this.ExtractAccessIDs(data.role)
          }));
        }
        // disable global loader
        this._store.dispatch(new toggleLoader(false));
      }
    });
  }

  GetInfo(userid: string) {
    let URL = this.settings.getApiOptions().getinfo_auth;
    let isadmin = false;
    if (this.config.getGlobalVar("apptype") == "admin") {
       isadmin = true;
    }
    // 0: normal user, 2: agency
    let usertype = this.config.getGlobalVar("usertype");
    return this.http.post(URL, JSON.stringify({ id: userid, isadmin: isadmin, type: usertype }));
  }

  /* extract and return only array of accessids */
  ExtractAccessIDs(Role: any) {
    if (Role.length === 0) {
      return [];
    }
    if (Role[0].permissions.length === 0) {
      return [];
    }
    const AccessIds: any = [];
    const perms = Role[0].permissions;
    for (const item of perms) {
      AccessIds.push(item.robject.uniqueid);
    }
    return AccessIds;
  }

  Check_New_Notifications(userid: string) {
    let URL = this.settings.getApiOptions().count_notifs;
    
    return this.http.post(URL, JSON.stringify({ RecipentID: userid, isRead: false }));
  }

  Fetch_Unread_Notifications(userid: any, pagenumber: number = 1) {
    let URL = this.settings.getApiOptions().fetch_notifs;
    return this.http.post(URL, JSON.stringify({ RecipentID: userid, isRead: false, pagesize: 5, pagenumber: 1, order: 'notification.created_time desc' }));
  }

  Mark_as_Read(obj: any) {
    let URL = this.settings.getApiOptions().mark_as_read;
    return this.http.post(URL, JSON.stringify(obj));
  }
}
