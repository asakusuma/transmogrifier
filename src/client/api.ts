import { TransmogrifierWindow } from '../shared/interfaces';
export interface AppHooks {
  routeTo: ExecuteRoute;
  updateUrl: UpdateUrlHook;
}

export interface StateInterface {
  path: string;
  previousPath: string;
}

export type RouteHook = (path: string, showLoading: Function) => void | boolean;
export type PopHook = (path: string, state: StateInterface, showLoading: Function) => void;
export type UpdateUrlHook = (path: string, previousPath?: string) => void;
export type ExecuteRoute = (path: string) => void;
export type AppBinder = (w: TransmogrifierWindow, onRoute: RouteHook, onPop: PopHook, log?: Function) => AppHooks;