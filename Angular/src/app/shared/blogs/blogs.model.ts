/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IAPIOptions {
  load: string;
  load_reports: string;
  generate_report: string;
  getinfo: string;
  action: string;
  proc: string;
  load_categories: string;
  authorize_author: string;
}

export interface BlogEntity {
  id: number;
  userid: string;
  title: string;
  description: string;
  categories: any;
  category_list: any;
  tags: string;
  picture_caption: string;
  picture_url: string;
  cover_url: string;
  fetch_url: string;
  isadult: number;
  files: any;
  img_url: string;
}
