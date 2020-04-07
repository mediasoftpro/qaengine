/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IAPIOptions {
  load: string;
  getinfo: string;
  load_reports: string;
  action: string;
  answeraction: string;
  panswer: string;
  proc: string;
  load_categories: string;
  authorize_author: string;
}

export interface QAEntity {
  id: number;
  userid: string;
  title: string;
  description: string;
  category_list: any;
  tags: string;
  isapproved: number;
  isenabled: number;
}

export interface QANSWERENTITY {
  id: number;
  qid: number;
  userid: string;
  description: string;
}
