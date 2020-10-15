/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as Controls from "../../../partials/components/dynamicform/model/elements";
import { FormBase } from "../../../partials/components/dynamicform/model/base";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";


@Injectable()
export class FormService {
  constructor(public config: AppConfig, private coreService: CoreService) {}

  getControls(
    entity: any,
    isedit: false
  ) {
    const controls: FormBase<any>[] = [];
  
    // dynamic form

    this.coreService.renderDynamicControls(controls, entity, isedit);

    return controls.sort((a, b) => a.order - b.order);
  }

}
