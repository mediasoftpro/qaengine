/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  DictionaryAPIAction,
  DictionaryAPIActions,
  DictionaryBLL,
} from "./actions";
import { IDictionaryState, DICTIONARY_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new DictionaryBLL();
export const dictionaryReducer = (
  state = DICTIONARY_INITIAL_STATE,
  action: DictionaryAPIActions
): IDictionaryState => {
  switch (action.type) {
    case DictionaryAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case DictionaryAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case DictionaryAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case DictionaryAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case DictionaryAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case DictionaryAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload),
      });

    /* update specific filter option */
    case DictionaryAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case DictionaryAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case DictionaryAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case DictionaryAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case DictionaryAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);
    // remove loader
    case DictionaryAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case DictionaryAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case DictionaryAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions),
      });
    default:
      return state;
  }
};
