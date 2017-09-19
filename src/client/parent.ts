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
    p.contentWindow.transmogrify(path);
    p.style.display = 'block';
  }

  //console.log('Parent is adjunct', isAdjunct);
  const isChildPath = generateIsExternalPath(isAdjunct);

  function onRoute(path: string) {
    if (isChildPath(path)) {
      //console.log('Should route to child', path);
      routeToChild(p, path);
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

  w.transmogrify = function(path: string) {
    replaceState(path);
    routeTo(path);
  }
  w.updateUrl = replaceState;
  function replaceState(path: string) {
    window.history.replaceState(null, null, path);
  }
}