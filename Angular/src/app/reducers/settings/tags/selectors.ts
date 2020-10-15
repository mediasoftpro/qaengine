
import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.tags.posts;
export const records = (state: IAppState) => state.tags.records;
export const loading = (state: IAppState) => state.tags.loading;
export const error = (state: IAppState) => state.tags.error;
export const isloaded = (state: IAppState) => state.tags.isloaded;
export const pagination = (state: IAppState) => state.tags.pagination;
export const filteroptions = (state: IAppState) => state.tags.filteroptions;
export const selectall = (state: IAppState) => state.tags.selectall;
export const itemsselected = (state: IAppState) => state.tags.itemsselected;

