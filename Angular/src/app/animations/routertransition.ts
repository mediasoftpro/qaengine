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
  style,
  group,
  animateChild,
  query,
  stagger,
  transition
} from "@angular/animations";

export const routerTransition = trigger("routerTransition", [
  transition("* => home", [
    query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
      optional: true
    }),
    group([
      query(
        ":enter",
        [
          style({ transform: "translateX(-100%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(100%)" }))
        ],
        { optional: true }
      )
    ])
  ]),
  transition("* => about", [
    group([
      query(":enter, :leave", style({ position: "fixed", width: "100%" }), {
        optional: true
      }),
      query(
        ":enter",
        [
          style({ transform: "translateX(100%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(0%)" }))
        ],
        { optional: true }
      ),
      query(
        ":leave",
        [
          style({ transform: "translateX(0%)" }),
          animate("0.5s ease-in-out", style({ transform: "translateX(-100%)" }))
        ],
        { optional: true }
      )
    ])
  ])
]);
