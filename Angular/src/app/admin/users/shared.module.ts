/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";
import { PartialModule } from "../../partials/shared.module";

import { UListComponent } from "./partials/list.component";
import { SMAdminUserListComponent} from "./partials/smlist_admin.component";
import { SMUserReportComponent} from "./partials/sm_report.component";
// services
import { SettingsService } from "./services/settings.service";
import { DataService } from "./services/data.service";
import { FormService } from "./services/form.service";

/* actions */
// import { UserAPIActions } from "../../reducers/users/actions";
// import { IDashboardAPIActions } from "../../reducers/admin/dashboard/actions";
import { Ng2GoogleChartsModule } from "ng2-google-charts";
@NgModule({
  imports: [
    CommonModule,
    PartialModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2GoogleChartsModule
  ],
  declarations: [
    UListComponent,
    SMAdminUserListComponent,
    SMUserReportComponent
  ],
  exports: [
    UListComponent,
    SMAdminUserListComponent,
    SMUserReportComponent
  ],
  providers: [SettingsService, DataService, FormService]
})
export class SharedUsersModule {}
