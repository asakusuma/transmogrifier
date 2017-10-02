import {
  TransmogrifierWindow,
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

export default function bootParent(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  let isActive = true;
  function routeToChild(p: TransmogrifierPortal, path: string) {
    safeTransmogrify(p.contentWindow, path, window.location.pathname).then(() => {
      isActive = false;
      p.style.display = 'block';
    }).then(null, function handleFailedTransmogrify(reason) {
      console.error(reason);
    });;
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
    routeTo
  } = bootApp(w, isChildPath, onRoute, onPop, log);

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