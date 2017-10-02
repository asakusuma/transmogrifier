import { TransmogrifierWindow } from '../shared/interfaces';
export interface AppHooks {
  routeTo: RouteHook;
  updateUrl: UpdateUrlHook;
}

export interface StateInterface {
  path: string;
  previousPath: string;
}

export type RouteHook = (path: string) => void | boolean;
export type PopHook = (path: string, state: StateInterface) => void;
export type UpdateUrlHook = (path: string, previousPath?: string) => void;
export type AppBinder = (w: TransmogrifierWindow, onRoute: RouteHook, onPop: PopHook, log?: Function) => AppHooks;