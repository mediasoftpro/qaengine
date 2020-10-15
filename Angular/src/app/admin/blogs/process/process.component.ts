/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component } from "@angular/core";
import { fadeInAnimation } from "../../../animations/core";

@Component({
  templateUrl: "./process.html",
  animations: [fadeInAnimation]
})
export class BlogProcessComponent {
  
  isAdmin = true;

  constructor(
  ) {}

}
