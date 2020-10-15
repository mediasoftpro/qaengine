/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { IAdvertisementState } from "./model";
import { tassign } from "tassign";




export enum AdvertisementAPIAction {
  LOAD_STARTED = "ADVERITESEMENT_LOAD_STARTED",
  LOAD_SUCCEEDED = "ADVERITESEMENT_LOAD_SUCCEEDED",
  LOAD_FAILED = "ADVERITESEMENT_LOAD_FAILED",

  APPLY_CHANGES = "ADVERITESEMENT_APPLY_CHANGES",
  APPLY_CHANGES_SUCCEEDED =
    "ADVERITESEMENT_APPLY_CHANGES_SUCCEEDED",
  APPLY_CHANGES_FAILED = "ADVERITESEMENT_APPLY_CHANGES_FAILED",

  UPDATE_FILTER_OPTIONS =
    "ADVERITESEMENT_UPDATE_FILTER_OPTIONS",
  APPLY_FILTER = "ADVERITESEMENT_APPLY_FILTER",
  UPDATE_PAGINATION_CURRENTPAGE =
    "ADVERITESEMENT_UPDATE_PAGINATION_CURRENTPAGE",

  UPDATE_RECORD = "ADVERTISEMENT_UPDATE_RECORD",

  // REFERESH LOAD
  LOAD_END = "ADVERTISEMENT_YT_LOADEND",
  REFRESH_DATA = "ADVERTISEMENT_REFRESH_DATA",
  REFRESH_PAGINATION = "ADVERTISEMENT_REFRESH_PAGINATION",
}

export class loadStarted implements Action {
  public readonly type = AdvertisementAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = AdvertisementAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = AdvertisementAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class applyChanges implements Action {
  public readonly type = AdvertisementAPIAction.APPLY_CHANGES;
  constructor(public payload: any) {}
}

export class actionSucceeded implements Action {
  public readonly type = AdvertisementAPIAction.APPLY_CHANGES_SUCCEEDED;
  constructor(public payload: any) {}
}

export class actionFailed implements Action {
  public readonly type = AdvertisementAPIAction.APPLY_CHANGES_FAILED;
  constructor(public payload: any) {}
}

export class updateFilterOptions implements Action {
  public readonly type = AdvertisementAPIAction.UPDATE_FILTER_OPTIONS;
  constructor(public payload: any) {}
}

export class applyFilter implements Action {
  public readonly type = AdvertisementAPIAction.APPLY_FILTER;
  constructor(public payload: any) {}
}

export class updatePaginationCurrentPage implements Action {
  public readonly type = AdvertisementAPIAction.UPDATE_PAGINATION_CURRENTPAGE;
  constructor(public payload: any) {}
}

export class updateRecord implements Action {
  public readonly type = AdvertisementAPIAction.UPDATE_RECORD;
  constructor(public payload: any) {}
}

export class loadEnd implements Action {
  public readonly type = AdvertisementAPIAction.LOAD_END;
  constructor(public payload: any) {}
}

export class refresh_pagination implements Action {
  public readonly type = AdvertisementAPIAction.REFRESH_PAGINATION;
  constructor(public payload: any) {}
}

export class reloadList implements Action {
  public readonly type = AdvertisementAPIAction.REFRESH_DATA;
  constructor(public payload: any) {}
}

export type AdvertisementAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | applyChanges
  | actionSucceeded
  | actionFailed
  | updateFilterOptions
  | applyFilter
  | updatePaginationCurrentPage
  | updateRecord
  | loadEnd
  | refresh_pagination
  | reloadList;

  
export class AdvertisementBLL {
  loadSucceeded(state: IAdvertisementState, action: any) {
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

  applyFilterChanges(state: IAdvertisementState, action: any) {
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

  updatePagination(state: IAdvertisementState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.currentPage = action.payload.currentpage;

    return tassign(state, {
      pagination: Object.assign({}, state.pagination, pagination)
    });
  }

  updateRecord(state: IAdvertisementState, action: any) {
    const ads = state.posts;
    for (let ad of ads) {
      if (ad.id === action.payload.id) {
        ad = Object.assign({}, ad, action.payload);
      }
    }
    return tassign(state, { posts: Object.assign([], state.posts, ads) });
  }

  refreshpagination(state: IAdvertisementState, action: any) {
    const pagination = Object.assign({}, state.pagination);
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
  }
}
