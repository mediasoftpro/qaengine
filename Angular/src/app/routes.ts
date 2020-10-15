/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Routes } from "@angular/router";
import { JMediaLazyGuard } from "./j-media-guard.guard";

export const appRoutes: Routes = [
  {
    path: "blogs",
    loadChildren: () => import('./admin/blogs/blogs.module').then(m => m.BlogsModule)
    //loadChildren: "./admin/blogs/blogs.module#BlogsModule"
  },
  {
    path: "login",
    loadChildren: () => import('./admin/login/login.module').then(m => m.LoginModule)
    //loadChildren: "./admin/login/login.module#LoginModule"
  },
  {
    path: "settings",
    loadChildren: () => import('./admin/settings/settings.module').then(m => m.SettingsModule)
    //canActivate: [JMediaLazyGuard],
    //loadChildren: "./admin/settings/settings.module#SettingsModule"
  },
  {
    path: "users",
    loadChildren: () => import('./admin/users/module').then(m => m.UserModule)
    //canActivate: [JMediaLazyGuard],
    //loadChildren: "./admin/users/module#UserModule"
  },
  {
    path: "qa",
    loadChildren: () => import('./admin/qa/qa.module').then(m => m.QAModule)
    //canActivate: [JMediaLazyGuard],
    
  },
  // my account routes
  {
    path: "email-options",
    loadChildren: () => import('./account/email-options/emailoptions.module').then(m => m.EmailOptionModule)
   // canActivate: [JMediaLazyGuard],
    //loadChildren:
    //  "./account/email-options/emailoptions.module#EmailOptionModule"
  },
  {
    path: "manage-account",
    loadChildren: () => import('./account/manage-account/manageaccount.module').then(m => m.ManageAccountModule)
   // canActivate: [JMediaLazyGuard],
    //loadChildren:
   //   "./account/manage-account/manageaccount.module#ManageAccountModule"
  },
 
  {
    path: "profile-setup",
    loadChildren: () => import('./account/profile-setup/profile.setup.module').then(m => m.ProfileSetupModule)
    // canActivate: [JMediaLazyGuard],
    //loadChildren:
    //  "./account/profile-setup/profile.setup.module#ProfileSetupModule"
  },
 
  
  {
    path: "my-qa",
    loadChildren: () => import('./account/qa/qa.module').then(m => m.QAModule)
   
  },

  {
    path: 'messages',
    loadChildren: () => import('./account/messages/messages.module').then(m => m.MessagesModule)
    // canActivate: [JMediaLazyGuard],
    // loadChildren: './account/messages/messages.module#MessagesModule',
  },
  {
    path: "setup",
    loadChildren: () => import('./setup/index/index.module').then(m => m.SetupModule)
    // loadChildren: "./setup/index/index.module#SetupModule"
  },
  {
    path: "",
    loadChildren: () => import('./admin/dashboard/dashboard.module').then(m => m.DashboardModule)
    // loadChildren: "./admin/dashboard/dashboard.module#DashboardModule"
  },
  {
    path: "**",
    loadChildren: () => import('./pages/notfound/notfound.module').then(m => m.NotFoundModule)
    // loadChildren: "./pages/notfound/notfound.module#NotFoundModule"
  }
];
