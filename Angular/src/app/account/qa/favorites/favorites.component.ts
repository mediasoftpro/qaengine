
/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Component } from "@angular/core";


@Component({
  templateUrl: "./favorites.html"
})
export class FavoritedQAComponent {
    
  isAdmin = false;
  PublicView = false; 
  type = 1; // 0: My Qa, 1: Favorited Qa, 2: Liked Qa, 3: Answered Qa

  constructor(
  ) {}

}
