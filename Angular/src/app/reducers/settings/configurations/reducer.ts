/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import {
  ConfigurationsAPIAction,
  ConfigurationsAPIActions,
  ConfigurationsBLL,
} from "./actions";
import { IConfigurationState, CONFIG_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new ConfigurationsBLL();
export const configurationsReducer = (
  state = CONFIG_INITIAL_STATE,
  action: ConfigurationsAPIActions
): IConfigurationState => {
  switch (action.type) {
    case ConfigurationsAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case ConfigurationsAPIAction.LOAD_SUCCEEDED:
      return bll.loadSucceeded(state, action);

    case ConfigurationsAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });
    default:
      return state;
  }
};
