/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { ReportsComponent } from "./reports.component";
import { AbuseComponent } from "./abuse/abuse.component";


const adRoutes: Routes = [
  {
    path: "",
    component: ReportsComponent,
    data: {
      title: "Report Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Reports", url: "/reports" },
        { title: "Management" }
      ]
    },
    children: [
      {
        path: "abuse",
        children: [
          {
            path: ":type/:id",
            component: AbuseComponent,
            data: {
              title: "Abuse Report (Detail)",
              urls: [
                { title: "Dashboard", url: "/" },
                { title: "Abuse Report (Detail)" }
              ]
            }
          },
        ],
        data: {
          title: "Manage Abuse Reports",
          urls: [
            { title: "Dashboard", url: "/" },
            { title: "Manage Abuse Reports" }
          ]
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(adRoutes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {}
