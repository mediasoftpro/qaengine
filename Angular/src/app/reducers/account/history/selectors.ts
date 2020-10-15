import { IAppState } from "../../store/model";

export const historyList = (state: IAppState) => state.accounthistory.posts;
export const loading = (state: IAppState) => state.accounthistory.loading;
export const error = (state: IAppState) => state.accounthistory.error;
export const isloaded = (state: IAppState) => state.accounthistory.isloaded;
