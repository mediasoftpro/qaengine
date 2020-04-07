/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
/* custom component */
import { QAReportsComponent } from "./reports.components";

/* services */
import { SettingsService } from "../../../shared/qa/services/settings.service";
import { DataService } from "../../../shared/qa/services/data.service";
import { FormService } from "../../../shared/qa/services/form.service";

/* actions */
import { QAAPIActions } from "../../../reducers/qa/actions";
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
  declarations: [QAReportsComponent],
  exports: [QAReportsComponent],
  providers: [SettingsService, DataService, FormService, QAAPIActions]
})
export class QAReportModule {}
