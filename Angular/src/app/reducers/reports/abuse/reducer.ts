/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  AbuseReportAction,
  AbuseReportActions,
  AbuseReportBLL
} from "./actions";
import { IAbuseReportStats, ABUSE_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new AbuseReportBLL();
export const abuseReportReducer = (
  state = ABUSE_INITIAL_STATE,
  action: AbuseReportActions
): IAbuseReportStats => {
  switch (action.type) {
    case AbuseReportAction.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case AbuseReportAction.SELECT_ALL:
        return bll.selectAll(state, action);

      case AbuseReportAction.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case AbuseReportAction.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      case AbuseReportAction.UPDATE_USER:
        return bll.updateUserFilter(state, action);

      case AbuseReportAction.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.payload });

      /* update wholefilter options */
      case AbuseReportAction.UPDATE_FILTER_OPTIONS:
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, action.payload)
        });

      /* update specific filter option */
      case AbuseReportAction.APPLY_FILTER:
        return bll.applyFilterChanges(state, action);

      /* update pagination current page */
      case AbuseReportAction.UPDATE_PAGINATION_CURRENTPAGE:
        return bll.updatePagination(state, action);

      /* add record */
      case AbuseReportAction.ADD_RECORD:
        return bll.addRecord(state, action);

      /* update record state */
      case AbuseReportAction.UPDATE_RECORD:
        return bll.updateRecord(state, action);

      /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
      case AbuseReportAction.APPLY_CHANGES:
        return bll.applyChanges(state, action);

      // remove loader
      case AbuseReportAction.LOAD_END:
        return tassign(state, { loading: false });

      case AbuseReportAction.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);

      case AbuseReportAction.REFRESH_DATA:
        const filterOptions = Object.assign({}, state.filteroptions);
        filterOptions.track_filter = true;
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, filterOptions)
        });
    default:
      return state;
  }
};


