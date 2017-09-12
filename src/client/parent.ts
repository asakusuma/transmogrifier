import {
  TransmogrifierWindow,
  TransmogrifierPortal
} from '../shared/interfaces';

import app from './app';

export default function bootParent(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  console.log('Boot parent', isAdjunct);
  app();
}