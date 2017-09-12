import {
  TransmogrifierWindow,
  TransmogrifierPortal
} from '../shared/interfaces';

import app from './app';

export default function bootChild(w: TransmogrifierWindow, p: TransmogrifierPortal, isAdjunct: boolean) {
  console.log('Boot child', isAdjunct);
  app();
}
