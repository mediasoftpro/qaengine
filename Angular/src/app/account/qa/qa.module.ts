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
import { QAProcessModule } from "./process/process.module";
import { QAProcessComponent } from "./process/process.component";

// shared modules
import { PartialModule } from "../../partials/shared.module";
import { SharedQAModule } from "../../shared/qa/shared.module";

import { NavigationMenuIndex } from "../../configs/settings";

// Other pages
import { AnsweredQAComponent } from "./answered/answered.component";
import { FavoritedQAComponent } from "./favorites/favorites.component";
import { LikedQAComponent } from "./liked/liked.component";


const routes: Routes = [
  {
    path: "",
    data: {
      topmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      leftmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      title: "My Account",
      urls: [{ title: "My Account", url: "/" }, { title: "Manage QA" }]
    },
    component: QAComponent
  },
  {
    path: "process/:id",
    data: {
      topmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      leftmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      title: "My Account",
      urls: [
        { title: "My Account", url: "/" },
        { title: "QA", url: "/my-qa" },
        { title: "Ask Question" }
      ]
    },
    component: QAProcessComponent
  },
  {
    path: "favorites",
    data: {
      topmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      leftmenuIndex: NavigationMenuIndex.QA_FAVORITED_INDEX,
      title: "My Account",
      urls: [
        { title: "My Account", url: "/" },
        { title: "QA", url: "/my-qa" },
        { title: "Favorited Questions" }
      ]
    },
    component: FavoritedQAComponent
  },
  {
    path: "answered",
    data: {
      topmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      leftmenuIndex: NavigationMenuIndex.QA_ANSWERED_INDEX,
      title: "My Account",
      urls: [
        { title: "My Account", url: "/" },
        { title: "QA", url: "/my-qa" },
        { title: "Answered Questions" }
      ]
    },
    component: AnsweredQAComponent
  },
  {
    path: "liked",
    data: {
      topmenuIndex: NavigationMenuIndex.QA_MY_INDEX,
      leftmenuIndex: NavigationMenuIndex.QA_LIKED_INDEX,
      title: "My Account",
      urls: [
        { title: "My Account", url: "/" },
        { title: "QA", url: "/my-qa" },
        { title: "Liked Questions" }
      ]
    },
    component: LikedQAComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialModule,
    QAProcessModule,
    NgbModule,
    SharedQAModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    QAComponent,
    AnsweredQAComponent,
    FavoritedQAComponent,
    LikedQAComponent
  ],
  exports: [QAComponent]
})
export class QAModule {}
