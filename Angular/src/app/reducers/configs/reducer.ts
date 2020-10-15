/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { ConfigAPIAction, ConfigAPIActions } from "./actions";
import { IConfigState, CNF_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

export const configReducer = (
  state = CNF_INITIAL_STATE,
  action: ConfigAPIActions
): IConfigState => {
  switch (action.type) {
    case ConfigAPIAction.LOAD_STARTED:
      return tassign(state, { loading: true, error: null });

    case ConfigAPIAction.LOAD_SUCCEEDED:
      return tassign(state, {
        configs: action.payload.configurations,
        error: null,
        loading: false,
      });

    case ConfigAPIAction.LOAD_FAILED:
      return tassign(state, { loading: false, error: action.payload });

    case ConfigAPIAction.GET_CONFIG:
      // action.payload should be id of config
      const configs = state.configs;
      let selected_value = "";
      for (const config of configs) {
        if (config.id === action.payload) {
          selected_value = config.value;
        }
      }
      return tassign(state, {
        selected_value: selected_value,
      });
    default:
      return state;
  }
};
