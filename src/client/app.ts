import { hrefToName, isAdjunct } from './../shared/shared';

interface TransmogrifierPortal extends HTMLIFrameElement {
  contentWindow: TransmogrifierWindow;
}

interface TransmogrifierWindow extends Window {
  parent: TransmogrifierWindow;
  portal: TransmogrifierPortal;
  IS_ACTIVE: boolean;
  routeTo: (href: string) => void;
  exitPortal: (href: string) => void;
  navigateTo: (href: string) => void;
  updateUrl: (href: string) => void;
  isParentActive: () => boolean;
}

declare var IS_ADJUNCT: boolean;
declare var window: TransmogrifierWindow;

const portal = document.getElementById('transmogrifier-portal') as TransmogrifierPortal;
window.portal = portal;
window.IS_ACTIVE = true;
function isChild(): boolean {
  return window.parent !== window;
}

function isInactiveParent() {
  return !isChild() && !isParentActive();
}

function shouldTransmogrify(path: string): boolean {
  return !!(Number(isAdjunct(path)) ^ Number(IS_ADJUNCT));
}

document.addEventListener('click', (e) => {
  const el: Element = e.target as Element;
  if (el.tagName === 'A') {
    const href = el.getAttribute('href');
    if (href) {
      e.preventDefault();
      updateUrl(href)
      navigateTo(href);
    }
  }
});


// popstate should 
window.addEventListener('popstate', (e: PopStateEvent) => {
  const href = window.location.pathname;
  //const state = e.state as StateInterface;
  if (!shouldTransmogrify(href) && !isParentActive()) {
    exitPortal(href);
  } else if (shouldTransmogrify(href) && isParentActive()) {
    enterPortal(href);
  } else {
    routeTo(href);
  }
});

function navigateTo(href: string) {
  // console.log('Navigate', href);
  if (shouldTransmogrify(href)) {
    if (isChild()) {
      window.parent.exitPortal(href);
    } else {
      enterPortal(href);
    }
  } else {
    routeTo(href);
  }
}

function routeTo(href: string) {
  if (isInactiveParent()) {
    portal.contentWindow.routeTo(href);
  } else {
    const appEl = document.getElementById('app');
    appEl.textContent = hrefToName(href);
  }
}

function enterPortal(href: string) {
  window.IS_ACTIVE = false;
  portal.contentWindow.routeTo(href);
  document.getElementById('transmogrifier-portal').style.display = 'block';
}

function exitPortal(href: string) {
  window.IS_ACTIVE = true;
  routeTo(href);
  document.getElementById('transmogrifier-portal').style.display = 'none';
}

interface StateInterface {
  path: string;
  previousPath: string;
  fromAdjunct: boolean;
}

function updateUrl(href: string) {
  if (isChild()) {
    window.parent.updateUrl(href);
  } else {
    const state: StateInterface = {
      path: href,
      previousPath: window.location.pathname,
      fromAdjunct: IS_ADJUNCT
    }
    console.log('push state', href);
    window.history.pushState(state, null, href);
  }
}

function isParentActive(): boolean {
  return isChild() ? window.parent.isParentActive() : window.IS_ACTIVE;
}

window.routeTo = routeTo;
window.exitPortal = exitPortal;
window.navigateTo = navigateTo;
window.updateUrl = updateUrl;
window.isParentActive = isParentActive;