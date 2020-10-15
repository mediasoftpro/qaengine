/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IAPIOptions {
  load: string;
  getinfo: string;
  action: string;
  add: string;
  remove: string;
  maxid: string;
  levelassociate: any;
  category: any;
}

export interface GamifyEntity {
  id: number;
  title: string;
  description: string;
  shorttitle: string;
  notification: string;
  categoryid: number;
  type: number;
  icon: string;
  ilevel: number;
  icon_css: string;
  priority: number;
  price: number;
  credits: number;
  xp: number;
  isdeduct: number;
  ishide: number;
  ismultiple: number;
  img_url: string;
  file: any;
}

export interface GamiftyCategoryEntity {
  id: number;
  type: number;
  title: string;
  shorttitle: string;
  description: string;
  priority: number;
}
