import assert from 'node:assert/strict';
import test from 'node:test';
import worker, { filterAndLimitPosts, getExcludedPostIds } from '../instagram-feed-worker/src/index.ts';

const excludedIds = ['17952797223319805', '18071758166783635', '18159668395459796'];

function media(id, timestamp, overrides = {}) {
  return {
    id,
    media_type: 'IMAGE',
    media_url: `https://cdninstagram.example/${id}.jpg`,
    permalink: `https://www.instagram.com/p/${id}/`,
    caption: `Post ${id}`,
    timestamp,
    ...overrides,
  };
}

test('exclusion IDs are always present and can be extended by configuration', () => {
  const configured = getExcludedPostIds('extra-one, extra-two,,');

  for (const id of excludedIds) assert.equal(configured.has(id), true);
  assert.equal(configured.has('extra-one'), true);
  assert.equal(configured.has('extra-two'), true);
  assert.equal(configured.has(''), false);
});

test('filters excluded posts before taking six and sorts newest first', () => {
  const mediaItems = [
    media('post-4', '2026-11-01T10:00:00+0000'),
    media(excludedIds[0], '2026-11-05T10:00:00+0000'),
    media('post-1', '2026-11-04T10:00:00+0000'),
    media(excludedIds[1], '2026-11-05T09:00:00+0000'),
    media('post-6', '2026-10-30T10:00:00+0000'),
    media('post-2', '2026-11-03T10:00:00+0000'),
    media(excludedIds[2], '2026-11-05T08:00:00+0000'),
    media('post-5', '2026-10-31T10:00:00+0000'),
    media('post-3', '2026-11-02T10:00:00+0000'),
  ];

  const posts = filterAndLimitPosts(mediaItems, getExcludedPostIds(), 6);

  assert.deepEqual(posts.map((post) => post.id), ['post-1', 'post-2', 'post-3', 'post-4', 'post-5', 'post-6']);
  assert.equal(posts.length, 6);
  assert.equal(posts.some((post) => excludedIds.includes(post.id)), false);
});

test('filters videos before taking six and keeps photo carousels', () => {
  const mediaItems = [
    media('newest-video', '2026-11-06T12:00:00Z', { media_type: 'VIDEO' }),
    media('next-video', '2026-11-06T11:00:00Z', { media_type: 'REELS' }),
    media('post-1', '2026-11-06T10:00:00Z'),
    media('carousel', '2026-11-06T09:00:00Z', {
      media_type: 'CAROUSEL_ALBUM',
      media_url: undefined,
      children: { data: [{ media_url: 'https://cdninstagram.example/first-slide.jpg' }] },
    }),
    media('post-2', '2026-11-06T08:00:00Z'),
    media('post-3', '2026-11-06T07:00:00Z'),
    media('post-4', '2026-11-06T06:00:00Z'),
    media('post-5', '2026-11-06T05:00:00Z'),
    media('post-6', '2026-11-06T04:00:00Z'),
  ];

  const posts = filterAndLimitPosts(mediaItems, getExcludedPostIds(), 6);

  assert.deepEqual(posts.map((post) => post.id), ['post-1', 'carousel', 'post-2', 'post-3', 'post-4', 'post-5']);
  assert.equal(posts.some((post) => ['VIDEO', 'REELS'].includes(post.mediaType)), false);
  assert.equal(posts.find((post) => post.id === 'carousel')?.mediaType, 'CAROUSEL_ALBUM');
});

test('returns fewer than six valid posts without throwing', () => {
  const posts = filterAndLimitPosts(
    [media('post-1', '2026-11-01T10:00:00+0000'), media(excludedIds[0], '2026-11-02T10:00:00+0000')],
    getExcludedPostIds(),
    6,
  );

  assert.deepEqual(posts.map((post) => post.id), ['post-1']);
});

test('uses the first carousel item as its preview and keeps the post link', () => {
  const posts = filterAndLimitPosts(
    [media('carousel', '2026-11-01T10:00:00+0000', {
      media_type: 'CAROUSEL_ALBUM',
      media_url: undefined,
      children: { data: [{ media_url: 'https://cdninstagram.example/first-slide.jpg' }] },
    })],
    getExcludedPostIds(),
    6,
  );

  assert.equal(posts[0].mediaType, 'CAROUSEL_ALBUM');
  assert.equal(posts[0].mediaUrl, 'https://cdninstagram.example/first-slide.jpg');
  assert.equal(posts[0].permalink, 'https://www.instagram.com/p/carousel/');
});

test('keeps Meta failures generic, logs safe diagnostics, and does not cache 503 responses', async () => {
  const cachesDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  const originalFetch = globalThis.fetch;
  const originalConsoleError = console.error;
  const diagnosticLogs = [];

  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    writable: true,
    value: { default: { match: async () => undefined } },
  });
  globalThis.fetch = async () => new Response(JSON.stringify({
    error: {
      message: 'Bearer should-never-be-logged invalid token',
      type: 'OAuthException',
      code: 190,
      error_subcode: 463,
      is_transient: false,
      fbtrace_id: 'meta-trace-123',
    },
  }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  console.error = (...values) => diagnosticLogs.push(values.join(' '));

  try {
    const env = {
      INSTAGRAM_ACCESS_TOKEN: 'test-token-value',
      INSTAGRAM_USER_ID: 'test-account',
      INSTAGRAM_API_VERSION: 'v27.0',
      ALLOWED_ORIGINS: 'http://localhost:4322',
    };
    const response = await worker.fetch(new Request('https://worker.example/api/instagram-feed?limit=6', {
      headers: { Origin: 'http://localhost:4322' },
    }), env);
    const diagnostics = diagnosticLogs.join('\n');

    assert.equal(response.status, 503);
    assert.equal(response.headers.get('Cache-Control'), 'no-store');
    assert.equal(response.headers.get('Access-Control-Allow-Origin'), 'http://localhost:4322');
    assert.deepEqual(await response.json(), { error: 'instagram_feed_unavailable' });
    assert.match(diagnostics, /instagram_graph_http_error/);
    assert.match(diagnostics, /"httpStatus":400/);
    assert.match(diagnostics, /"errorCode":190/);
    assert.match(diagnostics, /"errorSubcode":463/);
    assert.match(diagnostics, /meta-trace-123/);
    assert.match(diagnostics, /Bearer \[redacted\]/);
    assert.doesNotMatch(diagnostics, /should-never-be-logged|test-token-value/);
  } finally {
    globalThis.fetch = originalFetch;
    console.error = originalConsoleError;
    if (cachesDescriptor) Object.defineProperty(globalThis, 'caches', cachesDescriptor);
    else delete globalThis.caches;
  }
});

test('caches the feed for 900 seconds and applies CORS per request origin', async () => {
  const cachesDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'caches');
  const originalFetch = globalThis.fetch;
  let now = Date.parse('2026-11-05T12:00:00Z');
  let metaCalls = 0;
  const cacheEntries = new Map();
  const cacheVersions = [];
  const cache = {
    async match(request) {
      cacheVersions.push(new URL(request.url).searchParams.get('version'));
      const entry = cacheEntries.get(request.url);
      if (!entry || entry.expiresAt <= now) {
        cacheEntries.delete(request.url);
        return undefined;
      }
      return new Response(entry.body, { headers: entry.headers });
    },
    async put(request, response) {
      const body = await response.text();
      const maxAge = Number(response.headers.get('Cache-Control')?.match(/max-age=(\d+)/)?.[1] || 0);
      cacheEntries.set(request.url, {
        body,
        headers: response.headers,
        expiresAt: now + maxAge * 1000,
      });
    },
  };

  Object.defineProperty(globalThis, 'caches', {
    configurable: true,
    writable: true,
    value: { default: cache },
  });
  globalThis.fetch = async (input, init) => {
    metaCalls += 1;
    const apiUrl = new URL(input);
    assert.equal(apiUrl.searchParams.get('limit'), '20');
    assert.equal(new Headers(init?.headers).get('Authorization'), 'Bearer test-token');
    return new Response(JSON.stringify({
      data: [media('cached-post', '2026-11-05T10:00:00Z')],
    }), { headers: { 'Content-Type': 'application/json' } });
  };

  try {
    const env = {
      INSTAGRAM_ACCESS_TOKEN: 'test-token',
      INSTAGRAM_USER_ID: 'test-account',
      INSTAGRAM_API_VERSION: 'v27.0',
      ALLOWED_ORIGINS: 'http://localhost:4322,http://127.0.0.1:4322',
    };
    const request = (origin) => new Request('https://worker.example/api/instagram-feed?limit=6', {
      headers: { Origin: origin },
    });

    const firstResponse = await worker.fetch(request('http://localhost:4322'), env);
    const firstBody = await firstResponse.json();
    assert.equal(firstResponse.headers.get('Cache-Control'), 'public, max-age=900');
    assert.equal(firstResponse.headers.get('Access-Control-Allow-Origin'), 'http://localhost:4322');
    assert.deepEqual(cacheVersions, ['3']);
    assert.deepEqual(firstBody.posts.map((post) => post.id), ['cached-post']);
    assert.equal(metaCalls, 1);

    now += 899_999;
    const cachedResponse = await worker.fetch(request('http://127.0.0.1:4322'), env);
    assert.equal(cachedResponse.headers.get('Access-Control-Allow-Origin'), 'http://127.0.0.1:4322');
    assert.deepEqual(cacheVersions, ['3', '3']);
    assert.equal((await cachedResponse.json()).posts.length, 1);
    assert.equal(metaCalls, 1);

    now += 1;
    const expiredResponse = await worker.fetch(request('http://localhost:4322'), env);
    assert.equal(expiredResponse.status, 200);
    assert.equal(metaCalls, 2);
  } finally {
    globalThis.fetch = originalFetch;
    if (cachesDescriptor) Object.defineProperty(globalThis, 'caches', cachesDescriptor);
    else delete globalThis.caches;
  }
});
