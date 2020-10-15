/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { HistoryActions, HistoryAPIActions, HistoryBLL } from "./actions";
import { IHistory, ACCOUNT_HISTORY_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

export const accountHistoryReducer = (
  state = ACCOUNT_HISTORY_INITIAL_STATE,
  action: HistoryAPIActions
): IHistory => {
  switch (action.type) {
    case HistoryActions.loadStarted: {
      return {
        ...state,
        loading: true,
        error: null,
      };
    }
    case HistoryActions.loadSucceeded: {
      const bll = new HistoryBLL();
      return bll.loadSucceeded(state, action);
    }
    case HistoryActions.loadFaild: {
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    }
    default:
       return state;
  }
};

// import { Action } from "redux";
/*
export function createAccountHistoryReducer() {
  return function accountHistoryReducer(
    state: IHistory = ACCOUNT_HISTORY_INITIAL_STATE,
    a: Action
  ): IHistory {
    const action = a as HistoryAPIAction;

    const bll = new HistoryBLL();
    /*if (!action.meta) {
      return state;
    }*/
/* switch (action.type) {
      case HistoryAPIActions.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case HistoryAPIActions.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      case HistoryAPIActions.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.error });
    }

    return state;
  };
}
*/
