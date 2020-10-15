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
import * as OPTIONS from "../model";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";

@Injectable()
export class FormService {
  constructor(public config: AppConfig, private coreService: CoreService) {}

  getControls(
    entity: any
  ) {
    const controls: FormBase<any>[] = [];

    controls.push(
      new Controls.Dropdown({
        key: "status",
        label: "Status",
        required: true,
        value: entity.status.toString(),
        options: [
          {
            key: 0,
            value: "Not Reviewed"
          },
          {
            key: 1,
            value: "Reviewed"
          },
          {
            key: 2,
            value: "Closed"
          }
        ],
        order: 3
      })
    );

    controls.push(
      new Controls.TextArea({
        key: "review_comment",
        label: "Comment",
        value: entity.review_comment,
        required: true,
        order: 1,
        maxLength: 300
      })
    );

     
    return controls.sort((a, b) => a.order - b.order);
  }
 
}
