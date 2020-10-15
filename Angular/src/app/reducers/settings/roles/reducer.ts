/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { ROLEAPIAction, ROLEAPIActions, RolesBLL } from "./actions";
import { IRoles, ROLE_INITIAL_STATE } from "./model";
import { tassign } from "tassign";

const bll = new RolesBLL();
export const roleReducer = (
  state = ROLE_INITIAL_STATE,
  action: ROLEAPIActions
): IRoles => {
  switch (action.type) {
    case ROLEAPIAction.IS_ITEM_SELECTED:
        return tassign(state, { itemsselected: action.payload });

      case ROLEAPIAction.LOAD_ROLE_STARTED:
        return tassign(state, { loading: true, error: null });

      case ROLEAPIAction.LOAD_ROLE_SUCCEEDED:
        return bll.loadRoleSucceeded(state, action);

      case ROLEAPIAction.LOAD_ROLE_STARTED:
        return tassign(state, { loading: false, error: action.payload });

      case ROLEAPIAction.LOAD_OBJECT_STARTED:
        return tassign(state, { loading: true, error: null });

      case ROLEAPIAction.LOAD_OBJECT_SUCCEEDED:
        return bll.loadObjectSucceeded(state, action);

      case ROLEAPIAction.LOAD_OBJECT_FAILED:
        return tassign(state, { loading: false, error: action.payload });

      /* add record */
      case ROLEAPIAction.ADD_ROLE:
        return bll.addRole(state, action);

      case ROLEAPIAction.ADD_OBJECT:
        return bll.addObject(state, action);

      case ROLEAPIAction.UPDATE_OBJECT:
        return bll.updateObject(state, action);

      case ROLEAPIAction.APPLY_ROLE_CHANGES:
        return bll.applyRoleChanges(state, action);

      case ROLEAPIAction.APPLY_OBJECT_CHANGES:
        return bll.applyObjectChanges(state, action);
      // remove loader
      case ROLEAPIAction.LOAD_END:
        return tassign(state, { loading: false });

      case ROLEAPIAction.REFRESH_PAGINATION:
        return bll.refreshpagination(state, action);
    default:
      return state;
  }
};
