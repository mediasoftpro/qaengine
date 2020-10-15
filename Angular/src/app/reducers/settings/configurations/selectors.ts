import { IAppState } from "../../store/model";
export const configurations = (state: IAppState) => state.configurations.configurations;
export const loading = (state: IAppState) => state.configurations.loading;
export const error = (state: IAppState) => state.configurations.error;
export const isloaded = (state: IAppState) => state.configurations.isloaded;
