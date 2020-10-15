import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.advertisement.posts;
export const records = (state: IAppState) => state.advertisement.records;
export const loading = (state: IAppState) => state.advertisement.loading;
export const error = (state: IAppState) => state.advertisement.error;
export const isloaded = (state: IAppState) => state.advertisement.isloaded;
export const pagination = (state: IAppState) => state.advertisement.pagination;
export const filteroptions = (state: IAppState) => state.advertisement.filteroptions;


