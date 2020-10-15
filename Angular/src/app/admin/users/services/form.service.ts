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
import { ContentTypes, NormalRegex } from "../../../configs/settings";
import { CoreService } from "../../../admin/core/coreService";
@Injectable()
export class FormService {

  constructor(private coreService: CoreService) {}
  
  getControls(entity: OPTIONS.UserEntity, viewType: number, isAdmin: boolean = true) {
    switch (viewType) {
      case 1:
        // create account
        return this.CreateAccountControls(entity);
      case 2:
        // edit profile
        return this.EditProfileControls(entity, isAdmin);
      case 3:
        // change email
        return this.ChangeEmailControls(entity, isAdmin);
      case 4:
        // change password
        return this.ChangePasswordControls(entity, isAdmin);
      case 5:
        // change user type
        return this.ChangeUserTypeControls(entity);
    }
    return this.CreateAccountControls(entity);
  }

  CreateAccountControls(entity: OPTIONS.UserEntity) {
    const controls: FormBase<any>[] = [];

    const _user_types = [];
    for (const type of ContentTypes.USER_TYPES) {
      _user_types.push({
        key: type.value,
        value: type.title
      });
    }
    controls.push(
      new Controls.Dropdown({
        key: "role_name",
        label: "Select Role",
        value: entity.role_name.toString(),
        options: _user_types,
        order: 0
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "firstname",
        label: "",
        value: entity.firstname,
        placeholder: "First Name",
        minLength: 3,
        maxLength: 50,
        order: 1
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "lastname",
        label: "",
        value: entity.lastname,
        placeholder: "Last Name",
        minLength: 3,
        maxLength: 50,
        order: 2
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "username",
        label: "",
        value: entity.username,
        placeholder: "User Name",
        minLength: 5,
        maxLength: 15,
        required: true,
        pattern: NormalRegex.USERNAME_REGEX,
        order: 3
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "password",
        type: "password",
        label: "",
        value: entity.password,
        placeholder: "Password",
        minLength: 5,
        maxLength: 20,
        required: true,
        pattern: NormalRegex.PASSWORD_REGEX,
        order: 4
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "cpassword",
        type: "password",
        label: "",
        placeholder: "Confirm Password",
        value: entity.cpassword,
        minLength: 5,
        maxLength: 20,
        required: true,
        order: 5
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "email",
        label: "",
        placeholder: "Email",
        value: entity.email,
        required: true,
        email: true,
        order: 6
      })
    );
    return controls.sort((a, b) => a.order - b.order);
  }

  getLoginControls(entity: OPTIONS.LOGINENTITY) {
    const controls: FormBase<any>[] = [];

    controls.push(
      new Controls.Textbox({
        key: "username",
        label: "",
        value: entity.username,
        placeholder: "User Name",
        required: true,
        minLength: 5,
        maxLength: 20,
        order: 1
      })
    );
    controls.push(
      new Controls.Textbox({
        key: "password",
        type: "password",
        label: "",
        value: entity.password,
        placeholder: "Password",
        required: true,
        minLength: 5,
        maxLength: 20,
        order: 2
      })
    );
    controls.push(
      new Controls.CheckBox({
        key: "rememberme",
        label: "Remember Me",
        value: entity.rememberme,
        checked: entity.rememberme,
        required: true,
        order: 3
      })
    );
    return controls.sort((a, b) => a.order - b.order);
  }

  EditProfileControls(entity: any, isadmin = true) {
    const controls: FormBase<any>[] = [];

    controls.push(
      new Controls.Textbox({
        key: "firstname",
        label: "First Name",
        value: entity.firstname,
        placeholder: "First Name",
        minLength: 3,
        maxLength: 50,
        order: 0
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "lastname",
        label: "Last Name",
        value: entity.lastname,
        placeholder: "Last Name",
        minLength: 3,
        maxLength: 50,
        order: 1
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "phone",
        label: "Phone No",
        value: entity.phoneNumber,
        placeholder: "Enter Phone Number",
        minLength: 3,
        maxLength: 50,
        order: 2
      })
    );

    controls.push(
      new Controls.Textbox({
        key: "mobile",
        label: "Mobile",
        value: entity.mobile,
        placeholder: "Enter Mobile Number",
        minLength: 3,
        maxLength: 50,
        order: 3
      })
    );

    // dynamic form 
    let isEdit = false;
    if (entity.id !== '') {
       isEdit = true;
    }
    this.coreService.renderDynamicControls(controls, entity.options,isEdit)
   
    if (isadmin) {
      controls.push(
        new Controls.SectionHeader({
          key: "config_section_01",
          label: "Settings",
          order: 1001
        })
      );
  
      let isemail = false;
      if (entity.settings.isemail === 1) {
        isemail = true;
      }
      controls.push(
        new Controls.CheckBox({
          key: "isemail",
          label: "Receiving Emails",
          value: entity.settings.isemail,
          checked: isemail,
          helpblock: "Toggle on | off receiving emails",
          order: 1002
        })
      );
  
      let isreceivingmessages = false;
      if (entity.settings.issendmessages === 1) {
        isreceivingmessages = true;
      }
      controls.push(
        new Controls.CheckBox({
          key: "issendmessages",
          label: "Receiving Messages",
          value: entity.settings.issendmessages,
          checked: isreceivingmessages,
          helpblock: "Toggle on | off receiving internal messages within website",
          order: 1003
        })
      );
  
      controls.push(
        new Controls.SectionHeader({
          key: "config_section_01",
          label: "Account",
          order: 1004
        })
      );
  
      controls.push(
        new Controls.Textbox({
          key: "basic_credits",
          label: "Basic Credits",
          value: entity.account.basic_credits.toString(),
          colsize: "col-md-12",
          pattern: "[0-9]+",
          required: true,
          helpblock: "Update user basic credits manually",
          order: 1005
        })
      );
  
      controls.push(
        new Controls.Textbox({
          key: "featured_credits",
          label: "Featured Credits",
          value: entity.account.featured_credits.toString(),
          colsize: "col-md-12",
          pattern: "[0-9]+",
          required: true,
          helpblock: "Update user featured credits manually",
          order: 1006
        })
      );

      controls.push(
        new Controls.Textbox({
          key: "premium_credits",
          label: "Premium Credits",
          value: entity.account.premium_credits.toString(),
          colsize: "col-md-12",
          pattern: "[0-9]+",
          required: true,
          helpblock: "Update user premium credits manually",
          order: 1007
        })
      );

      controls.push(
        new Controls.Textbox({
          key: "hot_credits",
          label: "Hot Credits",
          value: entity.account.hot_credits.toString(),
          colsize: "col-md-12",
          pattern: "[0-9]+",
          required: true,
          helpblock: "Update user hot credits manually",
          order: 1008
        })
      );

      controls.push(
        new Controls.Textbox({
          key: "super_hot_credits",
          label: "Super Hot Credits",
          value: entity.account.super_hot_credits.toString(),
          colsize: "col-md-12",
          pattern: "[0-9]+",
          required: true,
          helpblock: "Update user super hot credits manually",
          order: 1009
        })
      );
      
    }
    

    return controls.sort((a, b) => a.order - b.order);
  }

  ChangeEmailControls(entity: OPTIONS.UserEntity, isAdmin: boolean = true) {
    const controls: FormBase<any>[] = [];
    controls.push(
      new Controls.Textbox({
        key: "email",
        label: "Email Address",
        placeholder: "Email",
        value: entity.email,
        required: true,
        email: true,
        order: 0
      })
    );
    if (!isAdmin) {
        controls.push(new Controls.Textbox({
          key: 'password',
          type: 'password',
          pattern: NormalRegex.PASSWORD_REGEX,
          label: '',
          placeholder: 'Password',
          value: entity.password,
          minLength: 5,
          maxLength: 20,
          required: true,
          order: 1,
      }));

    }
    return controls.sort((a, b) => a.order - b.order);
  }

  ChangePasswordControls(entity: OPTIONS.UserEntity, isadmin: boolean = true) {
    const controls: FormBase<any>[] = [];

     if (!isadmin) {
        controls.push(new Controls.Textbox({
            key: 'opassword',
            type: 'password',
            label: 'Current Password',
            value: entity.opassword,
            placeholder: 'Old Password',
            minLength: 5,
            maxLength: 20,
            required: true,
            order: 0,
        }));
     }
  
      controls.push(
        new Controls.Textbox({
          key: "password",
          type: "password",
          label: "New Password",
          value: entity.password,
          placeholder: "Password",
          minLength: 5,
          maxLength: 20,
          required: true,
          pattern: NormalRegex.PASSWORD_REGEX,
          order: 4
        })
      );
      controls.push(
        new Controls.Textbox({
          key: "cpassword",
          type: "password",
          label: "Confirm Password",
          placeholder: "Confirm Password",
          value: entity.cpassword,
          minLength: 5,
          maxLength: 20,
          required: true,
          order: 5
        })
      );
      return controls.sort((a, b) => a.order - b.order);
  }

  ChangeUserTypeControls(entity: OPTIONS.UserEntity) {
    const controls: FormBase<any>[] = [];
    const _user_types = [];
    for (const type of ContentTypes.USER_TYPES) {
      _user_types.push({
        key: type.value,
        value: type.title
      });
    }
    controls.push(
      new Controls.Dropdown({
        key: "role_name",
        label: "Select Role",
        value: entity.role_name,
        options: _user_types,
        order: 0
      })
    );
    return controls.sort((a, b) => a.order - b.order);
  }
}
