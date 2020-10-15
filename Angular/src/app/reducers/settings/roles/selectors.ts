import { IAppState } from "../../store/model";
export const roles = (state: IAppState) => state.roles.roles;
export const objects = (state: IAppState) => state.roles.objects;
export const role_records = (state: IAppState) => state.roles.role_records;
export const object_records = (state: IAppState) => state.roles.object_records;
export const role_permissions = (state: IAppState) => state.roles.role_permissions;
export const loading = (state: IAppState) => state.roles.loading;
export const error = (state: IAppState) => state.roles.error;
export const pagination = (state: IAppState) => state.roles.pagination;
export const role_filteroptions = (state: IAppState) => state.roles.role_filteroptions;
export const object_fileoptions = (state: IAppState) => state.roles.object_fileoptions;
export const selectall = (state: IAppState) => state.roles.selectall;
export const itemsselected = (state: IAppState) => state.roles.itemsselected;
export const isroleloaded = (state: IAppState) => state.roles.isroleloaded;
export const isobjectloaded = (state: IAppState) => state.roles.isobjectloaded;


