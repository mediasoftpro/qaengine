/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { tassign } from "tassign";
import { IDictionaryState } from "./model";

export enum DictionaryAPIAction {
  LOAD_STARTED = "DICTIONARY_LOAD_STARTED",
  LOAD_SUCCEEDED = "DICTIONARY_LOAD_SUCCEEDED",
  LOAD_FAILED = "DICTIONARY_LOAD_FAILED",
  APPLY_CHANGES = "DICTIONARY_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED =
    "DICTIONARY_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "DICTIONARY_APPLY_CHANGES_SUCCEEDED",

  UPDATE_FILTER_OPTIONS = "DICTIONARY_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "DICTIONARY_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "DICTIONARY_UPDATE_PAGINATION_CURRENTPAGE",
 
  SELECT_ALL = "DICTIONARY_SELECT_ALL",
  IS_ITEM_SELECTED = "DICTIONARY_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "DICTIONARY_ADD_RECORD",
  UPDATE_RECORD = "DICTIONARY_UPDATE_RECORD",
  REMOVE_RECORD = "DICTIONARY_REMOVE_RECORD",

  // REFERESH LOAD
  LOAD_END = "DICTIONARY_YT_LOADEND",
  REFRESH_DATA = "DICTIONARY_REFRESH_DATA",
  REFRESH_PAGINATION = "DICTIONARY_REFRESH_PAGINATION"
}

export class loadStarted implements Action {
  public readonly type = DictionaryAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = DictionaryAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = DictionaryAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = DictionaryAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = DictionaryAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = DictionaryAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = DictionaryAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = DictionaryAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = DictionaryAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = DictionaryAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = DictionaryAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = DictionaryAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = DictionaryAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = DictionaryAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = DictionaryAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = DictionaryAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export type DictionaryAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | applyChanges
  | actionSucceeded
  | actionFailed
  | updateFilterOptions
  | applyFilter
  | updatePaginationCurrentPage
  | selectAll
  | updateItemsSelectionStatus
  | addRecord
  | updateRecord
  | loadEnd
  | refresh_pagination
  | reloadList;

export class DictionaryBLL {
  loadSucceeded(state: IDictionaryState, action: any) {
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

  applyFilterChanges(state: IDictionaryState, action: any) {
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

  updatePagination(state: IDictionaryState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: IDictionaryState, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const item of posts) {
      item.Selected = action.payload;
    }

    return tassign(state, {
      selectall: action.payload,
      posts: posts,
      itemsselected: action.payload
    });
  }

  addRecord(state: IDictionaryState, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = pagination.totalRecords + 1;
    posts.unshift(action.payload);
    /* const coreActions = new CoreAPIActions();
    coreActions.refreshListStats(
      { totalrecords: pagination.totalRecords,
        pagesize:  pagination.pagesize,
        pagenumber: pagination.pagenumber
      }); */
    return tassign(state, {
      posts: posts,
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  updateRecord(state: IDictionaryState, action: any) {
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

  applyChanges(state: IDictionaryState, action: any) {
     const _updated_state = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const selected of action.payload.SelectedItems) {
      for (const item of _updated_state) {
        if (item.id === selected.id) {
          if (selected.actionstatus === "delete") {
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

  refreshpagination(state: IDictionaryState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
