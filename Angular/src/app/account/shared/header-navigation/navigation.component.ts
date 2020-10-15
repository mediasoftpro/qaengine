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

import { interval } from "rxjs";
// reducer actions
import { UserService } from "../../../admin/users/services/auth.service";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";

import * as configSelectors from "../../../reducers/configs/selectors";
import {auth} from "../../../reducers/users/selectors";
import { Notify } from "../../../reducers/core/actions";

@Component({
  selector: "app-account-header",
  templateUrl: "./navigation.component.html",
  providers: [UserService],
})
export class AccountNavigationComponent {
  LanguageList: any;
  DefaultLanguage = "en";
  DefaultLanguageComponent: any;
  showNotificationList = false;
  Notifications = 0;
  Messages: any = [];
  User: any = {};
  NotificationPageNumber = 1;
  NotificationList: any = [];
  
  constructor(
    private _store: Store<IAppState>,
    private translate: TranslateService,
    private coreService: CoreService,
    public config: AppConfig,
    private cookieService: CookieService,
    private userService: UserService,
    private router: Router
  ) {
    this.LanguageList = AppState.SUPPORTED_LANGS_EXTENDED;
    this.initialize();
  }

  readonly configs$ = this._store.pipe(select(configSelectors.configs));
  readonly auth$ = this._store.pipe(select(auth));

  initialize() {
    this.auth$.subscribe((auth: any) => {
      this.User = auth.User;
      interval(20000).subscribe((x) => {
        this.checkNotification();
      });
    });
    this.DefaultLanguage = AppState.DEFAULT_LANG;
    for (const lang of this.LanguageList) {
      if (lang.culture === this.DefaultLanguage) {
        this.DefaultLanguageComponent = lang;
      }
    }
  }

  toggleLanguage(lang: any, event) {
    AppState.DEFAULT_LANG = lang.culture;
    this.cookieService.set("_LANG", lang.culture);
    console.log(AppState.DEFAULT_LANG);
    this.translate.setDefaultLang(lang.culture);
    this.initialize();
    event.stopPropagation();
  }

  signout(event: any) {
    this.userService.SignOut();
    this.router.navigate([""]);
    event.stopPropagation();
  }

  /* Notification Logic */
  checkNotification() {
    this.userService.Check_New_Notifications(this.User.id).subscribe(
      (data: any) => {
        this.Notifications = data.notifs;
        this.Messages = data.message_notifs;
      },
      (err) => {
         this._store.dispatch(new Notify({
            title:  "Error ocured",
            text: "",
            css: "bg-danger"
          }));
      }
    );
  }

  fetchNotifications() {
    this.userService
      .Fetch_Unread_Notifications(this.User.id, this.NotificationPageNumber)
      .subscribe(
        (data: any) => {
          if (this.NotificationPageNumber > 1) {
            for (let post of data.posts) {
              this.NotificationList.push(post);
            }
          } else {
            if (data.posts.length === 0 && this.NotificationList.length > 0) {
              // may be marked as read the notifications (still show old notifications)
            } else {
              this.NotificationList = data.posts;
            }
          }
          console.log(this.NotificationList);
        },
        (err) => {
           this._store.dispatch(new Notify({
            title:  "Error ocured",
            text: "",
            css: "bg-danger"
          }));
        }
      );
  }

  toggleNotification(event: any) {
    if (this.showNotificationList) {
      this.showNotificationList = false;
    } else {
      this.showNotificationList = true;
      this.fetchNotifications();
    }
    
    event.stopPropagation();
  }

  readNotif(notif: any, event: any) {
    this.mark_as_read(notif);
    if (notif.href !== '') {
      window.location.href = notif.href;
    }
    event.stopPropagation();
  }

  mark_as_read(notif: any) {
    this.userService.Mark_as_Read(notif).subscribe(
      (data: any) => {
      },
      (err) => {
         this._store.dispatch(new Notify({
            title:  "Error ocured",
            text: "",
            css: "bg-danger"
          }));
      }
    );
  }
}
