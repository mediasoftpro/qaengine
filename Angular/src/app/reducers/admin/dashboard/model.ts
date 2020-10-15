/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IDashboard {
  stats: any;
  qa: any;
  blogs: any;
  users: any;
  qa_report: any;
  blog_report: any;
  user_report: any;
  stats_loading: boolean;
  qa_loading: boolean;
  blog_loading: boolean;
  user_loading: boolean;
  qa_report_loading: boolean;
  blog_report_loading: boolean;
  user_report_loading: boolean;
  stats_error: any;
  qa_error: any;
  blog_error: any;
  user_error: any;
  qa_report_error: any;
  blog_report_error: any;
  user_report_error: any;
  isloaded: boolean;
  is_qa_report_loaded: boolean;
  is_blog_report_loaded: boolean;
  is_user_report_loaded: boolean;
}

export const ADMIN_DASHBOARD_INITIAL_STATE: IDashboard = {
  stats: {
    qa: 0,
    featured: 0,
    blogs: 0,
    users: 0
  },
  qa: [],
  blogs: [],
  users: [],
  qa_report: {},
  blog_report: {},
  user_report: {},
  stats_loading: false,
  qa_loading: false,
  blog_loading: false,
  user_loading: false,
  qa_report_loading: false,
  blog_report_loading: false,
  user_report_loading: false,
  stats_error: null,
  qa_error: null,
  blog_error: null,
  user_error: null,
  qa_report_error: null,
  blog_report_error: null,
  user_report_error: null,
  isloaded: false,
  is_qa_report_loaded: false,
  is_blog_report_loaded: false,
  is_user_report_loaded: false
};
