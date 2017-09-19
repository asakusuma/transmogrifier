import { TransmogrifierConfig } from './config';

const GLOBAL_CONFIG: TransmogrifierConfig = {
  adjunct: {
    name: 'hobbes',
    paths: new RegExp('^\/?(wizards|nets|cavs)')
  }
};

export type RouteName = string;

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