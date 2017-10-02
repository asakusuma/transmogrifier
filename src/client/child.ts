import {
  ChildWindow,
  TransmogrifierPortal
} from '../shared/interfaces';
import { 
  generateIsExternalPath,
  safeTransmogrify
} from './../shared/shared';

import log from './log';

import bootApp from './app';

function routeToParent(w: ChildWindow, path?: string) {
  w.parent.transmogrify(path, window.location.pathname);
  safeTransmogrify(w.parent, path, window.location.pathname) .then(() => {
    const p = w.frameElement as HTMLFrameElement;
    p.style.display = 'none';
  }).then(null, function handleFailedTransmogrify(reason) {
    console.error(reason);
  });
}


export default function bootChild(w: ChildWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
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
  } = bootApp(w, onRoute, onPop, log);

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
