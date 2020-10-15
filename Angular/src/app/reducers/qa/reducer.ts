/* -------------------------------------------------------------------------- */
/*                           Product Name: QAEngine                           */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */


import { QAAPIAction, QAAPIActions, QABLL } from "./actions";
import { IQAState, QA_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new QABLL();
export const qaReducer = (
  state = QA_INITIAL_STATE,
  action: QAAPIActions
): IQAState => {
  switch (action.type) {
    case QAAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case QAAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case QAAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case QAAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case QAAPIAction.UPDATE_USER:
      return bll.updateUserFilter(state, action);

    case QAAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case QAAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload)
      });

    /* update specific filter option */
    case QAAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case QAAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case QAAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case QAAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case QAAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);

    /* update categories */
    case QAAPIAction.UPDATE_CATEGORIES:
      return tassign(state, { categories: action.payload });

    // remove loader
    case QAAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case QAAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case QAAPIAction.REFRESH_DATA:
      const filterOptions = state.filteroptions;
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions)
      });
    default:
      return state;
  }
};
