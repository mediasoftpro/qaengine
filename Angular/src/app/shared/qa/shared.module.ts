/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// shared modules
import { PartialModule } from "../../partials/shared.module";

// components
import { ListComponent } from "./components/partials/list.component";
import { MainQAComponent } from "./components/main/main.component";
import { QAProcComponent } from "./components/process/process.component";
import { SMQAListComponent } from "./components/partials/smlist.component";
import { ViewComponent } from "./components/partials/modal.component";
// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";
import { FormService } from "./services/form.service";

/* actions */
import { QAAPIActions } from "../../reducers/qa/actions";

@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [ListComponent, QAProcComponent, MainQAComponent, SMQAListComponent, ViewComponent],
  exports: [ListComponent, QAProcComponent, MainQAComponent, SMQAListComponent, ViewComponent],
  entryComponents: [ViewComponent],
  providers: [SettingsService, DataService, FormService, QAAPIActions]
})
export class SharedQAModule {}
