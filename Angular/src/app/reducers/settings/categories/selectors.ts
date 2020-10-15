import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.categories.posts;
export const dropdown_categories = (state: IAppState) => state.categories.dropdown_categories;
export const records = (state: IAppState) => state.categories.records;
export const loading = (state: IAppState) => state.categories.loading;
export const error = (state: IAppState) => state.categories.error;
export const isloaded = (state: IAppState) => state.categories.isloaded;
export const pagination = (state: IAppState) => state.categories.pagination;
export const filteroptions = (state: IAppState) => state.categories.filteroptions;
export const selectall = (state: IAppState) => state.categories.selectall;
export const itemsselected = (state: IAppState) => state.categories.itemsselected;

