
/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { TagsAPIAction, TagsAPIActions, TagsBLL } from "./actions";
import { ITagState, TAGS_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new TagsBLL();
export const tagsReducer = (
  state = TAGS_INITIAL_STATE,
  action: TagsAPIActions
): ITagState => {
  switch (action.type) {
    case TagsAPIAction.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case TagsAPIAction.SELECT_ALL:
        return bll.selectAll(state, action);

      case TagsAPIAction.LOAD_STARTED:
        return tassign(state, { loading: true, error: null });

      case TagsAPIAction.LOAD_SUCCEEDED:
        return bll.loadSucceeded(state, action);

      case TagsAPIAction.LOAD_FAILED:
        return tassign(state, { loading: false, error: action.payload });

      /* update wholefilter options */
      case TagsAPIAction.UPDATE_FILTER_OPTIONS:
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, action.payload)
        });

      /* update specific filter option */
      case TagsAPIAction.APPLY_FILTER:
        return bll.applyFilterChanges(state, action);

      /* update pagination current page */
      case TagsAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
        return bll.updatePagination(state, action);

      /* add record */
      case TagsAPIAction.ADD_RECORD:
        return bll.addRecord(state, action);

      /* update record state */
      case TagsAPIAction.UPDATE_RECORD:
        return bll.updateRecord(state, action);

      /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
      case TagsAPIAction.APPLY_CHANGES:
        return bll.applyChanges(state, action);
      // remove loader
      case TagsAPIAction.LOAD_END:
        return tassign(state, { loading: false });

      case TagsAPIAction.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);

      case TagsAPIAction.REFRESH_DATA:
        const filterOptions = Object.assign({}, state.filteroptions);
        filterOptions.track_filter = true;
        return tassign(state, {
          filteroptions: Object.assign({}, state.filteroptions, filterOptions)
        });
    default:
      return state;
  }
};
