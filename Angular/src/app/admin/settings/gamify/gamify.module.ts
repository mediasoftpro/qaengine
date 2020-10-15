/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { GamifyComponent } from "./gamify.component";
import { ListComponent } from "./partials/list.component";
import { ViewComponent } from "./partials/modal.component";

/* services */
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";

import { PartialModule } from "../../../partials/shared.module";

@NgModule({
  imports: [CommonModule, PartialModule, FormsModule, RouterModule],
  declarations: [GamifyComponent, ListComponent, ViewComponent],
  entryComponents: [ViewComponent],
  exports: [GamifyComponent],
  providers: [SettingsService, DataService]
})
export class GamifyModule {}
