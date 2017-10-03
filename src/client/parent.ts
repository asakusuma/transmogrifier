import {
  ParentWindow,
  TransmogrifierPortal
} from '../shared/interfaces';

import {
  default as bootApp
} from './app';
import { 
  generateIsExternalPath,
  safeTransmogrify
} from './../shared/shared';

import log from './log';

export default function bootParent(w: ParentWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  let isActive = true;
  function routeToChild(p: TransmogrifierPortal, path: string, showLoading: Function) {
    safeTransmogrify(p.contentWindow, path, window.location.pathname, () => {
      showLoading();
    }).then(() => {
      isActive = false;
      p.style.display = 'block';
    }).then(null, function handleFailedTransmogrify(reason) {
      console.error(reason);
    });;
  }

  //console.log('Parent is adjunct', isAdjunct);
  const isChildPath = generateIsExternalPath(isAdjunct);

  function onRoute(path: string, showLoading: Function) {
    if (isChildPath(path)) {
      //console.log('Should route to child', path);
      routeToChild(p, path, showLoading);
      return true;
    } else {
      //console.log('from child', path);
      isActive = true;
    }
  }

  function onPop(path: string, state: any, showLoading: Function) {
    isActive = true;
    if (isChildPath(path)) {
      routeToChild(p, path, showLoading);
    }
  }
  const {
    routeTo
  } = bootApp(w, onRoute, onPop, log);

  w.transmogrify = function(path?: string) {
    if (path) {
      replaceState(path);
      routeTo(path);
    } else {
      setTimeout(() => {
        routeTo(window.location.pathname);
      }, 100);
    }
  }

  w.updateChildUrl = function(path: string) {
    p.style.display = 'block';
    isActive = false;
    replaceState(path);
  }

  function replaceState(path: string) {
    console.log('parent replace', path);
    window.history.replaceState(null, null, path);
  }
}