/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  MailTemplatesAPIAction,
  MailTemplatesAPIActions,
  MailTemplatesBLL
} from "./actions";
import { IMailtemplateStates, MAIL_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new MailTemplatesBLL();
export const mailtemplateReducer = (
  state = MAIL_INITIAL_STATE,
  action: MailTemplatesAPIActions
): IMailtemplateStates => {
  switch (action.type) {
    case MailTemplatesAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case MailTemplatesAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case MailTemplatesAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case MailTemplatesAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case MailTemplatesAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case MailTemplatesAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload)
      });

    /* update specific filter option */
    case MailTemplatesAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case MailTemplatesAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case MailTemplatesAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case MailTemplatesAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case MailTemplatesAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);
    // remove loader
    case MailTemplatesAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case MailTemplatesAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case MailTemplatesAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions)
      });
    default:
      return state;
  }
};
