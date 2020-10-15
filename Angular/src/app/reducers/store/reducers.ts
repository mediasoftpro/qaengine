/* -------------------------------------------------------------------------- */
/*                     Product Name: jMedia Core Framework                    */
/*                      Author: Mediasoftpro (Muhammad Irfan)                 */
/*                       Email: support@mediasoftpro.com                      */
/*       License: Read license.txt located on root of your application.       */
/*                     Copyright 2007 - 2020 @Mediasoftpro                    */
/* -------------------------------------------------------------------------- */

import { ActionReducerMap } from "@ngrx/store";
import { routerReducer } from "@ngrx/router-store";
import { IAppState } from "./model";

import { dashboardReducer } from "../admin/dashboard/reducer";
import { qaReducer } from "../qa/reducer";
import { configReducer } from "../configs/reducer";
import { userReducer } from "../users/reducer";
import { coreReducer } from "../core/reducer";
import { advertisementReducer } from "../settings/advertisements/reducer";
import { blockipReducer } from "../settings/blockip/reducer";
import { categoryReducer } from "../settings/categories/reducer";
import { configurationsReducer } from "../settings/configurations/reducer";
import { dictionaryReducer } from "../settings/dictionary/reducer";
import { languageReducer } from "../settings/language/reducer";
import { logReducer } from "../settings/log/reducer";
import { mailtemplateReducer } from "../settings/mailtemplates/reducer";
import { tagsReducer } from "../settings/tags/reducer";
import { roleReducer } from "../settings/roles/reducer";
import { gamifyReducer } from "../settings/gamify/reducer";
import { abuseReportReducer } from "../reports/abuse/reducer";
import { blogReducer } from "../blogs/reducer";

// myaccount reducers
import { accountPackagesReducer } from "../account/packages/reducer";
import { accountHistoryReducer } from "../account/history/reducer";

export const appReducers: ActionReducerMap<IAppState, any> = {
    dashboard: dashboardReducer,
    qa: qaReducer,
    blogs: blogReducer,
    configuration: configReducer,
    users: userReducer,
    core: coreReducer,
    advertisement: advertisementReducer,
    blockip: blockipReducer,
    categories: categoryReducer,
    configurations: configurationsReducer,
    dictionary: dictionaryReducer,
    language: languageReducer,
    log: logReducer,
    mailtemplates: mailtemplateReducer,
    tags: tagsReducer,
    roles: roleReducer,
    gamify: gamifyReducer,
    abuse: abuseReportReducer,
    accountpackages: accountPackagesReducer,
    accounthistory: accountHistoryReducer,
    router: routerReducer
}
