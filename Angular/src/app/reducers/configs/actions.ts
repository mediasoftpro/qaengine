/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";


export enum ConfigAPIAction {
  LOAD_STARTED = "CONFIG_LOAD_STARTED",
  LOAD_SUCCEEDED = "CONFIG_LOAD_SUCCEEDED",
  LOAD_FAILED = "CONFIG_LOAD_FAILED",
  GET_CONFIG = "GET_CONFIGURATION_VALUE",
}


export class loadStarted implements Action {
  public readonly type = ConfigAPIAction.LOAD_STARTED;
  constructor(public payload: any) {}
}

export class loadSucceeded implements Action {
  public readonly type = ConfigAPIAction.LOAD_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadFailed implements Action {
  public readonly type = ConfigAPIAction.LOAD_FAILED;
  constructor(public payload: any) {}
}

export class getConfig implements Action {
  public readonly type = ConfigAPIAction.GET_CONFIG;
  constructor(public payload: any) {}
}


export type ConfigAPIActions =
  | loadStarted
  | loadSucceeded
  | loadFailed
  | getConfig;
