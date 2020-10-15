/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { LanguageAPIAction, LanguageAPIActions, LanguageBLL } from "./actions";
import { ILanguageState, LANGUAGE_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new LanguageBLL();
export const languageReducer = (
  state = LANGUAGE_INITIAL_STATE,
  action: LanguageAPIActions
): ILanguageState => {
  switch (action.type) {
    case LanguageAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case LanguageAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case LanguageAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case LanguageAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case LanguageAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case LanguageAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload),
      });

    /* update specific filter option */
    case LanguageAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case LanguageAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case LanguageAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case LanguageAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case LanguageAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);
    // remove loader
    case LanguageAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case LanguageAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case LanguageAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions),
      });
    default:
      return state;
  }
};
