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
import { QAProcessComponent } from "./process.component";

// shared modules
import { PartialModule } from "../../../partials/shared.module";
import { SharedQAModule } from "../../../shared/qa/shared.module";

@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    SharedQAModule
  ],
  declarations: [QAProcessComponent],
  exports: [QAProcessComponent]
})
export class QAProcessModule {}
