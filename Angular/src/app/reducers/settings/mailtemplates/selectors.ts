import { IAppState } from "../../store/model";
export const posts = (state: IAppState) => state.mailtemplates.posts;
export const records = (state: IAppState) => state.mailtemplates.records;
export const loading = (state: IAppState) => state.mailtemplates.loading;
export const error = (state: IAppState) => state.mailtemplates.error;
export const isloaded = (state: IAppState) => state.mailtemplates.isloaded;
export const pagination = (state: IAppState) => state.mailtemplates.pagination;
export const filteroptions = (state: IAppState) => state.mailtemplates.filteroptions;
export const selectall = (state: IAppState) => state.mailtemplates.selectall;
export const itemsselected = (state: IAppState) => state.mailtemplates.itemsselected;