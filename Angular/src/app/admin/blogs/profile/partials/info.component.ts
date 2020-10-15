/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component, Input } from "@angular/core";

@Component({
  selector: "app-blog-info",
  templateUrl: "./info.html"
})
export class BlogProfileInfoComponent {
  constructor() {}

  @Input() Info: any = {};
  @Input() Author_FullName = "";
}
