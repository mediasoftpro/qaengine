/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

export interface IBlogState {
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
  isfeatured: 3,
  isadult: 2,
  tags: "",
  category_ids: [],
  order: "blog.created_at desc",
  term: "", // search term
  pagesize: 12, // default page size
  pagenumber: 1, // current page number
  datefilter: 0,
  isSummary: true,
  loadstats: true,
  track_filter: false // just to keep track whether find record or any filter option changed or called on page
};

export const BLOG_INITIAL_STATE: IBlogState = {
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
  isloaded: false
};
