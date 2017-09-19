import { hrefToName } from './../shared/shared';
import { TransmogrifierWindow } from '../shared/interfaces';

export type RouteHook = (path: string) => void;
export type HandleHook = (path: string) => boolean;

export interface AppHooks {
  routeTo: RouteHook;
  updateUrl: RouteHook;
}

export default function boot(w: TransmogrifierWindow, shouldYieldPath: HandleHook, onRoute: RouteHook, onPop: RouteHook): AppHooks {
  document.addEventListener('click', (e) => {
    const el: Element = e.target as Element;
    if (el.tagName === 'A') {
      const href = el.getAttribute('href');
      if (href) {
        e.preventDefault();
        internalNavigate(href);
      }
    }
  });

  window.addEventListener('popstate', (e: PopStateEvent) => {
    const href = window.location.pathname;
    internalPop(href);
  });
  
  function routeTo(href: string) {
    const appEl = document.getElementById('app');
    appEl.textContent = hrefToName(href);
  }

  const app = {
    routeTo,
    updateUrl
  };

  function internalPop(path?: string) {
    routeTo(path);
    onPop(path);
  }

  function internalNavigate(path: string) {
    updateUrl(path);
    routeTo(path);
    onRoute(path);
  }
  
  interface StateInterface {
    path: string;
    previousPath: string;
  }
  
  function updateUrl(href: string) {
    const state: StateInterface = {
      path: href,
      previousPath: window.location.pathname
    }
    console.log('push', href);
    window.history.pushState(state, null, href);
  }

  return app;
}