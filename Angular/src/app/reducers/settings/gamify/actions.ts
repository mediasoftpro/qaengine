/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { tassign } from 'tassign';
import { IGamifyState } from './model';

export enum GamifyAPIAction {
  LOAD_STARTED = 'GAMIFY_LOAD_STARTED',
  LOAD_SUCCEEDED = 'GAMIFY_LOAD_SUCCEEDED',
  LOAD_FAILED = 'GAMIFY_LOAD_FAILED',
  APPLY_CHANGES = 'GAMIFY_APPLY_CHANGES',
  APPLY_CHANGES_SUCCEEDED = 'GAMIFY_APPLY_CHANGES_SUCCEEDED',
  APPLY_CHANGES_FAILED = 'GAMIFY_APPLY_CHANGES_SUCCEEDED',
  UPDATE_FILTER_OPTIONS = 'GAMIFY_UPDATE_FILTER_OPTIONS',
  APPLY_FILTER = 'GAMIFY_APPLY_FILTER',
  UPDATE_PAGINATION_CURRENTPAGE = 'GAMIFY_UPDATE_PAGINATION_CURRENTPAGE',
  UPDATE_CATEGORIES = 'GAMIFY_UPDATE_CATEGORIES',
  SELECT_ALL = 'GAMIFY_SELECT_ALL',
  IS_ITEM_SELECTED = 'GAMIFY_IP_IS_ITEM_SELECTED',
  ADD_RECORD = 'GAMIFY_ADD_RECORD',
  UPDATE_RECORD = 'GAMIFY_UPDATE_RECORD',
  REMOVE_RECORD = 'GAMIFY_REMOVE_RECORD',
  FILTER_RECORDS = 'GAMIFY_FILTER_RECORDS',
  FILTER_CATEGORIES = 'GAMIFY_FILTER_CATEGORIES',
  ADD_GAMIFY_CATEGORY = 'GAMIFY_ADD_CATEGORY',
  UPDATE_GAMIFY_CATEGORY = 'GAMIFY_UPDATE_CATEGORY',
  REMOVE_GAMIFY_CATEGORY = 'GAMIFY_REMOVE_CATEGORY',
  UPDATE_CATEGORY_ID = 'GAMIFY_UPDATE_CATEGORY_ID',
  LOAD_END = 'GAMIFY_YT_LOADEND',
  REFRESH_DATA = 'GAMIFY_REFRESH_DATA',
  REFRESH_PAGINATION = 'GAMIFY_REFRESH_PAGINATION',
}

export class updateCategoryID implements Action {
  public readonly type = GamifyAPIAction.UPDATE_CATEGORY_ID;
  constructor(public payload: any) {}
}

export class addCategory implements Action {
  public readonly type = GamifyAPIAction.ADD_GAMIFY_CATEGORY;
  constructor(public payload: any) {}
}

export class updateCategory implements Action {
  public readonly type = GamifyAPIAction.UPDATE_GAMIFY_CATEGORY;
  constructor(public payload: any) {}
}

export class removeCategory implements Action {
  public readonly type = GamifyAPIAction.REMOVE_GAMIFY_CATEGORY;
  constructor(public payload: any) {}
}

export class filter_records implements Action {
  public readonly type = GamifyAPIAction.FILTER_RECORDS;
  constructor(public payload: any) {}
}

export class filter_categories implements Action {
  public readonly type = GamifyAPIAction.FILTER_CATEGORIES;
  constructor(public payload: any) {}
}

export class loadStarted implements Action {
  public readonly type = GamifyAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = GamifyAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = GamifyAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = GamifyAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = GamifyAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = GamifyAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = GamifyAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = GamifyAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = GamifyAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = GamifyAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = GamifyAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = GamifyAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = GamifyAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = GamifyAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = GamifyAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = GamifyAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export type GamifyAPIActions =
  | updateCategoryID
  | addCategory
  | updateCategory
  | removeCategory
  | filter_records
  | filter_categories
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

export class GamifyBLL {
  loadSucceeded(state: IGamifyState, action: any) {
    // avoid loading categories again in next call
    const _filteroption = Object.assign({}, state.filteroptions);
    _filteroption.loadstats = false;

    // filter posts by type
    const _filter_posts = [];
    for (const post of action.payload.posts) {
      if (post.type === _filteroption.type) {
        _filter_posts.push(post);
      }
    }

    // filter categories by type
    const categories = action.payload.categories.map((item) => {
      return Object.assign({}, item);
    });
    const _filter_categories = [];
    for (const category of categories) {
      if (category.type === _filteroption.type) {
        _filter_categories.push(category);
      }
    }

    // update totalrecords object in pagination prop
    const _pagination = Object.assign({}, state.pagination);
    _pagination.totalRecords = action.payload.records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;

    return tassign(state, {
      posts: action.payload.posts,
      filter_posts: _filter_posts,
      records: action.payload.records,
      categories: action.payload.categories,
      filter_categories: _filter_categories,
      pagination: _pagination,
      filteroptions: _filteroption,
      loading: false,
      isloaded: true,
    });
  }

  filter_records(state: IGamifyState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    const _filter_posts = [];
    for (const post of posts) {
      if (post.type === parseInt(action.payload, 10)) {
        console.log('type matched');
        _filter_posts.push(post);
      }
    }

    // update totalrecords object in pagination prop
    const _pagination = Object.assign({}, state.pagination);
    _pagination.totalRecords = _filter_posts.length;

    return tassign(state, {
      filter_posts: _filter_posts,
      pagination: Object.assign({}, state.pagination, _pagination),
    });
  }

  filter_categories(state: IGamifyState, action: any) {
    const categories = state.categories.map((item) => {
      return Object.assign({}, item);
    });
    const _filter_categories = [];
    for (const category of categories) {
      if (category.type === parseInt(action.payload, 10)) {
        _filter_categories.push(category);
      }
    }

    return tassign(state, { filter_categories: _filter_categories });
  }

  addCatgory(state: IGamifyState, action: any) {
    const categories = state.categories.map((item) => {
      return Object.assign({}, item);
    });
    categories.unshift(action.payload);

    const _filter_categories = [];
    for (const category of categories) {
      if (parseInt(category.type, 10) === parseInt(action.payload.type, 10)) {
        _filter_categories.push(category);
      }
    }
    
    return tassign(state, {
      categories: categories,
      filter_categories: _filter_categories,
    });
  }

  updateCategory(state: IGamifyState, action: any) {
    const categories = state.categories;
    for (const category of categories) {
      if (category.id === parseInt(action.payload.id, 10)) {
        category.title = action.payload.title;
        category.shorttitle = action.payload.shorttitle;
        category.description = action.payload.description;
        category.priority = action.payload.priority;
      }
    }
    const _filter_categories = [];
    for (const category of categories) {
      if (parseInt(category.type, 10) === parseInt(action.payload.type, 10)) {
        _filter_categories.push(category);
      }
    }

    return tassign(state, {
      categories: Object.assign([], state.categories, categories),
      filter_categories: Object.assign(
        [],
        state.filter_categories,
        _filter_categories
      ),
    });
  }

  removeCatgory(state: IGamifyState, action: any) {
    const categories = state.categories.map((item) => {
      return Object.assign({}, item);
    });

    for (const category of categories) {
      if (category.id === parseInt(action.payload.item.id, 10)) {
        category.isdeleted = true;
      }
    }
    const _filter_categories = [];
    for (const category of categories) {
      if (
        parseInt(category.type, 10) === parseInt(action.payload.item.type, 10)
      ) {
        _filter_categories.push(category);
      }
    }

    return tassign(state, {
      categories: Object.assign([], state.categories, categories),
      filter_categories: Object.assign(
        [],
        state.filter_categories,
        _filter_categories
      ),
    });
  }

  updateCategoryID(state: IGamifyState, action: any) {
    const categories = state.categories.map((item) => {
      return Object.assign({}, item);
    });
    const _updated_categories = action.payload.map((item) => {
      return Object.assign({}, item);
    });
    const updated_category = _updated_categories[0]; // returned as array
    for (const category of categories) {
      if (category.id === 0) {
        if (category.uniqueid == updated_category.uniqueid) {
          category.id = updated_category.id;
        }
      }
    }
    const _filter_categories = [];
    for (const category of categories) {
      if (parseInt(category.type, 10) === parseInt(updated_category.type, 10)) {
        _filter_categories.push(category);
      }
    }

    return tassign(state, {
      categories: Object.assign([], state.categories, categories),
      filter_categories: Object.assign(
        [],
        state.filter_categories,
        _filter_categories
      ),
    });
  }

  applyFilterChanges(state: IGamifyState, action: any) {
    const filters = Object.assign({}, state.filteroptions);
    for (const prop in filters) {
      if (prop === action.payload.attr) {
        filters[prop] = action.payload.value;
      }
    }
    filters.track_filter = true; // force filter subscriber to call loadRecord function to refresh data
    return tassign(state, {
      filteroptions: Object.assign({}, state.filteroptions, filters),
    });
  }

  updatePagination(state: IGamifyState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination),
    });
  }

  selectAll(state: IGamifyState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    for (const item of posts) {
      item.Selected = action.payload;
    }

    return tassign(state, {
      selectall: action.payload,
      posts: posts,
      itemsselected: action.payload,
    });
  }

  addRecord(state: IGamifyState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);

    const _filter_posts = [];
    for (const post of posts) {
      if (parseInt(post.type, 10) === parseInt(action.payload.type, 10)) {
        _filter_posts.push(post);
      }
    }
    return tassign(state, { posts: posts, filter_posts: _filter_posts });
  }

  updateRecord(state: IGamifyState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    for (let post of posts) {
      if (post.id === parseInt(action.payload.id, 10)) {
        post = Object.assign({}, post, action.payload);
      }
    }

    return tassign(state, { posts: Object.assign([], state.posts, posts) });
  }

  applyChanges(state: IGamifyState, action: any) {
    const posts = state.posts.map((item) => {
      return Object.assign({}, item);
    });
    for (const selected of action.payload.SelectedItems) {
      for (const item of posts) {
        if (item.id === selected.id) {
          if (selected.actionstatus === 'delete') {
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
    return tassign(state, { posts: posts });
  }

  refreshpagination(state: IGamifyState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
