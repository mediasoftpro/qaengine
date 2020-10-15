/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { IUserPage } from "./model";
import { tassign } from "tassign";


export enum UserAPIAction {
  LOAD_STARTED = "USERS_LOAD_STARTED",
  LOAD_SUCCEEDED = "USERS_LOAD_SUCCEEDED",
  LOAD_FAILED = "USERS_LOAD_FAILED",

  APPLY_CHANGES = "USERS_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED = "USERS_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "USERS_APPLY_CHANGES_SUCCEEDED",

  UPDATE_FILTER_OPTIONS = "USERS_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "USERS_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "USERS_UPDATE_PAGINATION_CURRENTPAGE",
  UPDATE_CATEGORIES = "USERS_UPDATE_CATEGORIES",

  SELECT_ALL = "USERS_SELECT_ALL",
  IS_ITEM_SELECTED = "USERS_IP_IS_ITEM_SELECTED",

  ADD_RECORD = "USERS_ADD_RECORD",
  UPDATE_RECORD = "USERS_UPDATE_RECORD",
  REMOVE_RECORD = "USERS_REMOVE_RECORD",

  UPDATE_THUMB = "USERS_UPDATE_THUMB",

  AUTHENTICATE = "USERS_AUTHENTICATE",
  SIGNOUT = "USERS_SIGNOUT",
  UPDATE_AUTH_THUMB = "USERS_UPDATE_AUTH_THUMB",
  // REFERESH LOAD
  LOAD_END = "USERS_YT_LOADEND",
  REFRESH_DATA = "USERS_REFRESH_DATA",
  REFRESH_PAGINATION = "USERS_REFRESH_PAGINATION"
}

export class SignOut implements Action {
  public readonly type = UserAPIAction.SIGNOUT;
  constructor(public payload: any) {}
}

export class Authenticate implements Action {
  public readonly type = UserAPIAction.AUTHENTICATE;
  constructor(public payload: any) {}
}

export class UpdateThumb implements Action {
  public readonly type = UserAPIAction.UPDATE_THUMB;
  constructor(public payload: any) {}
}

export class loadStarted implements Action {
  public readonly type = UserAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = UserAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = UserAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = UserAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = UserAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = UserAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = UserAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = UserAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = UserAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = UserAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = UserAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRecord implements Action {
  public readonly type = UserAPIAction.ADD_RECORD;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = UserAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = UserAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = UserAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = UserAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class updateAuthThumb implements Action {
  public readonly type = UserAPIAction.UPDATE_AUTH_THUMB;
  constructor(public payload: any) {}
}

export type UserAPIActions =
  | loadStarted
  | SignOut
  | Authenticate
  | UpdateThumb
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
  | updateAuthThumb
  | reloadList;

export class UserBLL {
  // update user auth object
  updateAuthThumb(state: IUserPage, action: any) {
    const auth_object = Object.assign({}, state.auth);
    auth_object.User.picturename = action.payload.picturename;
    auth_object.User.img_url = action.payload.img_url;

    return tassign(state, { auth: Object.assign({}, state.auth, auth_object) });
  }

  updateThumb(state: IUserPage, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    for (const post of posts) {
      if (post.id === action.payload.id) {
        post.picturename = action.payload.picturename;
        post.img_url = action.payload.img_url;
      }
    }

    return tassign(state, { posts: Object.assign([], state.posts, posts) });
  }

  loadSucceeded(state: IUserPage, action: any) {
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

  applyFilterChanges(state: IUserPage, action: any) {
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

  updatePagination(state: IUserPage, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  selectAll(state: IUserPage, action: any) {
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

  addRecord(state: IUserPage, action: any) {
   const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: IUserPage, action: any) {
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

  /*  removeRecord(state: IUserPage, action: any) {
     const posts = state.posts.map(item => {
      return Object.assign({}, item);
    });
      console.log('remove record');
      console.log(action.payload);

      if (action.payload.index > -1) {
         posts.splice(action.payload.index, 1);
      }
      return tassign(state, { posts: Object.assign([], state.posts, posts) });
  } */

  applyChanges(state: IUserPage, action: any) {
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

  refreshpagination(state: IUserPage, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
