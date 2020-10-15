/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from '@ngrx/store';
import { tassign } from "tassign";
import { CoreService } from "../../admin/core/coreService";
import { IQAState } from "./model";

export enum QAAPIAction {
  LOAD_STARTED = "QA_LOAD_STARTED",
  LOAD_SUCCEEDED = "QA_LOAD_SUCCEEDED",
  LOAD_FAILED = "QA_LOAD_FAILED",
  APPLY_CHANGES = "QA_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED = "QA_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "QA_APPLY_CHANGES_SUCCEEDED",
  UPDATE_FILTER_OPTIONS = "QA_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "QA_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "QA_UPDATE_PAGINATION_CURRENTPAGE",
  UPDATE_CATEGORIES = "QA_UPDATE_CATEGORIES",
  SELECT_ALL = "QA_SELECT_ALL",
  IS_ITEM_SELECTED = "QA_IP_IS_ITEM_SELECTED",
  ADD_RECORD = "QA_ADD_RECORD",
  UPDATE_RECORD = "QA_UPDATE_RECORD",
  REMOVE_RECORD = "QA_REMOVE_RECORD",
  UPDATE_USER = "QA_UPDATE_USER",
  LOAD_END = "QA_YT_LOADEND",
  REFRESH_DATA = "QA_REFRESH_DATA",
  REFRESH_PAGINATION = "QA_REFRESH_PAGINATION"
}

export class loadStarted implements Action {
  public readonly type = QAAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}


export class loadSucceeded implements Action {
  public readonly type = QAAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = QAAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = QAAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = QAAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = QAAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = QAAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = QAAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = QAAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class updateCategories implements Action {
  public readonly type = QAAPIAction.UPDATE_CATEGORIES;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = QAAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = QAAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = QAAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = QAAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = QAAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = QAAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = QAAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class updateFilter implements Action {
  public readonly type = QAAPIAction.UPDATE_USER;
  constructor(public payload: any) {}
}

export class updateUserFilter implements Action {
  public readonly type = QAAPIAction.UPDATE_USER;
  constructor(public payload: any) {}
}

export type QAAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | applyChanges
  | actionSucceeded
  | actionFailed
  | updateFilterOptions
  | applyFilter
  | updatePaginationCurrentPage
  | updateCategories
  | selectAll
  | updateItemsSelectionStatus
  | addRecord
  | updateRecord
  | loadEnd
  | refresh_pagination
  | updateFilter
  | updateUserFilter
  | reloadList;



export class QABLL {
  service = new CoreService();
  loadSucceeded(state: IQAState, action: any) {
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
    const _filteroption = Object.assign({}, state.filteroptions);
    _filteroption.loadstats = false;

    return tassign(state, {
      posts: action.payload.posts,
      settings: action.payload.settings,
      records: action.payload.records,
      pagination: _pagination,
      filteroptions: _filteroption,
      loading: false,
      isloaded: true
    });
  }

  applyFilterChanges(state: IQAState, action: any) {
    const filters = Object.assign({}, state.filteroptions);
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

  updatePagination(state: IQAState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: IQAState, action: any) {
    const posts = state.posts;
    for (const item of posts) {
      item.Selected = action.payload.checked;
    }
    return tassign(state, {
      selectall: action.payload.checked,
      posts: posts,
      itemsselected: action.payload.checked
    });
    
  }

  addRecord(state: IQAState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: IQAState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    for (let post of posts) {
      if (post.id === action.payload.id) {
        post = Object.assign({}, post, action.payload);
      }
    }
    return tassign(state, { posts: Object.assign([], state.posts, posts) });
  }

  updateUserFilter(state: IQAState, action: any) {
    const filters = Object.assign({}, state.filteroptions);
    filters.userid = action.payload.id;
    return tassign(state, { filteroptions: filters });
  }

  applyChanges(state: IQAState, action: any) {
    const _updated_state = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    for (const selected of action.payload.SelectedItems) {
      for (const item of _updated_state) {
        if (item.id === selected.id) {
          if (
            selected.actionstatus === "delete" ||
            selected.actionstatus === "delete_fav" ||
            selected.actionstatus === "delete_like" ||
            selected.actionstatus === "delete_ans"
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

  refreshpagination(state: IQAState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    
  }
}
