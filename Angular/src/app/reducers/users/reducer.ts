/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { UserAPIAction, UserAPIActions, UserBLL } from "./actions";
import { IUserPage, USER_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new UserBLL();
export const userReducer = (
  state = USER_INITIAL_STATE,
  action: UserAPIActions
): IUserPage => {
  switch (action.type) {
    case UserAPIAction.SIGNOUT:
        // reset
        const _auth = {
          isAuthenticated: false,
          User: {}
        };
        return tassign(state, { auth: _auth });
      case UserAPIAction.AUTHENTICATE:
        return tassign(state, { auth: action.payload });

      case UserAPIAction.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case UserAPIAction.SELECT_ALL:
        return bll.selectAll(state, action);

      case UserAPIAction.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case UserAPIAction.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      case UserAPIAction.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.payload });

      /* update wholefilter options */
      case UserAPIAction.UPDATE_FILTER_OPTIONS:
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, action.payload)
        });

      /* update specific filter option */
      case UserAPIAction.APPLY_FILTER:
        return bll.applyFilterChanges(state, action);

      /* update pagination current page */
      case UserAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
        return bll.updatePagination(state, action);

      /* add record */
      case UserAPIAction.ADD_RECORD:
        return bll.addRecord(state, action);

      /* update record state */
      case UserAPIAction.UPDATE_RECORD:
        return bll.updateRecord(state, action);

      /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
      case UserAPIAction.APPLY_CHANGES:
        return bll.applyChanges(state, action);

      /* update thumb (user auth object) */
      case UserAPIAction.UPDATE_AUTH_THUMB:
        return bll.updateAuthThumb(state, action);
      /* update thumb */
      case UserAPIAction.UPDATE_THUMB:
        return bll.updateThumb(state, action);

      // remove loader
      case UserAPIAction.LOAD_END:
        return tassign(state, { loading: false });

      case UserAPIAction.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);

      case UserAPIAction.REFRESH_DATA:
        const filterOptions = Object.assign({}, state.filteroptions);
        filterOptions.track_filter = true;
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, filterOptions)
        });
    default:
      return state;
  }
};
