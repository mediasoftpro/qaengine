import { IAppState } from "../store/model";
export const posts = (state: IAppState) => state.users.posts;
export const auth = (state: IAppState) => state.users.auth;
export const records = (state: IAppState) => state.users.records;
export const loading = (state: IAppState) => state.users.loading;
export const error = (state: IAppState) => state.users.error;
export const isloaded = (state: IAppState) => state.users.isloaded;
export const pagination = (state: IAppState) => state.users.pagination;
export const filteroptions = (state: IAppState) => state.users.filteroptions;
export const selectall = (state: IAppState) => state.users.selectall;
export const itemsselected = (state: IAppState) => state.users.itemsselected;



