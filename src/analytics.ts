const counterId = 113660059;
type Metrika = ((...args: unknown[]) => void) & { a?: unknown[][]; l?: number };
declare global { interface Window { ym?: Metrika } }
let initialized = false;
let previousUrl: string | undefined;

export function trackPageView() {
  // Keep local previews and development visits out of production statistics.
  if (!['untone.site', 'www.untone.site', 'iamuntone-web.github.io'].includes(window.location.hostname)) return;
  if (!initialized) {
    window.ym = window.ym || Object.assign((...args: unknown[]) => {
      (window.ym!.a ||= []).push(args);
    }, { l: Date.now() });
    const src = `https://mc.yandex.ru/metrika/tag.js?id=${counterId}`;
    if (![...document.scripts].some(script => script.src === src)) {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      document.head.appendChild(script);
    }
    window.ym(counterId, 'init', {
      defer: true, ssr: true, webvisor: true, clickmap: true,
      ecommerce: 'dataLayer', accurateTrackBounce: true, trackLinks: true,
      referrer: document.referrer, url: window.location.href,
    });
    initialized = true;
  }
  const url = window.location.href;
  if (url === previousUrl) return;
  window.ym?.(counterId, 'hit', url, {
    title: document.title, referer: previousUrl ?? document.referrer,
  });
  previousUrl = url;
}
