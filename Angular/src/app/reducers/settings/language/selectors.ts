import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.language.posts;
export const records = (state: IAppState) => state.language.records;
export const loading = (state: IAppState) => state.language.loading;
export const error = (state: IAppState) => state.language.error;
export const isloaded = (state: IAppState) => state.language.isloaded;
export const pagination = (state: IAppState) => state.language.pagination;
export const filteroptions = (state: IAppState) => state.language.filteroptions;
export const selectall = (state: IAppState) => state.language.selectall;
export const itemsselected = (state: IAppState) => state.language.itemsselected;
