import {
  TransmogrifierWindow,
  TransmogrifierPortal
} from '../shared/interfaces';
import { 
  generateIsExternalPath
} from './../shared/shared';

import log from './log';

import bootApp from './app';

function routeToParent(w: TransmogrifierWindow, path?: string) {
  const p = w.frameElement as HTMLFrameElement;
  p.style.display = 'none';
  w.parent.transmogrify(path, window.location.pathname);
}


export default function bootChild(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  const isParentPath = generateIsExternalPath(isAdjunct);

  function onRoute(path: string) {
    if (isParentPath(path)) {
      routeToParent(w, path);
    } else {
      w.parent.updateChildUrl(path);
    }
  }

  function onPop(path: string, state: any) {
    if (isParentPath(path)) {
      routeToParent(w, state ? path : null);
    } else {
      w.parent.updateChildUrl(path);
    }
  }

  const {
    routeTo,
    updateUrl
  } = bootApp(w, isParentPath, onRoute, onPop, log);

  w.transmogrify = function(path: string, previousPath: string) {
    console.log('child replace', previousPath);
    window.history.replaceState({
      previousPath
    }, null, previousPath);
    routeTo(path);
    updateUrl(path, previousPath);
    w.parent.updateChildUrl(path);
  }
}
