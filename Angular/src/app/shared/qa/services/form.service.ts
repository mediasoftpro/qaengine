/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";

import * as Controls from "../../../partials/components/dynamicform/model/elements";
import { FormBase } from "../../../partials/components/dynamicform/model/base";
import * as OPTIONS from "../qa.model";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";

@Injectable()
export class FormService {
  constructor(public config: AppConfig, private coreService: CoreService) {}

  getAnswerControls(entity: OPTIONS.QANSWERENTITY) {
    const controls: FormBase<any>[] = [];
    controls.push(
      new Controls.TinyMyceEditor({
        key: "description",
        label: "Description",
        value: entity.description,
        required: true,
        tinymiceOptions: this.coreService.prepareInitEditorSettings(),
        order: 1
      })
    );
    return controls.sort((a, b) => a.order - b.order);
  }

  getControls(entity: OPTIONS.QAEntity, settings: any, isadmin: boolean) {
    const controls: FormBase<any>[] = [];

    controls.push(
      new Controls.Textbox({
        key: "title",
        label: "Title",
        value: entity.title,
        required: true,
        order: 0,
        maxLength: 300
        // helpblock: `Enter post title`
      })
    );

    controls.push(
      new Controls.TinyMyceEditor({
        key: "description",
        label: "Description",
        value: entity.description,
        required: true,
        tinymiceOptions: this.coreService.prepareInitEditorSettings(),
        order: 1
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "tags",
        label: "Tags",
        value: entity.tags,
        required: true,
        order: 2,
        maxLength: 1000,
        helpblock: `Enter one or more tags separated by comma`
      })
    );

    controls.push(
      new Controls.MultiDropdown({
        key: "categories",
        label: "Select Categories",
        value: this.coreService.prepareSelectedItems(entity.category_list),
        multiselectOptions: this.coreService.getMultiCategorySettings(),
        required: true,
        helpblock: `Select one or more categories to associate blog post`,
        order: 3
      })
    );

    if (isadmin) {
      controls.push(
        new Controls.RadioButtonList({
          key: "isenabled",
          label: "Enabled Status",
          value: entity.isenabled.toString(),
          required: true,
          order: 11,
          options: [
            {
              key: "0",
              value: "No"
            },
            {
              key: "1",
              value: "Yes"
            }
          ]
        })
      );

      controls.push(
        new Controls.RadioButtonList({
          key: "isapproved",
          label: "Approval Status",
          value: entity.isapproved.toString(),
          required: true,
          order: 12,
          options: [
            {
              key: "0",
              value: "No"
            },
            {
              key: "1",
              value: "Yes"
            }
          ]
        })
      );

    }

    return controls.sort((a, b) => a.order - b.order);
  }
}
