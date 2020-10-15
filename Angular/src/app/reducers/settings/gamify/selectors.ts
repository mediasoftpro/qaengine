
import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.gamify.posts;
export const filter_posts = (state: IAppState) => state.gamify.filter_posts;
export const records = (state: IAppState) => state.gamify.records;
export const loading = (state: IAppState) => state.gamify.loading;
export const error = (state: IAppState) => state.gamify.error;
export const isloaded = (state: IAppState) => state.gamify.isloaded;
export const pagination = (state: IAppState) => state.gamify.pagination;
export const filteroptions = (state: IAppState) => state.gamify.filteroptions;
export const categories = (state: IAppState) => state.gamify.categories;
export const filter_categories = (state: IAppState) => state.gamify.filter_categories;
export const selectall = (state: IAppState) => state.gamify.selectall;
export const itemsselected = (state: IAppState) => state.gamify.itemsselected;

