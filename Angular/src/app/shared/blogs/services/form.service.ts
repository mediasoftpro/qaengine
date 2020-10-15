/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import * as Controls from "../../../partials/components/dynamicform/model/elements";
import { FormBase } from "../../../partials/components/dynamicform/model/base";
import * as OPTIONS from "../blogs.model";
import { AppConfig } from "../../../configs/app.config";
import { CoreService } from "../../../admin/core/coreService";

@Injectable()
export class FormService {
  constructor(public config: AppConfig, private coreService: CoreService) {}

  getControls(entity: OPTIONS.BlogEntity, auth: any, settings: any, isadmin = true) {
    const controls: FormBase<any>[] = [];

    controls.push(
      new Controls.Textbox({
        key: "title",
        label: "Title",
        value: entity.title,
        required: false,
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
        tinymiceOptions: this.coreService.prepareInitAdvacneEditorSettings(),
        order: 1
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "tags",
        label: "Labels",
        value: entity.tags,
        required: false,
        order: 2,
        maxLength: 500,
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

    /* -------------------------------------------------------------------------- */
    /*                            Banner Image Uploader                           */
    /* -------------------------------------------------------------------------- */
    const cropperOptions = {
      cropped_picture: entity.cover_url,
      croptype: 1, // general cropped settings
      upload_id: 'cover_upload',
      colcss: 'col-md-8',
      settings: {
        width: settings.banner_width,
        height: settings.banner_height
      },
      uploadbtntext: "Upload Cover",
      btncss: "btn btn-success"
    };

    console.log("cover url is " + entity.cover_url);

    controls.push(
      new Controls.ImageCropper({
        key: "cover_url",
        label: "",
        value: entity.cover_url,
        required: false,
        cropperOptions: cropperOptions,
        order: 4
      })
    );

    /* -------------------------------------------------------------------------- */
    /*                       Multiple Slider Images Uploader                      */
    /* -------------------------------------------------------------------------- */
    const _files = [];
    for (const file of entity.files) {
      _files.push({
        filename: file.filename,
        filetype: ".jpg",
        url: file.img_url
      });
    }

    controls.push(
      new Controls.Uploader({
        key: "files",
        label: "",
        value: _files,
        required: false,
        helpblock: "",
        uploadoptions: {
          photouploader: true,
          sliderview: true,
          handlerpath: this.config.getConfig("host") + "api/blogs/uploads",
          pickfilecaption: "Upload Images",
          uploadfilecaption: "Start Uploading",
          pickbuttoncss: "btn btn-danger ",
          maxfilesize: "8mb",
          unique_names: false,
          chunksize: "8mb",
          headers: {},
          extensiontitle: "Images Files",
          extensions: "jpg,jpeg,png",
          filepath: "",
          username: auth.User.id,
          removehandler: "",
          maxallowedfiles: 100,
          showFileName: false, // show filename with media file
          showoriginalSize: true, // show media in original size
          value: _files,
          helpblock: `Upload one or more images (maximum of 100).`
        },
        order: 5
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "picture_caption",
        label: "Picture Caption",
        value: entity.picture_caption,
        order: 5,
        helpblock: `Optional picture caption for uploaded picture`
      })
    );

    return controls.sort((a, b) => a.order - b.order);
  }
}
