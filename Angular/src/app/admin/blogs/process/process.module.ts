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
import { BlogProcessComponent } from "./process.component";

// shared modules
import { PartialModule } from "../../../partials/shared.module";
import { SharedBlogModule } from "../../../shared/blogs/shared.module";

@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    SharedBlogModule
  ],
  declarations: [BlogProcessComponent],
  exports: [BlogProcessComponent]
})
export class BlogProcessModule {}
