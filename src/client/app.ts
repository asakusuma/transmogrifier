import { hrefToName } from './../shared/shared';

document.addEventListener('click', (e) => {
  const el: Element = e.target as Element;
  if (el.tagName === 'A') {
    const href = el.getAttribute('href');
    if (href) {
      e.preventDefault();
      window.history.pushState(null, null, href);
      navigateTo(href);
    }
  }
});

window.addEventListener('popstate', (e: PopStateEvent) => {
  navigateTo(window.location.pathname);
});

function navigateTo(href: string) {
  console.log('Navigate', href);
  const appEl = document.getElementById('app');
  appEl.textContent = hrefToName(href);
}