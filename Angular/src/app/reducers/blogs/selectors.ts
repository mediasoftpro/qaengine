import { IAppState } from "../store/model";
export const posts = (state: IAppState) => state.blogs.posts;
export const settings = (state: IAppState) => state.blogs.settings;
export const records = (state: IAppState) => state.blogs.records;
export const loading = (state: IAppState) => state.blogs.loading;
export const error = (state: IAppState) => state.blogs.error;
export const isloaded = (state: IAppState) => state.blogs.isloaded;
export const pagination = (state: IAppState) => state.blogs.pagination;
export const filteroptions = (state: IAppState) => state.blogs.filteroptions;
export const categories = (state: IAppState) => state.blogs.categories;
export const selectall = (state: IAppState) => state.blogs.selectall;
export const itemsselected = (state: IAppState) => state.blogs.itemsselected;

