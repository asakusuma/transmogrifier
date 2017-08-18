import { hrefToName, isAdjunct } from './../shared/shared';

declare var IS_ADJUNCT: boolean;
const portal = document.getElementById('transmogrifier-portal') as HTMLIFrameElement;
(window as any).portal = portal;
(window as any).IS_ACTIVE = true;
function isChild(): boolean {
  return window.parent !== window;
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

window.addEventListener('popstate', (e: PopStateEvent) => {
  const href = window.location.pathname;
  if (!isChild() && !isParentActive()) {
    exitPortal(href);
  } else {
    navigateTo(href);
  }
});

function navigateTo(href: string) {
  console.log('Navigate', href);
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
  if (isChild()) {
    (window.parent as any).updateUrl(href);
  }
  const appEl = document.getElementById('app');
  appEl.textContent = hrefToName(href);
}

function enterPortal(href: string) {
  console.log('enter');
  (window as any).IS_ACTIVE = false;
  (portal.contentWindow as any).routeTo(href);
  document.getElementById('transmogrifier-portal').style.display = 'block';
}

function exitPortal(href: string) {
  (window as any).IS_ACTIVE = true;
  updateUrl(href);
  routeTo(href);
  document.getElementById('transmogrifier-portal').style.display = 'none';
}

function updateUrl(href: string) {
  window.history.pushState(null, null, href);
}

function isParentActive(): boolean {
  return isChild() ? (window.parent as any).isParentActive() : (window as any).IS_ACTIVE;
}

(window as any).routeTo = routeTo;
(window as any).exitPortal = exitPortal;
(window as any).navigateTo = navigateTo;
(window as any).updateUrl = updateUrl;
(window as any).isParentActive = isParentActive;