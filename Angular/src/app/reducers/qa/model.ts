/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IQAState {
  posts: any;
  settings: any;
  records: number;
  loading: boolean;
  error: any;
  pagination: any;
  filteroptions: any;
  categories: any;
  selectall: boolean;
  itemsselected: boolean;
  isloaded: boolean;
}

export const IPagination = {
  currentPage: 1,
  totalRecords: 0,
  pageSize: 40,
  showFirst: 1,
  showLast: 1,
  paginationstyle: 0,
  totalLinks: 7,
  prevCss: "",
  nextCss: "",
  urlpath: ""
};

export const IFilterOption = {
  id: 0,
  ispublic: false,
  userid: "",
  isapproved: 2,
  isenabled: 2,
  isclosed: 2,
  isresolved: 2,
  isfeatured: 3,
  type: 0,
  isadult: 2,
  tags: "",
  category_ids: [],
  order: "qa.created_at desc",
  term: "", // search term
  pagesize: 20, // default page size
  pagenumber: 1, // current page number
  datefilter: 0,
  answers: [],
  issummary: true,
  loadstats: true,
  track_filter: false // just to keep track whether find record or any filter option changed or called on page
};

export const QA_INITIAL_STATE: IQAState = {
  posts: [],
  settings: [],
  records: 0,
  loading: false,
  error: null,
  pagination: IPagination,
  filteroptions: IFilterOption,
  categories: [],
  selectall: false,
  itemsselected: false,
  isloaded: false,
  //favorite_posts: [],
  //favorite_records: 0,
  //favorite_isloaded: false,
  //favorite_pagination: IPagination,
  //liked_posts: [],
  //liked_records: 0,
  //liked_loaded: false,
  //liked_pagination: IPagination,
  //answered_posts: [],
  //answered_records: 0,
  //answered_loaded: false,
  //answered_pagination: IPagination
};
