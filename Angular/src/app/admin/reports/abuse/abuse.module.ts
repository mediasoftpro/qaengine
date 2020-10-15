/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

// shared modules
import { PartialModule } from "../../../partials/shared.module";
import { SharedAbuseReportModule } from "../../../shared/reports/shared.module";


// Components
import { AbuseComponent } from "./abuse.component";

@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    FormsModule,
    RouterModule,
    SharedAbuseReportModule
  ],
  declarations: [AbuseComponent],
  exports: [AbuseComponent]
})
export class AbuseModule {}
