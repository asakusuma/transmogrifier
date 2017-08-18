import { hrefToName, isAdjunct } from './../shared/shared';

declare var IS_ADJUNCT: boolean;
const portal = document.getElementById('transmogrifier-portal') as HTMLIFrameElement;
(window as any).portal = portal;
(window as any).IS_ACTIVE = true;
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
  if (!isAdjunct(href) && !isParentActive()) {
    exitPortal(href);
  } else if (isAdjunct(href) && isParentActive()) {
    enterPortal(href);
  } else {
    routeTo(href);
  }
});

function navigateTo(href: string) {
  // console.log('Navigate', href);
  if (shouldTransmogrify(href)) {
    if (isChild()) {
      (window.parent as any).exitPortal(href);
    } else {
      enterPortal(href);
    }
  } else {
    routeTo(href);
  }
}

function routeTo(href: string) {
  if (isInactiveParent()) {
    (portal.contentWindow as any).routeTo(href);
  } else {
    const appEl = document.getElementById('app');
    appEl.textContent = hrefToName(href);
  }
}

function enterPortal(href: string) {
  (window as any).IS_ACTIVE = false;
  (portal.contentWindow as any).routeTo(href);
  document.getElementById('transmogrifier-portal').style.display = 'block';
}

function exitPortal(href: string) {
  (window as any).IS_ACTIVE = true;
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
    (window.parent as any).updateUrl(href);
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
  return isChild() ? (window.parent as any).isParentActive() : (window as any).IS_ACTIVE;
}

(window as any).routeTo = routeTo;
(window as any).exitPortal = exitPortal;
(window as any).navigateTo = navigateTo;
(window as any).updateUrl = updateUrl;
(window as any).isParentActive = isParentActive;