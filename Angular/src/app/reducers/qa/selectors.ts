import { IAppState } from "../store/model";
export const posts = (state: IAppState) => state.qa.posts;
export const settings = (state: IAppState) => state.qa.settings;
export const records = (state: IAppState) => state.qa.records;
export const loading = (state: IAppState) => state.qa.loading;
export const error = (state: IAppState) => state.qa.error;
export const isloaded = (state: IAppState) => state.qa.isloaded;
export const pagination = (state: IAppState) => state.qa.pagination;
export const filteroptions = (state: IAppState) => state.qa.filteroptions;
export const categories = (state: IAppState) => state.qa.categories;
export const selectall = (state: IAppState) => state.qa.selectall;
export const itemsselected = (state: IAppState) => state.qa.itemsselected;

