import { hrefToName, isAdjunct } from './../shared/shared';

export default function boot() {
  document.addEventListener('click', (e) => {
    const el: Element = e.target as Element;
    if (el.tagName === 'A') {
      const href = el.getAttribute('href');
      if (href) {
        e.preventDefault();
        updateUrl(href);
        routeTo(href);
      }
    }
  });
  
  function routeTo(href: string) {
    const appEl = document.getElementById('app');
    appEl.textContent = hrefToName(href);
  }
  
  interface StateInterface {
    path: string;
    previousPath: string;
  }
  
  function updateUrl(href: string) {
    const state: StateInterface = {
      path: href,
      previousPath: window.location.pathname
    }
    console.log('push state', href);
    window.history.pushState(state, null, href);
  }
}