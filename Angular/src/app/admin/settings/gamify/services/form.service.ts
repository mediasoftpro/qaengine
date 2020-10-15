/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as Controls from "../../../../partials/components/dynamicform/model/elements";
import { FormBase } from "../../../../partials/components/dynamicform/model/base";
import * as OPTIONS from "../gamify.model";
import { AppConfig } from "../../../../configs/app.config";
import { CoreService } from "../../../../admin/core/coreService";

@Injectable()
export class FormService {
  constructor(public config: AppConfig, private coreService: CoreService) {}

  getControls(entity: OPTIONS.GamifyEntity, settings: any) {
    const controls: FormBase<any>[] = [];

    if (entity.type === 3) {
      controls.push(
        new Controls.Textbox({
          key: "ilevel",
          label: "Level",
          value: entity.ilevel,
          required: true,
          order: 0,
          disabled: true,
          colsize: "col-md-2",
          pattern: "[0-9]+"
        })
      );
    }
    controls.push(
      new Controls.Textbox({
        key: "title",
        label: "Title",
        value: entity.title,
        required: true,
        minLength: 3,
        maxLength: 150,
        order: 1
        // colsize: 'col-md-2',
        // disabled: _disabled,
        // helpblock: 'Unique key used to fetch mail template within site events. e.g REGUSER for user regiration'
      })
    );

    controls.push(
      new Controls.TinyMyceEditor({
        key: "description",
        label: "Description",
        value: entity.description,
        required: true,
        tinymiceOptions: this.coreService.prepareInitEditorSettings(),
        order: 2
      })
    );

    controls.push(
      new Controls.TextArea({
        key: "notification",
        label: "Notification",
        value: entity.notification,
        required: false,
        order: 3,
        // maxLength: 100,
        helpblock: `Message to be added in user history when user is awarded this feature. e.g
            \'You have been awarded [value] xp, where [value] will be replace with their respective
            value (badge, reward, xp, credits, package, level).`
      })
    );

    controls.push(
      new Controls.Dropdown({
        key: "categoryid",
        label: "Select Category",
        value: entity.categoryid,
        required: true,
        options: [],
        //  maxLength: 150,
        order: 4,
        colsize: "col-md-3"
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "priority",
        label: "Priority",
        value: entity.priority,
        required: true,
        order: 5,
        maxLength: 5,
        pattern: "[0-9]+",
        colsize: "col-md-2"
      })
    );

    // credits available in rewards
    if (entity.type === 2) {
      controls.push(
        new Controls.Textbox({
          key: "credits",
          label: "Credits",
          value: entity.credits,
          required: true,
          order: 6,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          helpblock: "Credits required to unlock this reward."
        })
      );
    }
    if (entity.type === 3) {
      controls.push(
        new Controls.Textbox({
          key: "xp",
          label: "XP",
          value: entity.xp,
          required: true,
          order: 6,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          helpblock: "XP required to unlock this level."
        })
      );
    }
    if (entity.type === 4) {
      controls.push(
        new Controls.Textbox({
          key: "xp",
          label: "XP",
          value: entity.xp,
          required: true,
          order: 6,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          helpblock: "XP to be rewarded when user complete this task."
        })
      );
      controls.push(
        new Controls.Dropdown({
          key: "isdeduct",
          label: "Is Deduct",
          value: entity.isdeduct.toString(),
          options: [
            {
              key: "0",
              value: "No"
            },
            {
              key: "1",
              value: "Yes"
            }
          ],
          order: 7,
          helpblock:
            "If Yes then this event will be used to deduct, remove selected xp from user profile",
          colsize: "col-md-3"
        })
      );
    }
    if (entity.type === 5) {
      controls.push(
        new Controls.Textbox({
          key: "credits",
          label: "Credits",
          value: entity.credits,
          required: true,
          order: 6,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          helpblock: "Credits to be rewarded when user complete this task."
        })
      );
      controls.push(
        new Controls.Dropdown({
          key: "isdeduct",
          label: "Is Deduct",
          value: entity.isdeduct.toString(),
          options: [
            {
              key: "0",
              value: "No"
            },
            {
              key: "1",
              value: "Yes"
            }
          ],
          order: 7,
          helpblock:
            "If Yes then this event will be used to deduct, remove selected xp from user profile",
          colsize: "col-md-3"
        })
      );
    }
    if (entity.type === 6) {
      controls.push(
        new Controls.Textbox({
          key: "price",
          label: "Price",
          value: entity.price,
          required: true,
          order: 6,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          helpblock: "Price needed to buy this package."
        })
      );
      controls.push(
        new Controls.Textbox({
          key: "credits",
          label: "Credits",
          value: entity.credits,
          required: true,
          colsize: "col-md-3",
          pattern: "[0-9]+",
          order: 7,
          helpblock: "Credits to be rewarded when user purchase this package."
        })
      );
    }

    controls.push(
      new Controls.Dropdown({
        key: "ishide",
        label: "Is Hide",
        value: entity.ishide.toString(),
        options: [
          {
            key: "0",
            value: "No"
          },
          {
            key: "1",
            value: "Yes"
          }
        ],
        order: 8,
        helpblock: "Not want to show this in public listings",
        colsize: "col-md-3"
      })
    );

    // badge or reward.
    if (entity.type === 1 || entity.type === 2 || entity.type === 6) {
      controls.push(
        new Controls.Dropdown({
          key: "ismultiple",
          label: "Is Multiple",
          value: entity.ismultiple.toString(),
          options: [
            {
              key: "0",
              value: "No"
            },
            {
              key: "1",
              value: "Yes"
            }
          ],
          order: 9,
          helpblock:
            "If yes current item (badge, reward, package) to be awarded multiple times.",
          colsize: "col-md-3"
        })
      );
    }

    // Image Cropper
    const cropperOptions = {
      cropped_picture: "",
      original_picture: entity.icon,
      croptype: 1, // general cropped settings
      upload_id: 'icon_upload',
      colcss: 'col-md-3',
      settings: {
        width: settings.gamify_badge_width,
        height: settings.gamify_badge_height
      },
      uploadbtntext: "Upload Icon",
      btncss: "btn btn-success"
    };

    controls.push(
      new Controls.ImageCropper({
        key: "icon",
        label: "",
        value: entity.icon,
        required: false,
        cropperOptions: cropperOptions,
        helpblock:
          "Cropsize: " +
          cropperOptions.settings.width +
          "x" +
          cropperOptions.settings.height,
        order: 10
      })
    );

    return controls.sort((a, b) => a.order - b.order);
  }

  getCategoryControls(entity: OPTIONS.GamiftyCategoryEntity) {
    const controls: FormBase<any>[] = [];
    controls.push(
      new Controls.Textbox({
        key: "title",
        label: "Title",
        value: entity.title,
        required: true,
        minLength: 3,
        maxLength: 150,
        order: 1
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "shorttitle",
        label: "Short Title",
        value: entity.shorttitle,
        required: true,
        minLength: 3,
        maxLength: 150,
        order: 2
      })
    );
    controls.push(
      new Controls.TextArea({
        key: "description",
        label: "Description",
        value: entity.description,
        required: true,
        order: 3
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "priority",
        label: "Priority",
        value: entity.priority,
        required: true,
        order: 4
      })
    );

    return controls.sort((a, b) => a.order - b.order);
  }
}
