import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import ts from 'typescript';

const componentSource = await readFile(new URL('../src/components/InstagramFeed.astro', import.meta.url), 'utf8');
const componentScript = componentSource.match(/<script>\s*([\s\S]*?)\s*<\/script>/)?.[1];
assert.ok(componentScript, 'InstagramFeed.astro should contain its client script');

const executableScript = ts.transpileModule(componentScript, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

class FakeElement {
  constructor(tagName = 'section') {
    this.tagName = tagName;
    this.dataset = {};
    this.children = [];
    this.attributes = {};
    this.listeners = new Map();
    this.hidden = false;
  }

  append(...elements) {
    this.children.push(...elements);
  }

  replaceChildren(...elements) {
    this.children = elements;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  addEventListener(name, handler) {
    this.listeners.set(name, handler);
  }

  dispatch(name) {
    this.listeners.get(name)?.();
  }
}

function mountFeed(fetchImpl) {
  const status = new FakeElement('p');
  status.textContent = 'Cargando publicaciones de Instagram…';
  const grid = new FakeElement('div');
  const section = new FakeElement();
  section.dataset.feedUrl = 'https://worker.example/api/instagram-feed';
  section.querySelector = (selector) => ({
    '[data-feed-status]': status,
    '[data-feed-grid]': grid,
  })[selector] || null;

  const document = {
    querySelectorAll: () => [section],
    createElement: (tagName) => new FakeElement(tagName),
  };

  new Function('document', 'fetch', 'Intl', executableScript)(document, fetchImpl, Intl);
  return { status, grid };
}

async function flushPromises() {
  await Promise.resolve();
  await new Promise((resolve) => setImmediate(resolve));
}

const post = {
  id: 'post-1',
  mediaType: 'CAROUSEL_ALBUM',
  mediaUrl: 'https://cdninstagram.example/post-1.jpg',
  permalink: 'https://www.instagram.com/p/post-1/',
  caption: 'Actividad escolar',
  timestamp: '2026-11-05T10:00:00Z',
};

const videoPost = {
  ...post,
  id: 'video-1',
  mediaType: 'VIDEO',
  mediaUrl: 'https://cdninstagram.example/video-1.mp4',
  permalink: 'https://www.instagram.com/reel/video-1/',
};

test('keeps the loading message until the feed response is ready', async () => {
  let resolveFetch;
  const pendingFetch = new Promise((resolve) => { resolveFetch = resolve; });
  const { status, grid } = mountFeed(() => pendingFetch);

  assert.equal(status.textContent, 'Cargando publicaciones de Instagram…');
  assert.equal(grid.children.length, 0);

  resolveFetch({ ok: true, json: async () => ({ posts: [post] }) });
  await flushPromises();

  assert.equal(status.hidden, true);
  assert.equal(grid.children.length, 1);
});

test('shows the Instagram fallback when the feed request fails', async () => {
  const { status, grid } = mountFeed(() => Promise.reject(new Error('network unavailable')));
  await flushPromises();

  assert.equal(status.hidden, false);
  assert.equal(status.textContent, 'No pudimos cargar las publicaciones ahora. Puedes verlas directamente en Instagram.');
  assert.equal(grid.children.length, 0);
});

test('shows the empty-state message when no posts are available', async () => {
  const { status, grid } = mountFeed(() => Promise.resolve({ ok: true, json: async () => ({ posts: [] }) }));
  await flushPromises();

  assert.equal(status.hidden, false);
  assert.equal(status.textContent, 'Aún no hay publicaciones disponibles. Visita Instagram para ver las novedades.');
  assert.equal(grid.children.length, 0);
});

test('does not render videos even if the feed endpoint includes them', async () => {
  const { status, grid } = mountFeed(() => Promise.resolve({
    ok: true,
    json: async () => ({ posts: [videoPost, post] }),
  }));
  await flushPromises();

  assert.equal(status.hidden, true);
  assert.equal(grid.children.length, 1);
  assert.equal(grid.children[0].href, '/instagram/publicacion/?id=post-1');
});

test('links each post to its internal article and shows a fallback when its preview fails', async () => {
  const { status, grid } = mountFeed(() => Promise.resolve({ ok: true, json: async () => ({ posts: [post] }) }));
  await flushPromises();

  const [card] = grid.children;
  const [mediaFrame, content] = card.children;
  const [image, imageFallback] = mediaFrame.children;
  assert.equal(status.hidden, true);
  assert.equal(card.href, '/instagram/publicacion/?id=post-1');
  assert.equal(content.children[1].textContent, post.caption);
  assert.equal(image.src, post.mediaUrl);
  assert.equal(image.alt, post.caption);
  assert.equal(image.loading, 'lazy');

  image.dispatch('error');

  assert.equal(image.hidden, true);
  assert.equal(imageFallback.hidden, false);
  assert.equal(imageFallback.textContent, 'Vista previa no disponible');
});
