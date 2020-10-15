import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.blockip.posts;
export const records = (state: IAppState) => state.blockip.records;
export const loading = (state: IAppState) => state.blockip.loading;
export const error = (state: IAppState) => state.blockip.error;
export const isloaded = (state: IAppState) => state.blockip.isloaded;
export const pagination = (state: IAppState) => state.blockip.pagination;
export const filteroptions = (state: IAppState) => state.blockip.filteroptions;
export const selectall = (state: IAppState) => state.blockip.selectall;
export const itemsselected = (state: IAppState) => state.blockip.itemsselected;

