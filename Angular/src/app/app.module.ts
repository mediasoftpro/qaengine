/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS  } from "@angular/common/http";
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { ToastrModule } from "ngx-toastr";

import { JMediaLazyGuard } from "./j-media-guard.guard";
import { AppConfig } from "./configs/app.config";

/* bootstrap module */
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { appRoutes } from "./routes";
import { AppComponent } from "./app.component";

// Module Component
import { PartialModule } from "./partials/shared.module";

/* NGRX */
import { AppStoreModule } from "./reducers/store/module";

// Account Shared Layout Components
import { AccountNavigationComponent } from "./account/shared/header-navigation/navigation.component";
import { AccountLeftNavigationV2Component } from "./account/shared/left-navigation-v2/left-navigation";
import { AccountTopNavigationComponent } from "./account/shared/topnav-navigation/topnav-component";
import { AccountBreadcrumbComponent } from "./account/shared/breadcrumb/breadcrumb.component";
import { AccountFooterComponent } from "./account/shared/footer/footer.component";

// Admin Shared Layout Components
import { NavigationComponent } from "./admin/shared/header-navigation/navigation.component";
import { BreadcrumbComponent } from "./admin/shared/breadcrumb/breadcrumb.component";
import { SideBarNavigationComponent} from "./admin/shared/sidebar-navigation/sidebar.navigation";
import { CookieService } from "ngx-cookie-service";

// authentication
import { UserService } from "./admin/users/services/auth.service";
import { SettingsService } from "./admin/users/services/settings.service";
//import { UserAPIActions } from "./reducers/users/actions";
import { PermissionService } from "./admin/users/services/permission.service";

// configuration
// import { ConfigAPIActions } from "./reducers/configs/actions";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";
import { EditorModule } from "@tinymce/tinymce-angular";

// actions
//import { AdListingAPIActions } from "./reducers/adlistings/actions";


// multi select component
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";

// auto complete
import {AutocompleteLibModule} from 'angular-ng-autocomplete';

// intercepter
import { BasicAuthInterceptor } from './configs/interceptor';
import { ErrorInterceptor } from './configs/errorinterceptor';
// /app/angular/assets/i18n/ for application integration, ./assets/i18n/ for development
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    BreadcrumbComponent,
    AccountTopNavigationComponent,
    AccountBreadcrumbComponent,
    AccountLeftNavigationV2Component,
    AccountNavigationComponent,
    SideBarNavigationComponent,
    AccountFooterComponent
  ],
  imports: [
    AppStoreModule,
    RouterModule.forRoot(appRoutes),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NgMultiSelectDropDownModule.forRoot(),
    ToastrModule.forRoot(),
    AutocompleteLibModule,
    NgbModule,
    BrowserModule,
    EditorModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    PartialModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: BasicAuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    CookieService,
    JMediaLazyGuard,
    UserService,
    SettingsService,
    AppConfig,
    PermissionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
