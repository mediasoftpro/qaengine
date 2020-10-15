/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PartialModule } from "../../partials/shared.module";

import { ListComponent } from "./components/partials/list.component";
import { BlogsV2Component } from "./components/main/main.component";
import { BlogProcComponent } from "./components/process/process.component";
import { SMBlogsListComponent } from "./components/partials/smlist.component";
import { SMBlogsAdminListComponent } from "./components/partials/smlist_admin.component";
import { SMBlogReportComponent } from "./components/partials/sm_report.component";
// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";
import { FormService } from "./services/form.service";

/* actions */
import { Ng2GoogleChartsModule } from "ng2-google-charts";
@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2GoogleChartsModule
  ],
  declarations: [
    ListComponent,
    BlogsV2Component,
    BlogProcComponent,
    SMBlogsListComponent,
    SMBlogsAdminListComponent,
    SMBlogReportComponent
  ],
  exports: [
    ListComponent,
    BlogsV2Component,
    BlogProcComponent,
    SMBlogsListComponent,
    SMBlogsAdminListComponent,
    SMBlogReportComponent
  ],
  providers: [SettingsService, DataService, FormService]
})
export class SharedBlogModule {}
