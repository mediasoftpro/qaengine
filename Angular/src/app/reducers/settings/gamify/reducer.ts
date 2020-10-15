/* -------------------------------------------------------------------------- */
/*                          Product Name: GamifyEngine                        */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { GamifyAPIActions, GamifyAPIAction, GamifyBLL } from './actions';
import { IGamifyState, GAMIFY_INITIAL_STATE } from './model';
import { tassign } from 'tassign';

const bll = new GamifyBLL();
export const gamifyReducer = (
  state = GAMIFY_INITIAL_STATE,
  action: GamifyAPIActions
): IGamifyState => {
  switch (action.type) {
    case GamifyAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case GamifyAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case GamifyAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case GamifyAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case GamifyAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case GamifyAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload),
      });

    /* update specific filter option */
    case GamifyAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case GamifyAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case GamifyAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case GamifyAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case GamifyAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);
    /* filter records by type */
    case GamifyAPIAction.FILTER_RECORDS:
      return bll.filter_records(state, action);
    /* filter categories by type */
    case GamifyAPIAction.FILTER_CATEGORIES:
      return bll.filter_categories(state, action);
    /* add gamify category */
    case GamifyAPIAction.ADD_GAMIFY_CATEGORY:
      return bll.addCatgory(state, action);
    /* update category id */
    case GamifyAPIAction.UPDATE_CATEGORY_ID:
      return bll.updateCategoryID(state, action);
    /* update gamify category */
    case GamifyAPIAction.UPDATE_GAMIFY_CATEGORY:
      return bll.updateCategory(state, action);
    /* remove gamify category */
    case GamifyAPIAction.REMOVE_GAMIFY_CATEGORY:
      return bll.removeCatgory(state, action);

    // remove loader
    case GamifyAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case GamifyAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case GamifyAPIAction.REFRESH_DATA:
      const filterOptions = state.filteroptions;
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions),
      });
    default:
      return state;
  }
};
