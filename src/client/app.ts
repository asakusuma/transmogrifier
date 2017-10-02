import { hrefToName } from './../shared/shared';
import { TransmogrifierWindow } from '../shared/interfaces';
import {
  RouteHook,
  PopHook,
  AppHooks,
  AppBinder,
  StateInterface
} from './api';

const boot: AppBinder = function bootExampleApp(w: TransmogrifierWindow, onRoute: RouteHook, onPop: PopHook, log: Function): AppHooks {
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
    log('pop', href, e.state);
    internalPop(href, e.state);
  });
  
  function routeTo(href: string) {
    const appEl = document.getElementById('app');
    appEl.textContent = hrefToName(href);
  }

  const app = {
    routeTo,
    updateUrl
  };

  function internalPop(path: string, state: StateInterface) {
    routeTo(path);
    onPop(path, state);
  }

  function internalNavigate(path: string) {
    if (!onRoute(path)) {
      updateUrl(path);
      routeTo(path);
    }
  }
  
  function updateUrl(href: string, previousPath?: string) {
    const state: StateInterface = {
      path: href,
      previousPath: previousPath || window.location.pathname
    }
    log('push', href);
    window.history.pushState(state, null, href);
  }

  return app;
}

export default boot;