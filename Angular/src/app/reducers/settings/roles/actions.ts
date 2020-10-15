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

import { IRoles } from "./model";


export enum ROLEAPIAction {
  LOAD_ROLE_STARTED = "ROLE_LOAD_STARTED",
  LOAD_ROLE_SUCCEEDED = "ROLE_LOAD_SUCCEEDED",
  LOAD_ROLE_FAILED = "ROLE_LOAD_FAILED",
  LOAD_OBJECT_STARTED = "ROLE_OBJECT_LOAD_STARTED",
  LOAD_OBJECT_SUCCEEDED = "ROLE_OBJECT_LOAD_SUCCEEDED",
  LOAD_OBJECT_FAILED = "ROLE_OBJECT_LOAD_FAILED",

  SELECT_ALL = "ROLE_SELECT_ALL",
  IS_ITEM_SELECTED = "ROLE_IS_ITEM_SELECTED",

  ADD_ROLE = "ROLE_ADD_RECORD",
  REMOVE_ROLE = "ROLE_REMOVE_RECORD",

  ADD_OBJECT = "ROLE_ADD_OBJECT",
  UPDATE_OBJECT = "ROLE_UPDATE_RECORD",
  REMOVE_OBJECT = "ROLE_REMOVE_OBJECT",

  APPLY_ROLE_CHANGES = "ROLE_APPLY_ROLE_CHANGES",
  APPLY_OBJECT_CHANGES = "ROLE_APPLY_OBJECT_CHANGES",

  // REFERESH LOAD
  LOAD_END = "ROLE_YT_LOADEND",
  REFRESH_DATA = "ROLE_REFRESH_DATA",
  REFRESH_PAGINATION = "ROLE_REFRESH_PAGINATION"
}

export class loadStarted implements Action {
  public readonly type = ROLEAPIAction.LOAD_ROLE_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = ROLEAPIAction.LOAD_ROLE_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = ROLEAPIAction.LOAD_ROLE_FAILED;
  constructor(public payload: any) {}
}

export class loadObjectStarted implements Action {
  public readonly type = ROLEAPIAction.LOAD_OBJECT_STARTED;
  constructor(public payload: any) {}
}

export class loadObjectSucceeded implements Action {
  public readonly type = ROLEAPIAction.LOAD_OBJECT_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadObjectFailed implements Action {
  public readonly type = ROLEAPIAction.LOAD_OBJECT_FAILED;
  constructor(public payload: any) {}
}

export class selectAll implements Action {
  public readonly type = ROLEAPIAction.SELECT_ALL;
  constructor(public payload: any) {}
}

export class updateItemsSelectionStatus implements Action {
  public readonly type = ROLEAPIAction.IS_ITEM_SELECTED;
  constructor(public payload: any) {}
}

export class addRole implements Action {
  public readonly type = ROLEAPIAction.ADD_ROLE;
  constructor(public payload: any) {}
}

export class removeRole implements Action {
  public readonly type = ROLEAPIAction.REMOVE_ROLE;
  constructor(public payload: any) {}
}

export class addObject implements Action {
  public readonly type = ROLEAPIAction.ADD_OBJECT;
  constructor(public payload: any) {}
}

export class updateObject implements Action {
  public readonly type = ROLEAPIAction.UPDATE_OBJECT;
  constructor(public payload: any) {}
}

export class removeObject implements Action {
  public readonly type = ROLEAPIAction.REMOVE_OBJECT;
  constructor(public payload: any) {}
}

export class applyRoleChanges implements Action {
  public readonly type = ROLEAPIAction.APPLY_ROLE_CHANGES;
  constructor(public payload: any) {}
}

export class applyObjectChanges implements Action {
  public readonly type = ROLEAPIAction.APPLY_OBJECT_CHANGES;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = ROLEAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = ROLEAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = ROLEAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export type ROLEAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | loadObjectStarted
  | loadObjectSucceeded
  | loadObjectFailed
  | addRole
  | removeRole
  | addObject
  | updateObject
  | removeObject
  | applyRoleChanges
  | applyObjectChanges
  | selectAll
  | updateItemsSelectionStatus
  | loadEnd
  | refresh_pagination
  | reloadList;

export class RolesBLL {
  loadRoleSucceeded(state: IRoles, action: any) {
    return tassign(state, {
      roles: action.payload.posts,
      role_records: action.payload.records,
      loading: false,
      isroleloaded: true
    });
  }

  loadObjectSucceeded(state: IRoles, action: any) {
    return tassign(state, {
      objects: action.payload.posts,
      object_records: action.payload.records,
      loading: false,
      isroleloaded: true
    });
  }

  addRole(state: IRoles, action: any) {
    const posts = state.roles;
    posts.unshift(action.payload);
    return tassign(state, { roles: posts });
  }

  addObject(state: IRoles, action: any) {
    const posts = state.objects;
    posts.unshift(action.payload);
    return tassign(state, { objects: posts });
  }

  updateObject(state: IRoles, action: any) {
    const posts = state.objects;
    for (let post of posts) {
      if (post.od === action.payload.id) {
        post = Object.assign({}, post, action.payload);
      }
    }
    return tassign(state, { objects: Object.assign([], state.objects, posts) });
  }

  applyRoleChanges(state: IRoles, action: any) {
    const _updated_state = state.roles;
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
    return tassign(state, { roles: _updated_state });
  }
  applyObjectChanges(state: IRoles, action: any) {
    const _updated_state = state.objects;
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
    return tassign(state, { objects: _updated_state });
  }

  refreshpagination(state: IRoles, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
