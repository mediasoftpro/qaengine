/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  AdvertisementAPIAction,
  AdvertisementAPIActions,
  AdvertisementBLL,
} from "./actions";
import { IAdvertisementState, ADS_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new AdvertisementBLL();
export const advertisementReducer = (
  state = ADS_INITIAL_STATE,
  action: AdvertisementAPIActions
): IAdvertisementState => {
  switch (action.type) {
    case AdvertisementAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case AdvertisementAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case AdvertisementAPIAction.LOAD_FAILED:
      return tassign(state, {
        posts: [],
        records: 0,
        loading: false,
        error: action.payload,
      });

    /* update wholefilter options */
    case AdvertisementAPIAction.UPDATE_FILTER_OPTIONS:
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, action.payload),
      });

    /* update specific filter option */
    case AdvertisementAPIAction.APPLY_FILTER:
      return bll.applyFilterChanges(state, action);

    /* update pagination current page */
    case AdvertisementAPIAction.UPDATE_PAGINATION_CURRENTPAGE:
      return bll.updatePagination(state, action);

    case AdvertisementAPIAction.UPDATE_RECORD:
      return bll.updateRecord(state, action);
    // remove loader
    case AdvertisementAPIAction.LOAD_END:
      return tassign(state, { loading: false });

    case AdvertisementAPIAction.REFRESH_PAGINATION:
      return bll.refreshpagination(state, action);

    case AdvertisementAPIAction.REFRESH_DATA:
      const filterOptions = Object.assign({}, state.filteroptions);
      filterOptions.track_filter = true;
      return tassign(state, {
        filteroptions: Object.assign({}, state.filteroptions, filterOptions),
      });
    default:
      return state;
  }
};
