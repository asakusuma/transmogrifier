import {
  TransmogrifierWindow,
  TransmogrifierPortal
} from '../shared/interfaces';

import {
  default as bootApp
} from './app';
import { 
  generateIsExternalPath
} from './../shared/shared';

export default function bootParent(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  let isActive = true;
  function routeToChild(p: TransmogrifierPortal, path: string) {
    isActive = false;
    p.contentWindow.transmogrify(path, window.location.pathname);
    p.style.display = 'block';
  }

  //console.log('Parent is adjunct', isAdjunct);
  const isChildPath = generateIsExternalPath(isAdjunct);

  function onRoute(path: string) {
    if (isChildPath(path)) {
      //console.log('Should route to child', path);
      routeToChild(p, path);
      return true;
    } else {
      //console.log('from child', path);
      isActive = true;
    }
  }

  function onPop(path: string) {
    isActive = true;
    if (isChildPath(path)) {
      routeToChild(p, path);
    }
  }
  const {
    routeTo,
    updateUrl
  } = bootApp(w, isChildPath, onRoute, onPop);

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
  w.updateUrl = replaceState;

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