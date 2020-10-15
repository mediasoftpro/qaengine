/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";

export enum CoreAPIAction {
  SHOWMESSAGE = "SHOWMESSAGE",
  NOTIFY = "NOTIFY",
  AUTH_FAILED = "NOTIFY_AUTH_FAILED",
  REFRESHLISTSTATUS = "REFRESHLISTSTATUS",
  TRIGGER_EVENT = "CORE_TRIGGER_EVENT",
  RESETSTATS = "RESET_STATS",
  GLOBAL_LOADER = "CORE_GLOBAL_LOADER"
}

export class toggleLoader implements Action {
  public readonly type = CoreAPIAction.GLOBAL_LOADER;
  constructor(public payload: any) {}
}

export class showMessage implements Action {
  public readonly type = CoreAPIAction.SHOWMESSAGE;
  constructor(public payload: any) {}
}

export class Notify implements Action {
  public readonly type = CoreAPIAction.NOTIFY;
  constructor(public payload: any) {}
}

export class ErrorNotify implements Action {
  public readonly type = CoreAPIAction.AUTH_FAILED;
  constructor(public payload: any) {}
}

export class refreshListStats implements Action {
  public readonly type = CoreAPIAction.REFRESHLISTSTATUS;
  constructor(public payload: any) {}
}

export class resetStats implements Action {
  public readonly type = CoreAPIAction.RESETSTATS;
  constructor(public payload: any) {}
}

export class triggleEvent implements Action {
  public readonly type = CoreAPIAction.TRIGGER_EVENT;
  constructor(public payload: any) {}
}


export type CoreAPIActions =
  | toggleLoader
  | showMessage
  | Notify
  | ErrorNotify
  | refreshListStats
  | resetStats
  | triggleEvent;

