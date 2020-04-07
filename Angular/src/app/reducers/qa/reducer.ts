/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                            Author: Mediasoftpro                            */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { QAAPIAction, QAAPIActions, QABLL } from "./actions";
import { IQAState, QA_INITIAL_STATE } from "./model";
import { tassign } from "tassign";
import { Action } from "redux";

export function createQAReducer() {
  return function qaReducer(
    state: IQAState = QA_INITIAL_STATE,
    a: Action
  ): IQAState {
    const action = a as QAAPIAction;
    const bll = new QABLL();
    /*if (!action.meta) {
      return state;
    }*/
    switch (action.type) {
      case QAAPIActions.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case QAAPIActions.SELECT_ALL:
        return bll.selectAll(state, action);

      case QAAPIActions.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case QAAPIActions.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      /* case QAAPIActions.LOAD_FAVORITE_SUCCEEDED:
        return bll.loadFavoriteSucceeded(state, action);

      case QAAPIActions.LOAD_LIKED_SUCCEEDED:
        return bll.loadLikeSucceeded(state, action);

      case QAAPIActions.LOAD_ANSWERED_SUCCEEDED:
        return bll.loadAnsweredSucceeded(state, action); */

      case QAAPIActions.UPDATE_USER:
        return bll.updateUserFilter(state, action);

      case QAAPIActions.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.error });

      /* update wholefilter options */
      case QAAPIActions.UPDATE_FILTER_OPTIONS:
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, action.payload)
        });

      /* update specific filter option */
      case QAAPIActions.APPLY_FILTER:
        return bll.applyFilterChanges(state, action);

      /* update pagination current page */
      case QAAPIActions.UPDATE_PAGINATION_CURRENTPAGE:
        return bll.updatePagination(state, action);

      /* add record */
      case QAAPIActions.ADD_RECORD:
        return bll.addRecord(state, action);

      /* update record state */
      case QAAPIActions.UPDATE_RECORD:
        return bll.updateRecord(state, action);

      /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
      case QAAPIActions.APPLY_CHANGES:
        return bll.applyChanges(state, action);

      /* update categories */
      case QAAPIActions.UPDATE_CATEGORIES:
        return tassign(state, { categories: action.payload });

      // remove loader
      case QAAPIActions.LOAD_END:
        return tassign(state, { loading: false });

      case QAAPIActions.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);

      case QAAPIActions.REFRESH_DATA:
        const filterOptions = state.filteroptions;
        filterOptions.track_filter = true;
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, filterOptions)
        });
    }
    return state;
  };
}
