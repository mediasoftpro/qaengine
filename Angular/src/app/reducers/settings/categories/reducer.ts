/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  CategoriesAPIAction,
  CategoriesAPIActions,
  CategoriesBLL,
} from "./actions";
import { ICategoriesState, CATEGORIES_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new CategoriesBLL();
export const categoryReducer = (
  state = CATEGORIES_INITIAL_STATE,
  action: CategoriesAPIActions
): ICategoriesState => {
  switch (action.type) {
    case CategoriesAPIAction.IS_ITEM_SELECTED:
      return tassign(state, { itemsselected: action.payload });

    case CategoriesAPIAction.SELECT_ALL:
      return bll.selectAll(state, action);

    case CategoriesAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case CategoriesAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case CategoriesAPIAction.LOAD_DROPDOWN_CATEGORIES:
      return bll.loadDropdownCategories(state, action);

    case CategoriesAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    /* update wholefilter options */
    case CategoriesAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload),
      });

    /* update specific filter option */
    case CategoriesAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case CategoriesAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    /* add record */
    case CategoriesAPIAction.ADD_RECORD:
      return bll.addRecord(state, action);

    /* update record state */
    case CategoriesAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);

    /* apply changes (multiple selection items e.g delete selected records or enable selected records) */
    case CategoriesAPIAction.APPLY_CHANGES:
      return bll.applyChanges(state, action);

    // remove loader
    case CategoriesAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case CategoriesAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case CategoriesAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions),
      });
    default:
      return state;
  }
};
