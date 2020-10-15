/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { tassign } from "tassign";

import { IConfigurationState } from "./model";


export enum ConfigurationsAPIAction {
  LOAD_STARTED = "CONFIGURATIONS_LOAD_STARTED",
  LOAD_SUCCEEDED = "CONFIGURATIONS_LOAD_SUCCEEDED",
  LOAD_FAILED = "CONFIGURATIONS_LOAD_FAILED"
}

export class loadStarted implements Action {
  public readonly type = ConfigurationsAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = ConfigurationsAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = ConfigurationsAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export type ConfigurationsAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed;
 
export class ConfigurationsBLL {
  loadSucceeded(state: IConfigurationState, action: any) {
    return tassign(state, {
      //posts: action.payload.settings,
      configurations: action.payload.configurations,
      loading: false
    });
  }
}
