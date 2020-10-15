/*import { Injectable } from '@angular/core';

import * as Controls from '../../../partials/components/dynamicform/model/elements';
import { FormBase } from '../../../partials/components/dynamicform/model/base';
import * as OPTIONS from '../messages.model';
import { ContentTypes } from '../../../configs/settings';
@Injectable()
export class FormService {

  getControls(entity: OPTIONS.MessageHeaderEntity) {

    const controls: FormBase<any>[] = [];
    controls.push(new Controls.Textbox({
        key: 'subject',
        label: 'Subject',
        value: entity.subject,
        order: 3,
        maxLength: 200
    }));
    
      return controls.sort((a, b) => a.order - b.order);
  }
}
*/