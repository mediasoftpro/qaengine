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

import { ICategoriesState } from "./model";



export enum CategoriesAPIAction {
  LOAD_STARTED = "CATEGORIES_LOAD_STARTED",
  LOAD_SUCCEEDED = "CATEGORIES_LOAD_SUCCEEDED",
  LOAD_FAILED = "CATEGORIES_LOAD_FAILED",
  APPLY_CHANGES = "CATEGORIES_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED =
    "CATEGORIES_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "CATEGORIES_APPLY_CHANGES_SUCCEEDED",

  UPDATE_FILTER_OPTIONS = "CATEGORIES_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "CATEGORIES_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "CATEGORIES_UPDATE_PAGINATION_CURRENTPAGE",
  UPDATE_CATEGORIES = "CATEGORIES_UPDATE_CATEGORIES",

  SELECT_ALL = "CATEGORIES_SELECT_ALL",
  IS_ITEM_SELECTED = "CATEGORIES_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "CATEGORIES_ADD_RECORD",
  UPDATE_RECORD = "CATEGORIES_UPDATE_RECORD",
  REMOVE_RECORD = "CATEGORIES_REMOVE_RECORD",

  LOAD_DROPDOWN_CATEGORIES = "CATEGORIES_LOAD_DROPDOWN",

  // REFERESH LOAD
  LOAD_END = "CATEGORIES_YT_LOADEND",
  REFRESH_DATA = "CATEGORIES_REFRESH_DATA",
  REFRESH_PAGINATION = "CATEGORIES_REFRESH_PAGINATION"
}

export class loadStarted implements Action {
  public readonly type = CategoriesAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = CategoriesAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = CategoriesAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = CategoriesAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = CategoriesAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = CategoriesAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = CategoriesAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = CategoriesAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = CategoriesAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class updateCategories implements Action {
  public readonly type = CategoriesAPIAction.UPDATE_CATEGORIES;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = CategoriesAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = CategoriesAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = CategoriesAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = CategoriesAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = CategoriesAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = CategoriesAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = CategoriesAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class loaddropdowncategories implements Action {
  public readonly type = CategoriesAPIAction.LOAD_DROPDOWN_CATEGORIES;
  constructor(public payload: any) {}
}


export type CategoriesAPIActions =
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
  | loaddropdowncategories
  | reloadList;


export class CategoriesBLL {
  loadSucceeded(state: ICategoriesState, action: any) {
    const categories = action.payload.posts;
    for (const category of categories) {
      if (
        category.level !== undefined &&
        category.level !== null &&
        category.level !== ""
      ) {
        const dots = category.level.match(/\./g) || [];
        const total_dots = dots.length;
        console.log(category.level + " includes " + total_dots + " dots");
        for (let i = 0; i <= total_dots - 1; i++) {
          category.title = "-" + category.title;
        }
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

  loadDropdownCategories(state: ICategoriesState, action: any) {
    return tassign(state, {
      dropdown_categories: action.payload.posts
    });
  }
  applyFilterChanges(state: ICategoriesState, action: any) {
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

  updatePagination(state: ICategoriesState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: ICategoriesState, action: any) {
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

  addRecord(state: ICategoriesState, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: ICategoriesState, action: any) {
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

  applyChanges(state: ICategoriesState, action: any) {
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

  refreshpagination(state: ICategoriesState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
