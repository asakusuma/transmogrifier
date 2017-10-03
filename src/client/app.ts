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

  function showLoading() {
    const appEl = document.getElementById('app');
    appEl.innerHTML = '<img src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif" />';
  }

  const app = {
    routeTo,
    updateUrl,
    showLoading
  };

  function internalPop(path: string, state: StateInterface) {
    routeTo(path);
    onPop(path, state, showLoading);
  }

  function internalNavigate(path: string) {
    if (!onRoute(path, showLoading)) {
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