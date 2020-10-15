/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
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

import { BlogsComponent } from "./blogs.component";

import { BlogProfileModule } from "./profile/process.module";
import { BlogProfileComponent } from "./profile/process.component";

import { BlogProcessModule } from "./process/process.module";
import { BlogProcessComponent } from "./process/process.component";

// report module
import { BlogReportModule } from "./reports/reports.module";
import { BlogReportsComponent } from "./reports/reports.components";

// shared modules
import { PartialModule } from "../../partials/shared.module";
import { SharedBlogModule } from "../../shared/blogs/shared.module";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Blogs Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Management" }
      ]
    },
    component: BlogsComponent
  },
  {
    path: "tag/:tagname",
    data: {
      title: "Blogs Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Management" }
      ]
    },
    component: BlogsComponent
  },
  {
    path: "category/:catname",
    data: {
      title: "Blogs Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Management" }
      ]
    },
    component: BlogsComponent
  },
  {
    path: "user/:uname",
    data: {
      title: "Blogs Management",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Management" }
      ]
    },
    component: BlogsComponent
  },
  {
    path: "filter/:abuse",
    data: {
      title: "Blogs Management (Reported)",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Reported Posts" }
      ]
    },
    component: BlogsComponent
  },
  
  {
    path: "profile/:id",
    data: {
      title: "Blog Information",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Blog Information" }
      ]
    },
    component: BlogProfileComponent
  },
  {
    path: "reports",
    data: {
      title: "Report Builder",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Report Builder" }
      ]
    },
    component: BlogReportsComponent
  },
  
  {
    path: "process/:id",
    data: {
      title: "Process Post",
      urls: [
        { title: "Dashboard", url: "/" },
        { title: "Blogs", url: "/blogs" },
        { title: "Process Post" }
      ]
    },
    component: BlogProcessComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialModule,
    BlogProfileModule,
    BlogProcessModule,
    NgbModule,
    SharedBlogModule,
    BlogReportModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BlogsComponent],
  exports: [BlogsComponent],
})
export class BlogsModule {}
