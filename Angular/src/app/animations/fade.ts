
/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */
import {
  trigger,
  animate,
  transition,
  style,
  query
} from "@angular/animations";

export const fadeAnimation = trigger("fadeAnimation", [
  transition("* => *", [
    query(":enter", [style({ opacity: 0 })], { optional: true }),

    query(
      ":leave",
      [style({ opacity: 1 }), animate("0.2s", style({ opacity: 0 }))],
      { optional: true }
    ),

    query(
      ":enter",
      [style({ opacity: 0 }), animate("0.2s", style({ opacity: 1 }))],
      { optional: true }
    )
  ])
]);
