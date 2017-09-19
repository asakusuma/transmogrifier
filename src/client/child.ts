import {
  TransmogrifierWindow,
  TransmogrifierPortal
} from '../shared/interfaces';
import { 
  generateIsExternalPath
} from './../shared/shared';

import bootApp from './app';

function routeToParent(w: TransmogrifierWindow, path: string) {
  const p = w.frameElement as HTMLFrameElement;
  p.style.display = 'none';
  w.parent.transmogrify(path);
}

export default function bootChild(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  const isParentPath = generateIsExternalPath(isAdjunct);

  function onRoute(path: string) {
    if (isParentPath(path)) {
      console.log('Should route to parent', path);
      routeToParent(w, path);
    } else {
      w.parent.updateUrl(path);
    }
  }

  function onPop(path: string) {
    console.log('pop', path);
  }

  const {
    routeTo,
    updateUrl
  } = bootApp(w, isParentPath, onRoute, onPop);

  w.transmogrify = function(path: string) {
    routeTo(path);
  }
}
