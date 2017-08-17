import { TransmogrifierConfig } from './config';

const GLOBAL_CONFIG: TransmogrifierConfig = {
  adjunct: {
    name: 'hobbes',
    paths: new RegExp('^\/?bar')
  }
};

export type RouteName = 'home' | 'foo' | 'bar' | 'baz' | '404';

export function hrefToName(href: string): RouteName {
  if (href === '/') {
    return 'home';
  } else if (href === '/foo') {
    return 'foo';
  } else if (href === '/bar') {
    return 'bar';
  } else if (href === '/baz') {
    return 'baz';
  }
  return '404';
}

// Returns falsy if no adjuct match for path
export function isAdjunct(path: string, config?: TransmogrifierConfig): boolean {
  config = config || GLOBAL_CONFIG;
  const { paths } = config.adjunct;
  if (paths.exec(path)) {
    return true;
  }
}

export const config = GLOBAL_CONFIG;