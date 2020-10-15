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
import { BlogProfileComponent } from "./process.component";
import { BlogProfileInfoComponent } from "./partials/info.component";
/* services */
import { SettingsService } from "../../../shared/blogs/services/settings.service";
import { DataService } from "../../../shared/blogs/services/data.service";
import { FormService } from "../../../shared/blogs/services/form.service";

/* actions */
// import { BlogAPIActions } from "../../../reducers/blogs/actions";
import { PartialModule } from "../../../partials/shared.module";

@NgModule({
  imports: [CommonModule, PartialModule, RouterModule, FormsModule],
  declarations: [BlogProfileComponent, BlogProfileInfoComponent],
  exports: [BlogProfileComponent],
  providers: [SettingsService, DataService, FormService]
})
export class BlogProfileModule {}
