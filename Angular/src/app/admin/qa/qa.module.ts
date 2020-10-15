/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";

import { QAComponent } from "./qa.component";
import { QAProfileModule } from "./profile/process.module";
import { QAProfileComponent } from "./profile/process.component";
import { QAProcessModule } from "./process/process.module";
import { QAProcessComponent } from "./process/process.component";

// report modules
import { QAReportModule } from "./reports/reports.module";
import { QAReportsComponent } from "./reports/reports.components";

// shared modules
import { PartialModule } from "../../partials/shared.module";
import { SharedQAModule } from "../../shared/qa/shared.module";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "QA Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Management" }
      ]
    },
    component: QAComponent
  },
  {
    path: "tag/:tagname",
    data: {
      title: "QA Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Management" }
      ]
    },
    component: QAComponent
  },
  {
    path: "category/:catname",
    data: {
      title: "QA Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Management" }
      ]
    },
    component: QAComponent
  },
  {
    path: "user/:uname",
    data: {
      title: "QA Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Management" }
      ]
    },
    component: QAComponent
  },
  {
    path: "filter/:abuse",
    data: {
      title: "QA Management (Reported Questions)",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "(Reported Questions)" }
      ]
    },
    component: QAComponent
  },
 
  {
    path: "profile/:id",
    data: {
      title: "QA Information",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "QA Information" }
      ]
    },
    component: QAProfileComponent
  },

  {
    path: "reports",
    data: {
      title: "Reports Overview",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Reports Overview" }
      ]
    },
    component: QAReportsComponent
  },

  
  {
    path: "process/:id",
    data: {
      title: "Add / Update QA",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "QA", url: "/qa" },
        { title: "Add / Update QA" }
      ]
    },
    component: QAProcessComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialModule,
    QAProfileModule,
    QAProcessModule,
    SharedQAModule,
    QAReportModule,
    NgbModule,
    RouterModule.forChild(routes)
  ],
  declarations: [QAComponent],
  exports: [QAComponent]
})
export class QAModule {}
