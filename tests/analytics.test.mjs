import test from 'node:test';
import assert from 'node:assert/strict';

test('Metrika skips preview and records initial, next and back views once', async () => {
  const calls = [], scripts = [];
  globalThis.window = { location: { hostname: 'localhost', href: 'http://localhost/' }, ym: (...args) => calls.push(args) };
  globalThis.document = { scripts, title: 'Home', referrer: 'https://example.com/', createElement: () => ({}), head: { appendChild: s => scripts.push(s) } };
  const { trackPageView } = await import('../src/analytics.ts');
  trackPageView();
  assert.equal(calls.length, 0);
  window.location = { hostname: 'untone.site', href: 'https://untone.site/' };
  trackPageView(); trackPageView();
  window.location.href = 'https://untone.site/cases/copytarif/';
  document.title = 'Copy'; trackPageView();
  window.location.href = 'https://untone.site/'; trackPageView();
  assert.equal(scripts.length, 1);
  assert.equal(calls.filter(c => c[1] === 'init').length, 1);
  assert.equal(calls[0][2].defer, true);
  const hits = calls.filter(c => c[1] === 'hit');
  assert.equal(hits.length, 3);
  assert.equal(hits[1][3].title, 'Copy');
  assert.equal(hits[1][3].referer, 'https://untone.site/');
  assert.equal(hits[2][3].referer, 'https://untone.site/cases/copytarif/');
});
