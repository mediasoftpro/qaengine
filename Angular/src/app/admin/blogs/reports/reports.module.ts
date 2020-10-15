/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
/* custom component */
import { BlogReportsComponent } from "./reports.components";

/* services */
import { SettingsService } from "../../../shared/blogs/services/settings.service";
import { DataService } from "../../../shared/blogs/services/data.service";
import { FormService } from "../../../shared/blogs/services/form.service";

/* actions */
// import { BlogAPIActions } from "../../../reducers/blogs/actions";
import { PartialModule } from "../../../partials/shared.module";

import { Ng2GoogleChartsModule } from "ng2-google-charts";

@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    Ng2GoogleChartsModule
  ],
  declarations: [BlogReportsComponent],
  exports: [BlogReportsComponent],
  providers: [SettingsService, DataService, FormService]
})
export class BlogReportModule {}
