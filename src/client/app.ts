document.addEventListener('click', (e) => {
  const el: Element = e.target as Element;
  if (el.tagName === 'A') {
    const href = el.getAttribute('href');
    if (href) {
      e.preventDefault();
      navigateTo(href);
    }
  }
});

type RouteName = 'home' | 'foo' | '404';

function hrefToName(href: string): RouteName {
  if (href === '/') {
    return 'home';
  } else if (href === '/foo') {
    return 'foo';
  }
  return '404';
}

function navigateTo(href: string) {
  console.log('Navigate', href);
  window.history.pushState(null, null, href);
  const appEl = document.getElementById('app');
  appEl.textContent = hrefToName(href);
}