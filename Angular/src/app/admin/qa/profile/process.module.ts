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
import { QAProfileComponent } from "./process.component";
import { QAProfileInfoComponent } from "./partials/info.component";

/* services */
import { SettingsService } from "../../../shared/qa/services/settings.service";
import { DataService } from "../../../shared/qa/services/data.service";
import { FormService } from "../../../shared/qa/services/form.service";

/* actions */
import { QAAPIActions } from "../../../reducers/qa/actions";
import { PartialModule } from "../../../partials/shared.module";

@NgModule({
  imports: [CommonModule, PartialModule, RouterModule, FormsModule],
  declarations: [QAProfileComponent, QAProfileInfoComponent],
  exports: [QAProfileComponent],
  providers: [SettingsService, DataService, FormService, QAAPIActions]
})
export class QAProfileModule {}
