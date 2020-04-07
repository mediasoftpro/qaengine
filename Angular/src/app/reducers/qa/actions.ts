/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { dispatch } from "@angular-redux/store";
import { FluxStandardAction } from "flux-standard-action";
import { tassign } from "tassign";
import { CoreService } from "../../admin/core/coreService";
import { IQAState } from "./model";

type Payload = any;
interface MetaData {}
export type QAAPIAction = FluxStandardAction<Payload, MetaData>;

@Injectable()
export class QAAPIActions {
  static readonly LOAD_STARTED = "QA_LOAD_STARTED";
  static readonly LOAD_SUCCEEDED = "QA_LOAD_SUCCEEDED";
  //static readonly LOAD_FAVORITE_SUCCEEDED = "QA_LOAD_FAVORITE_SUCCEEDED";
  //static readonly LOAD_LIKED_SUCCEEDED = "QA_LOAD_LIKED_SUCCEEDED";
  //static readonly LOAD_ANSWERED_SUCCEEDED = "QA_LOAD_ANSWERED_SUCCEEDED";
  static readonly LOAD_FAILED = "QA_LOAD_FAILED";

  static readonly APPLY_CHANGES = "QA_APPLY_CHANGES";
  static readonly APPLY_CHANGES_SUCCEEDED = "QA_APPLY_CHANGES_SUCCEEDED";
  static readonly APPLY_CHANGES_FAILED = "QA_APPLY_CHANGES_SUCCEEDED";

  static readonly UPDATE_FILTER_OPTIONS = "QA_UPDATE_FILTER_OPTIONS";
  static readonly APPLY_FILTER = "QA_APPLY_FILTER";
  static readonly UPDATE_PAGINATION_CURRENTPAGE =
    "QA_UPDATE_PAGINATION_CURRENTPAGE";
  static readonly UPDATE_CATEGORIES = "QA_UPDATE_CATEGORIES";

  static readonly SELECT_ALL = "QA_SELECT_ALL";
  static readonly IS_ITEM_SELECTED = "QA_IP_IS_ITEM_SELECTED";

  static readonly ADD_RECORD = "QA_ADD_RECORD";
  static readonly UPDATE_RECORD = "QA_UPDATE_RECORD";
  static readonly REMOVE_RECORD = "QA_REMOVE_RECORD";

  // REFERESH LOAD
  static readonly UPDATE_USER = "QA_UPDATE_USER"; // update user info in filter options (to load logged in user data)
  static readonly LOAD_END = "QA_YT_LOADEND";
  static readonly REFRESH_DATA = "QA_REFRESH_DATA";
  static readonly REFRESH_PAGINATION = "QA_REFRESH_PAGINATION";

  @dispatch()
  loadStarted = (): QAAPIAction => ({
    type: QAAPIActions.LOAD_STARTED,
    // meta: { },
    payload: null
  });

  @dispatch()
  loadSucceeded = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.LOAD_SUCCEEDED,
    // meta: { },
    payload
  });

  /*@dispatch()
  loadFavoriteSucceeded = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.LOAD_FAVORITE_SUCCEEDED,
    // meta: { },
    payload
  });
  @dispatch()
  loadLikeSucceeded = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.LOAD_LIKED_SUCCEEDED,
    // meta: { },
    payload
  });

  @dispatch()
  loadAnsweredSucceeded = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.LOAD_ANSWERED_SUCCEEDED,
    // meta: { },
    payload
  });*/

  @dispatch()
  loadFailed = (error): QAAPIAction => ({
    type: QAAPIActions.LOAD_FAILED,
    // meta: { },
    payload: null,
    error
  });

  @dispatch()
  applyChanges = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.APPLY_CHANGES,
    // meta: { },
    payload
  });

  @dispatch()
  actionSucceeded = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.APPLY_CHANGES_SUCCEEDED,
    // meta: { },
    payload: payload
  });

  @dispatch()
  actionFailed = (error): QAAPIAction => ({
    type: QAAPIActions.APPLY_CHANGES_SUCCEEDED,
    // meta: { },
    payload: null,
    error
  });

  @dispatch()
  updateFilterOptions = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.UPDATE_FILTER_OPTIONS,
    // meta: { },
    payload: payload
  });

  @dispatch()
  applyFilter = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.APPLY_FILTER,
    // meta: { },
    payload: payload
  });

  @dispatch()
  updatePaginationCurrentPage = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.UPDATE_PAGINATION_CURRENTPAGE,
    // meta: { },
    payload: payload
  });

  @dispatch()
  updateCategories = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.UPDATE_CATEGORIES,
    // meta: { },
    payload: payload
  });
  @dispatch()
  selectAll = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.SELECT_ALL,
    // meta: { },
    payload: payload
  });

  @dispatch()
  updateItemsSelectionStatus = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.IS_ITEM_SELECTED,
    // meta: { },
    payload: payload
  });

  @dispatch()
  addRecord = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.ADD_RECORD,
    // meta: { },
    payload: payload
  });

  @dispatch()
  updateRecord = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.UPDATE_RECORD,
    // meta: { },
    payload: payload
  });

  @dispatch()
  reloadList = (): QAAPIAction => ({
    type: QAAPIActions.REFRESH_DATA,
    // meta: { },
    payload: null
  });

  @dispatch()
  refresh_pagination = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.REFRESH_PAGINATION,
    // meta: { },
    payload: payload
  });

  @dispatch()
  loadEnd = (): QAAPIAction => ({
    type: QAAPIActions.LOAD_END,
    // meta: { },
    payload: null
  });

  @dispatch()
  updateFilter = (payload: Payload): QAAPIAction => ({
    type: QAAPIActions.UPDATE_USER,
    // meta: { },
    payload: payload
  });
}

export class QABLL {
  service = new CoreService();
  loadSucceeded(state: IQAState, action: any) {
    if (action.payload.posts.length > 0) {
      for (const item of action.payload.posts) {
        item.enc_id = this.service.encrypt(item.id);
      }
    }
    // update totalrecords object in pagination prop
    const _pagination = state.pagination;
    _pagination.totalRecords = action.payload.records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;
    // avoid loading categories again in next call
    const _filteroption = state.filteroptions;
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

  /* loadFavoriteSucceeded(state: IQAState, action: any) {
    
    // update totalrecords object in pagination prop
    const _pagination = state.favorite_pagination;
    _pagination.totalRecords = action.payload.favorite_records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;

    return tassign(state, {
      favorite_posts: action.payload.posts,
      favorite_records: action.payload.records,
      favorite_pagination: _pagination,
      loading: false,
      favorite_isloaded: true
    });
  }

  loadLikeSucceeded(state: IQAState, action: any) {
    
    // update totalrecords object in pagination prop
    const _pagination = state.liked_pagination;
    _pagination.totalRecords = action.payload.liked_records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;

    return tassign(state, {
      liked_posts: action.payload.posts,
      liked_records: action.payload.records,
      liked_pagination: _pagination,
      loading: false,
      liked_loaded: true
    });
  }

  loadAnsweredSucceeded(state: IQAState, action: any) {
   
    // update totalrecords object in pagination prop
    const _pagination = state.liked_pagination;
    _pagination.totalRecords = action.payload.liked_records;
    _pagination.pageSize = state.filteroptions.pagesize;
    _pagination.currentPage = state.filteroptions.pagenumber;

    return tassign(state, {
      answered_posts: action.payload.posts,
      answered_records: action.payload.records,
      answered_pagination: _pagination,
      loading: false,
      answered_loaded: true
    });
  } */

  applyFilterChanges(state: IQAState, action: any) {
    const filters = state.filteroptions;
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
    const pagination = state.pagination;
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
    /* switch (action.payload.type) {
      case 1:
        // my favorites
        const favposts = state.favorite_posts;
        for (const item of favposts) {
          item.Selected = action.payload.checked;
        }
        return tassign(state, {
          selectall: action.payload.checked,
          favorite_posts: favposts,
          itemsselected: action.payload.checked
        });
      case 2:
        // liked posts
        const likeposts = state.liked_posts;
        for (const item of likeposts) {
          item.Selected = action.payload.checked;
        }
        return tassign(state, {
          selectall: action.payload.checked,
          liked_posts: likeposts,
          itemsselected: action.payload.checked
        });
      case 3:
        // answered qa
        const ansposts = state.answered_posts;
        for (const item of ansposts) {
          item.Selected = action.payload.checked;
        }
        return tassign(state, {
          selectall: action.payload.checked,
          answered_posts: ansposts,
          itemsselected: action.payload.checked
        });
      default:
       
    } */
  }

  addRecord(state: IQAState, action: any) {
    const posts = state.posts;
    posts.unshift(action.payload);
    return tassign(state, { posts: posts });
  }

  updateRecord(state: IQAState, action: any) {
    const posts = state.posts;
    for (let post of posts) {
      if (post.id === action.payload.id) {
        post = Object.assign({}, post, action.payload);
      }
    }
    return tassign(state, { posts: Object.assign([], state.posts, posts) });
  }

  updateUserFilter(state: IQAState, action: any) {
    const filters = state.filteroptions;
    filters.userid = action.payload.id;
    return tassign(state, { filteroptions: filters });
  }

  applyChanges(state: IQAState, action: any) {
    let _updated_state = state.posts;
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
    /* switch (action.payload.type) {
      case 0:
        // my qa
        _updated_state = state.posts;
        break;
      case 1:
        // my favorite
        _updated_state = state.favorite_posts;
        break;
      case 2:
        // my liked
        _updated_state = state.liked_posts;
        break;
      case 2:
        // my answered
        _updated_state = state.answered_posts;
        break;
    }

    for (const selected of action.payload.SelectedItems) {
      for (const item of _updated_state) {
        if (item.id === selected.id) {
          if (
            selected.actionstatus === "delete" ||
            selected.actionstatus === "delete_fav" ||
            selected.actionstatus === "delete_like" ||
            selected.actionstatus === "delete_playlist"
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
    switch (action.payload.type) {
      case 0:
        // my qa
        return tassign(state, { posts: _updated_state });
      case 1:
        // my favorite
        return tassign(state, { favorite_posts: _updated_state });
      case 2:
        // my liked
        return tassign(state, { liked_posts: _updated_state });
      case 3:
        // my answer
        return tassign(state, { answered_posts: _updated_state });
    } 
    return tassign(state, { posts: _updated_state });*/
  }

  refreshpagination(state: IQAState, action: any) {
    const pagination = state.pagination;
    pagination.totalRecords = action.payload.totalrecords;
    pagination.pageSize = action.payload.pagesize;
    return tassign(state, { pagination: pagination });
    /* switch (action.payload.type) {
      case 1:
        // my favorites
        const fav_pagination = state.favorite_pagination;
        fav_pagination.totalRecords = action.payload.totalrecords;
        fav_pagination.pageSize = action.payload.pagesize;
        return tassign(state, { favorite_pagination: fav_pagination });
      // return tassign(state, { favorite_pagination: Object.assign({}, state.favorite_pagination, fav_pagination) });
      case 2:
        // my liked
        const liked_pagination = state.liked_pagination;
        liked_pagination.totalRecords = action.payload.totalrecords;
        liked_pagination.pageSize = action.payload.pagesize;
        return tassign(state, { liked_pagination: liked_pagination });
      case 3:
        // my answered
        const answered_pagination = state.answered_pagination;
        answered_pagination.totalRecords = action.payload.totalrecords;
        answered_pagination.pageSize = action.payload.pagesize;
        return tassign(state, { answered_pagination: answered_pagination });
      default:
        // my qa
        const pagination = state.pagination;
        pagination.totalRecords = action.payload.totalrecords;
        pagination.pageSize = action.payload.pagesize;
        return tassign(state, { pagination: pagination });
      // return tassign(state, { pagination: Object.assign({}, state.pagination, pagination) });
    } */
  }
}
