/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { IClickActions } from "../navigation/navigation.model";

export interface IToolbarOptions {
  showtoolbar: boolean;
  direction?: string;
  left_caption?: string;
  right_caption?: string;
  left_options: IToolbarOption[];
  right_options: IToolbarOption[];
}

export interface IToolbarOption {
  title: string;
  position: string;
  ismultiple: boolean;
  selected: boolean;
  icon: string;
  options: IClickActions[];
}
