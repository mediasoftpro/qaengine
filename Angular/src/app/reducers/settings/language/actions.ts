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

import { ILanguageState } from "./model";


export enum LanguageAPIAction {
  LOAD_STARTED = "LANGUAGE_LOAD_STARTED",
  LOAD_SUCCEEDED = "LANGUAGE_LOAD_SUCCEEDED",
  LOAD_FAILED = "LANGUAGE_LOAD_FAILED",
  APPLY_CHANGES = "LANGUAGE_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED = "LANGUAGE_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "LANGUAGE_APPLY_CHANGES_SUCCEEDED",
  UPDATE_FILTER_OPTIONS = "LANGUAGE_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "LANGUAGE_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "LANGUAGE_UPDATE_PAGINATION_CURRENTPAGE",
  UPDATE_CATEGORIES = "LANGUAGE_UPDATE_CATEGORIES",

  SELECT_ALL = "LANGUAGE_SELECT_ALL",
  IS_ITEM_SELECTED = "LANGUAGE_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "LANGUAGE_ADD_RECORD",
  UPDATE_RECORD = "LANGUAGE_UPDATE_RECORD",

  // REFERESH LOAD
  LOAD_END = "LANGUAGE_YT_LOADEND",
  REFRESH_DATA = "LANGUAGE_REFRESH_DATA",
  REFRESH_PAGINATION = "LANGUAGE_REFRESH_PAGINATION",
}

export class loadStarted implements Action {
  public readonly type = LanguageAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = LanguageAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = LanguageAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = LanguageAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = LanguageAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = LanguageAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = LanguageAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = LanguageAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = LanguageAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = LanguageAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = LanguageAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = LanguageAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = LanguageAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = LanguageAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = LanguageAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = LanguageAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export type LanguageAPIActions =
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

export class LanguageBLL {
  loadSucceeded(state: ILanguageState, action: any) {
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
      isloaded: false
    });
  }

  applyFilterChanges(state: ILanguageState, action: any) {
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

  updatePagination(state: ILanguageState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: ILanguageState, action: any) {
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

  addRecord(state: ILanguageState, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: ILanguageState, action: any) {
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

  applyChanges(state: ILanguageState, action: any) {
     const _updated_state = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const selected of action.payload.SelectedItems) {
      switch (action.payload.isenabled.action) {
        case "default":
          console.log("default selected");
          for (const item of _updated_state) {
            if (item.id === selected.id) {
              item.isdefault = 1;
            } else {
              item.isdefault = 0;
            }
          }
          break;
        case "selected":
          console.log("selected selected");
          for (const item of _updated_state) {
            if (item.id === selected.id) {
              if (item.isselected === 1) {
                item.isselected = 0;
              } else {
                item.isselected = 1;
              }
            }
          }
          break;
      }
    }
    return tassign(state, { posts: _updated_state });
  }

  refreshpagination(state: ILanguageState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
