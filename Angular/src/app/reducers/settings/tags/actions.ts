
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
import { ITagState } from "./model";


export enum TagsAPIAction {
  LOAD_STARTED = "TAGS_LOAD_STARTED",
  LOAD_SUCCEEDED = "TAGS_LOAD_SUCCEEDED",
  LOAD_FAILED = "TAGS_LOAD_FAILED",

  APPLY_CHANGES = "TAGS_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED = "TAGS_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "TAGS_APPLY_CHANGES_SUCCEEDED",

  UPDATE_FILTER_OPTIONS = "TAGS_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "TAGS_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "TAGS_UPDATE_PAGINATION_CURRENTPAGE",
  
  SELECT_ALL = "TAGS_SELECT_ALL",
  IS_ITEM_SELECTED = "TAGS_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "TAGS_ADD_RECORD",
  UPDATE_RECORD = "TAGS_UPDATE_RECORD",
  REMOVE_RECORD = "TAGS_REMOVE_RECORD",

  // REFERESH LOAD
  LOAD_END = "TAGS_YT_LOADEND",
  REFRESH_DATA = "TAGS_REFRESH_DATA",
  REFRESH_PAGINATION = "TAGS_REFRESH_PAGINATION"
}

export class loadStarted implements Action {
  public readonly type = TagsAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = TagsAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = TagsAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = TagsAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = TagsAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = TagsAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = TagsAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = TagsAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = TagsAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = TagsAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = TagsAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = TagsAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = TagsAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = TagsAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = TagsAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = TagsAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export type TagsAPIActions =
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

export class TagsBLL {
  loadSucceeded(state: ITagState, action: any) {
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

  applyFilterChanges(state: ITagState, action: any) {
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

  updatePagination(state: ITagState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: ITagState, action: any) {
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

  addRecord(state: ITagState, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: ITagState, action: any) {
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

  applyChanges(state: ITagState, action: any) {
     const _updated_state = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const selected of action.payload.SelectedItems) {
      if (action.payload.isenabled.action === "togglestatus") {
        for (const item of _updated_state) {
          if (item.id === selected.id) {
            if (item.isenabled === 1) {
              item.isenabled = 0;
            } else {
              item.isenabled = 1;
            }
          }
        }
      } else {
        console.log("delete isenabled tracking");
        for (const item of _updated_state) {
          console.log(item);
          if (item.id === selected.id) {
            console.log("matached");
            console.log(item);
            console.log(selected.actionstatus);
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
    }
    return tassign(state, { posts: _updated_state });
  }

  refreshpagination(state: ITagState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
