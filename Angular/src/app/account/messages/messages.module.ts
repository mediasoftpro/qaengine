import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { MessageComponent } from './messages.component';
//import { ListComponent } from './partials/list.component';

/* services */
import { SettingsService } from './services/settings.service';
import { DataService } from './services/data.service';

/* actions */
//import { MessageAPIActions } from './reducer/actions';

import { PartialModule } from '../../partials/shared.module';
import { NavigationMenuIndex } from "../../configs/settings";

const routes: Routes = [{
  path: '',
  data: {
      title: 'Messages',
      topmenuIndex: NavigationMenuIndex.TOPMENU_SETTINGS_INDEX,
      leftmenuIndex: NavigationMenuIndex.SETTINGS_MESSAGES_INDEX,
      urls: [{title: 'Dashboard', url: '/'},
      {title: 'Messages', url: '/messages'},
      {title: 'Management'}]
    },
  component: MessageComponent
}];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PartialModule,
    NgbModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    MessageComponent
  ],
  entryComponents: [
  ],
  exports: [
    MessageComponent
  ],
  providers: [
    SettingsService, DataService
  ]
})
export class MessagesModule { }
