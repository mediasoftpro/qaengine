// import { createSelector } from "@ngrx/store";
import { IAppState } from "../store/model";

export const notify = (state: IAppState) => state.core.notify;
export const message = (state: IAppState) => state.core.message;
export const auth_failed = (state: IAppState) => state.core.auth_failed;
export const liststats = (state: IAppState) => state.core.liststats;
export const event = (state: IAppState) => state.core.event;
export const loader = (state: IAppState) => state.core.loader;

