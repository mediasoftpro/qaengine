/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { BlockIPBLL, BlockIPAPIAction, BlockIPAPIActions } from "./actions";
import { IBlockIPState, BLOCK_IP_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new BlockIPBLL();
export const blockipReducer = (
  state = BLOCK_IP_INITIAL_STATE,
  action: BlockIPAPIActions
): IBlockIPState => {
  switch (action.type) {
    case BlockIPAPIAction.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case BlockIPAPIAction.SELECT_ALL:
        return bll.selectAll(state, action);

      case BlockIPAPIAction.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case BlockIPAPIAction.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      case BlockIPAPIAction.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.payload });

      /* update wholefilter options */
      case BlockIPAPIAction.UPDATE_FILTER_OPTIONS:
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, action.payload)
        });

      /* update specific filter option */
      case BlockIPAPIAction.APPLY_FILTER:
        return bll.applyFilterChanges(state, action);

      /* update pagination current page */
      case BlockIPAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
        return bll.updatePagination(state, action);

      /* add record */
      case BlockIPAPIAction.ADD_RECORD:
        return bll.addRecord(state, action);

      /* update record state */
      case BlockIPAPIAction.UPDATE_RECORD:
        return bll.updateRecord(state, action);

      // remove loader
      case BlockIPAPIAction.LOAD_END:
        return tassign(state, { loading: false });

      case BlockIPAPIAction.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);

      case BlockIPAPIAction.REFRESH_DATA:
        const filterOptions = Object.assign({}, state.filteroptions);
        filterOptions.track_filter = true;
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, filterOptions)
        });

      /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
      case BlockIPAPIAction.APPLY_CHANGES:
        return bll.applyChanges(state, action);
    default:
      return state;
  }
};

