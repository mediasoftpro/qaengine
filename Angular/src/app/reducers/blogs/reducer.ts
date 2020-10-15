/* -------------------------------------------------------------------------- */
/*                           Product Name: BlogEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { BlogAPIAction, BlogAPIActions, BlogsBLL } from "./actions";
import { IBlogState, BLOG_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new BlogsBLL();
export const blogReducer = (
  state = BLOG_INITIAL_STATE,
  action: BlogAPIActions
): IBlogState => {
  switch (action.type) {
    case BlogAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case BlogAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case BlogAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case BlogAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case BlogAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case BlogAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload)
      });

    /* update specific filter option */
    case BlogAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case BlogAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case BlogAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case BlogAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    case BlogAPIAction.UPDATE_CATEGORIES:
      return tassign(state, { categories: action.payload });

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case BlogAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);

    // remove loader
    case BlogAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case BlogAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case BlogAPIAction.UPDATE_USER:
      return bll.updateUserFilter(state, action);

    case BlogAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions)
      });
    default:
      return state;
  }
};
