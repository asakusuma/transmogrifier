import { TransmogrifierConfig } from './config';
import { TransmogrifierWindow } from './interfaces';

const GLOBAL_CONFIG: TransmogrifierConfig = {
  adjunct: {
    name: 'hobbes',
    paths: new RegExp('^\/?(wizards|nets|cavs)')
  }
};

export type RouteName = string;

export function safeTransmogrify(target: TransmogrifierWindow, path: string, previousPath: string): Promise<void> {
  const exec = () => {
    target.transmogrify(path, previousPath);
  }
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('Timeout');
    }, 20000);
    target.addEventListener('load', () => {
      resolve();
    });
    if (target.transmogrify) {
      resolve();
    }
  }).then(exec);
}

export function hrefToName(href: string): RouteName {
  if (href === '/') {
    return 'home';
  }
  return href.substr(1, href.length);
}

// Returns falsy if no adjuct match for path
export function isAdjunct(path: string, config?: TransmogrifierConfig): boolean {
  config = config || GLOBAL_CONFIG;
  const { paths } = config.adjunct;
  if (paths.exec(path)) {
    return true;
  }
}

export function generateIsExternalPath(appIsAdjunct: boolean) {
  return function IsExternalPath(path: string): boolean {
    return Boolean(Number(isAdjunct(path)) ^ Number(appIsAdjunct));
  }
}

export const config = GLOBAL_CONFIG;