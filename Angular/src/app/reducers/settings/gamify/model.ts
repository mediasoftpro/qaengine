/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IGamifyState {
  posts: any;
  filter_posts: any;
  records: number;
  loading: boolean;
  error: any;
  pagination: any;
  filteroptions: any;
  categories: any;
  filter_categories: any;
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
  type: 1, // defalt badge type
  categoryid: 0,
  ismultiple: 2,
  ishide: 2,
  isdeduct: 2,
  loadall: true,
  order: "priority desc, id desc",
  pagenumber: 1,
  pagesize: 20,
  track_filter: false // just to keep track whether find record or any filter option changed or called on page
};

export const GAMIFY_INITIAL_STATE: IGamifyState = {
  posts: [],
  filter_posts: [],
  records: 0,
  loading: false,
  error: null,
  pagination: IPagination,
  filteroptions: IFilterOption,
  categories: [],
  filter_categories: [],
  selectall: false,
  itemsselected: false,
  isloaded: false
};
