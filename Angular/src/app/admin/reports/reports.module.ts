/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import { ReportsComponent } from "./reports.component";
import { AbuseModule } from "./abuse/abuse.module";

import { ReportsRoutingModule } from "./reports.routing.module";


@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    AbuseModule,
    ReportsRoutingModule,
  ],
  declarations: [ReportsComponent]
})
export class ClassifiedModule {}
