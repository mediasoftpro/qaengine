/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { IAbuseReportStats } from "./model";
import { tassign } from "tassign";
import { CoreService } from "../../../admin/core/coreService";


export enum AbuseReportAction {
  LOAD_STARTED = "ABUSEREPORT_LOAD_STARTED",
  LOAD_SUCCEEDED = "ABUSEREPORT_LOAD_SUCCEEDED",
  LOAD_FAILED = "ABUSEREPORT_LOAD_FAILED",
  APPLY_CHANGES = "ABUSEREPORT_APPLY_CHANGES",
  UPDATE_FILTER_OPTIONS = "ABUSEREPORT_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "ABUSEREPORT_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "ABUSEREPORT_UPDATE_PAGINATION_CURRENTPAGE",
  SELECT_ALL = "ABUSEREPORT_SELECT_ALL",
  IS_ITEM_SELECTED = "ABUSEREPORT_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "ABUSEREPORT_ADD_RECORD",
  UPDATE_RECORD = "ABUSEREPORT_UPDATE_RECORD",
  UPDATE_USER = "ABUSEREPORT_UPDATE_USER",
  LOAD_END = "ABUSEREPORT_YT_LOADEND",
  // REFERESH LOAD
  REFRESH_DATA = "ABUSEREPORT_REFRESH_DATA",
  REFRESH_PAGINATION = "ABUSEREPORT_REFRESH_PAGINATION",
}


export class loadStarted implements Action {
  public readonly type = AbuseReportAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = AbuseReportAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = AbuseReportAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = AbuseReportAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = AbuseReportAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = AbuseReportAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = AbuseReportAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = AbuseReportAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = AbuseReportAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = AbuseReportAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = AbuseReportAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = AbuseReportAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = AbuseReportAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = AbuseReportAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class updateFilter implements Action {
  public readonly type = AbuseReportAction.UPDATE_USER;
  constructor(public payload: any) {}
}


export type AbuseReportActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | applyChanges
  | updateFilterOptions
  | applyFilter
  | updateFilterOptions
  | applyFilter
  | updatePaginationCurrentPage
  | selectAll
  | updateRecord
  | updateItemsSelectionStatus
  | addRecord
  | loadEnd
  | reloadList
  | updateFilter
  | refresh_pagination
  | reloadList;


export class AbuseReportBLL {
  
  service = new CoreService();

  loadSucceeded(state: IAbuseReportStats, action: any) {
    if (action.payload.posts.length > 0) {
      for (const item of action.payload.posts) {
        item.enc_id = this.service.encrypt(item.id);
      }
    }
    // update totalrecords object in pagination prop
    const _pagination = Object.assign({}, state.pagination);
    _pagination.totalRecords = action.payload.records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;
    // avoid loading categories again in next call
const _filteroption= Object.assign({}, state.filteroptions);    _filteroption.loadstats = false;

    return tassign(state, {
      posts: action.payload.posts,
      records: action.payload.records,
      pagination: _pagination,
      filteroptions: _filteroption,
      loading: false,
      isloaded: true
    });
  }

  updateUserFilter(state: IAbuseReportStats, action: any) {
    const filters =  Object.assign({}, state.filteroptions);
    filters.userid = action.payload.id;
    return tassign(state, {
      filteroptions: filters
    });
  }

  applyFilterChanges(state: IAbuseReportStats, action: any) {
    const filters =  Object.assign({}, state.filteroptions);
    for (const prop in filters) {
      if (prop === action.payload.attr) {
        filters[prop] = action.payload.value;
      }
    }
    filters.track_filter = true; // force filter subscriber to call loadRecord function to refresh data

    return tassign(state, {
      filteroptions: Object.assign({}, state.filteroptions, filters)
    });
  }

  updatePagination(state: IAbuseReportStats, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: IAbuseReportStats, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const item of posts) {
      item.Selected = action.payload.checked;
    }
    return tassign(state, {
      selectall: action.payload.checked,
      posts: posts,
      itemsselected: action.payload.checked
    });
  }

  addRecord(state: IAbuseReportStats, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: IAbuseReportStats, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (let post of posts) {
      if (post.id === action.payload.id) {
        post = Object.assign({}, post, action.payload);
      }
    }
    return tassign(state, { posts: Object.assign([], state.posts, posts) });
  }

  applyChanges(state: IAbuseReportStats, action: any) {
    let _updated_state  = Object.assign({}, state.posts);
    for (const selected of action.payload.SelectedItems) {
      for (const item of _updated_state) {
        if (item.id === selected.id) {
          if (
            selected.actionstatus === "delete"
          ) {
            item.isdeleted = true;
          } else {
            for (const prop in item) {
              if (prop === action.payload.isenabled.attr) {
                item[prop] = action.payload.isenabled.value;
              }
            }
          }
        }
      }
    }
    return tassign(state, { posts: _updated_state });
  }

  refreshpagination(state: IAbuseReportStats, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
  }
}
