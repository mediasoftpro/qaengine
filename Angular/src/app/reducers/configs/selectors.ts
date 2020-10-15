import { IAppState } from "../store/model";
export const configs = (state: IAppState) => state.configuration.configs;
export const settings = (state: IAppState) => state.configuration.selected_value;
export const loading = (state: IAppState) => state.configuration.loading;
export const error = (state: IAppState) => state.configuration.error;
