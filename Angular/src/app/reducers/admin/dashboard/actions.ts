/* -------------------------------------------------------------------------- */
/*                          Product Name: ForumEngine                         */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { Injectable } from "@angular/core";
import { Action } from "@ngrx/store";
import { IDashboard } from "./model";
import { tassign } from "tassign";
import { CoreService } from "../../../admin/core/coreService";


export enum IDashboardAPIAction {
  LOAD_STATS_STARTED = "DASHBOARD_STATS_LOAD_STARTED",
  LOAD_QA_STARTED = "DASHBOARD_QA_LOAD_STARTED",
  LOAD_BLOG_STARTED = "DASHBOARD_BLOG_LOAD_STARTED",
  LOAD_USER_STARTED = "DASHBOARD_USER_LOAD_STARTED",
  LOAD_QA_REPORT_STARTED =
    "DASHBOARD_QA_REPORT_LOAD_STARTED",
  LOAD_BLOG_REPORT_STARTED =
    "DASHBOARD_BLOG_REPORT_LOAD_STARTED",
  LOAD_USER_REPORT_STARTED =
    "DASHBOARD_BLOG_REPORT_LOAD_STARTED",

  LOAD_STATS_SUCCEEDED = "DASHBOARD_STATS_LOAD_SUCCEEDED",
  LOAD_QA_SUCCEEDED = "DASHBOARD_QA_LOAD_SUCCEEDED",
  LOAD_BLOG_SUCCEEDED = "DASHBOARD_BLOG_LOAD_SUCCEEDED",
  LOAD_USER_SUCCEEDED = "DASHBOARD_USER_LOAD_SUCCEEDED",
  LOAD_QA_REPORT_SUCCEEDED =
    "DASHBOARD_QA_REPORT_LOAD_SUCCEEDED",
  LOAD_BLOG_REPORT_SUCCEEDED =
    "DASHBOARD_BLOG_REPORT_LOAD_SUCCEEDED",
  LOAD_USER_REPORT_SUCCEEDED =
    "DASHBOARD_USER_REPORT_LOAD_SUCCEEDED",

  LOAD_STATS_FAILED = "DASHBOARD_STATS_LOAD_FAILED",
  LOAD_QA_FAILED = "DASHBOARD_QA_LOAD_FAILED",
  LOAD_BLOG_FAILED = "DASHBOARD_BLOG_LOAD_FAILED",
  LOAD_USER_FAILED = "DASHBOARD_USER_LOAD_FAILED",
  LOAD_QA_REPORT_FAILED =
    "DASHBOARD_QA_REPORT_LOAD_FAILED",
  LOAD_BLOG_REPORT_FAILED = "DASHBOARD_BLOG_REPORT_LOAD_FAILED",
  LOAD_USER_REPORT_FAILED = "DASHBOARD_USER_REPORT_LOAD_FAILED",
}


export class loadStatsStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_STATS_STARTED;
  constructor(public payload: any) {}
}

export class loadQAStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_STARTED;
  constructor(public payload: any) {}
}

export class loadBlogStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_STARTED;
  constructor(public payload: any) {}
}

export class loadUserStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_STARTED;
  constructor(public payload: any) {}
}

export class loadQAReportStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_REPORT_STARTED;
  constructor(public payload: any) {}
}


export class loadBlogReportStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_REPORT_STARTED;
  constructor(public payload: any) {}
}

export class loadUserReportStarted implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_REPORT_STARTED;
  constructor(public payload: any) {}
}

export class loadStatsSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_STATS_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadQASucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_SUCCEEDED;
  constructor(public payload: any) {}
}


export class loadUserSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadBlogSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadQAReportSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_REPORT_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadBlogReportSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_REPORT_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadUserReportSucceeded implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_REPORT_SUCCEEDED;
  constructor(public payload: any) {}
}

export class loadStatsFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_STATS_FAILED;
  constructor(public payload: any) {}
}

export class loadQAFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_FAILED;
  constructor(public payload: any) {}
}

export class loadUserFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_FAILED;
  constructor(public payload: any) {}
}

export class loadBlogsFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_FAILED;
  constructor(public payload: any) {}
}

export class loadQAReportFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_QA_REPORT_FAILED;
  constructor(public payload: any) {}
}

export class loadBlogReportFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_BLOG_REPORT_FAILED;
  constructor(public payload: any) {}
}

export class loadUserReportFailed implements Action {
  public readonly type = IDashboardAPIAction.LOAD_USER_REPORT_FAILED;
  constructor(public payload: any) {}
}

export type IDashboardAPIActions =
  | loadStatsStarted
  | loadQAStarted
  | loadBlogStarted
  | loadUserStarted
  | loadQAReportStarted
  | loadBlogReportStarted
  | loadUserReportStarted
  | loadStatsSucceeded
  | loadQASucceeded
  | loadUserSucceeded
  | loadBlogSucceeded
  | loadQAReportSucceeded
  | loadUserReportSucceeded
  | loadStatsFailed
  | loadUserFailed
  | loadQAFailed
  | loadBlogsFailed
  | loadQAReportFailed
  | loadBlogReportFailed
  | loadUserReportFailed
  | loadBlogReportSucceeded;

export class DashboardBLL {
  service = new CoreService();
  loadStatsSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      stats: action.payload,
      stats_loading: false,
      isloaded: true,
    });
  }

  loadQASucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      qa: action.payload.posts,
      qa_loading: false,
      isloaded: true,
    });
  }


  loadBlogsSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      blogs: action.payload.posts,
      blog_loading: false,
      isloaded: true,
    });
  }

  loadUsersSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      users: action.payload.posts,
      user_loading: false,
      isloaded: true,
    });
  }

  loadQAReportsSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      qa_report: Object.assign({}, state.qa_report, action.payload),
      qa_report_loading: false,
      is_qa_report_loaded: true,
    });
  }

  loadBlogReportsSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      blog_report: Object.assign({}, state.blog_report, action.payload),
      blog_report_loading: false,
      is_blog_report_loaded: true,
    });
  }

  loadUserReportsSucceeded(state: IDashboard, action: any) {
    return tassign(state, {
      user_report: Object.assign({}, state.user_report, action.payload),
      user_report_loading: false,
      is_user_report_loaded: true,
    });
  }
}
