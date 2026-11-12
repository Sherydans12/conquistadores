interface Env {
  INSTAGRAM_ACCESS_TOKEN: string;
  INSTAGRAM_USER_ID: string;
  INSTAGRAM_API_VERSION: string;
  ALLOWED_ORIGINS: string;
  INSTAGRAM_EXCLUDED_POST_IDS?: string;
  INSTAGRAM_FEED_ARCHIVE?: FeedArchiveKV;
  INSTAGRAM_MEDIA_ARCHIVE?: MediaArchiveBucket;
}

interface FeedArchiveKV {
  get(key: string, type: 'json'): Promise<unknown>;
  put(key: string, value: string): Promise<void>;
}

interface MediaArchiveObject {
  body: ReadableStream<Uint8Array>;
  httpMetadata?: { contentType?: string };
}

interface MediaArchiveBucket {
  get(key: string): Promise<MediaArchiveObject | null>;
  put(
    key: string,
    value: ArrayBuffer,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
}

interface InstagramMedia {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: { data?: Array<{ media_type?: string; media_url?: string; thumbnail_url?: string }> };
}

interface InstagramMediaResponse {
  data?: InstagramMedia[];
  error?: {
    message?: string;
    type?: string;
    code?: number;
    error_subcode?: number;
    is_transient?: boolean;
    fbtrace_id?: string;
  };
}

export interface FeedPost {
  id: string;
  mediaType: string;
  mediaUrl: string;
  mediaUrls?: string[];
  permalink: string;
  caption?: string;
  timestamp?: string;
}

const CACHE_TTL_SECONDS = 900;
const FEED_PATH = '/api/instagram-feed';
const ARCHIVE_PATH = '/api/instagram-archive';
const MEDIA_PATH = '/api/instagram-media/';
const ARCHIVE_KEY = 'instagram-posts-v1';
const META_MEDIA_FETCH_LIMIT = 20;
const EXCLUDED_MEDIA_TYPES = new Set(['VIDEO', 'REELS']);
const DEFAULT_EXCLUDED_POST_IDS = [
  '17952797223319805',
  '18071758166783635',
  '18159668395459796',
];

function allowedOrigin(origin: string | null, env: Env): string | null {
  if (!origin) return null;
  const origins = env.ALLOWED_ORIGINS.split(',').map((value) => value.trim());
  return origins.includes(origin) ? origin : null;
}

function json(body: unknown, status = 200, origin: string | null = null): Response {
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': status >= 500 ? 'no-store' : `public, max-age=${CACHE_TTL_SECONDS}`,
    'X-Content-Type-Options': 'nosniff',
    Vary: 'Origin',
  });

  if (origin) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Accept');
  }

  return new Response(JSON.stringify(body), { status, headers });
}

function safeDiagnosticText(value: string): string {
  return value
    .replace(/\bBearer\s+\S+/gi, 'Bearer [redacted]')
    .replace(/([?&](?:access_token|token)=)[^&\s]+/gi, '$1[redacted]')
    .replace(/\b(access[_\s-]*token|token)\s*[:=]\s*([^\s,;&]+)/gi, '$1=[redacted]')
    .slice(0, 240);
}

function diagnosticErrorName(error: unknown): string {
  return error instanceof Error ? error.name : 'UnknownError';
}

function cacheKey(path: string, variant: string): Request {
  return new Request(`https://instagram-feed-cache.invalid${path}?version=5&variant=${encodeURIComponent(variant)}`);
}

function allowedMediaUrl(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function allowedPermalink(value: string | undefined): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && (url.hostname === 'instagram.com' || url.hostname === 'www.instagram.com')
      ? url.toString()
      : null;
  } catch {
    return null;
  }
}

function isFeedPost(value: unknown): value is FeedPost {
  if (!value || typeof value !== 'object') return false;
  const post = value as FeedPost;
  return typeof post.id === 'string' &&
    typeof post.mediaType === 'string' &&
    typeof post.mediaUrl === 'string' &&
    /^https:\/\//i.test(post.mediaUrl) &&
    typeof post.permalink === 'string' &&
    allowedPermalink(post.permalink) !== null &&
    (post.caption === undefined || typeof post.caption === 'string') &&
    (post.timestamp === undefined || typeof post.timestamp === 'string') &&
    (post.mediaUrls === undefined || (
      Array.isArray(post.mediaUrls) &&
      post.mediaUrls.every((url) => typeof url === 'string' && /^https:\/\//i.test(url))
    ));
}

async function readArchivedPosts(env: Env): Promise<FeedPost[]> {
  if (!env.INSTAGRAM_FEED_ARCHIVE) return [];
  const value = await env.INSTAGRAM_FEED_ARCHIVE.get(ARCHIVE_KEY, 'json');
  return Array.isArray(value) ? value.filter(isFeedPost) : [];
}

function mergePosts(existing: FeedPost[], incoming: FeedPost[]): FeedPost[] {
  const postsById = new Map(existing.map((post) => [post.id, post]));
  for (const post of incoming) {
    const previous = postsById.get(post.id);
    postsById.set(post.id, previous
      ? {
          ...previous,
          ...post,
          mediaUrls: post.mediaUrls?.length ? post.mediaUrls : previous.mediaUrls,
        }
      : post);
  }
  return [...postsById.values()].sort((first, second) => {
    const firstTime = Date.parse(first.timestamp || '') || 0;
    const secondTime = Date.parse(second.timestamp || '') || 0;
    return secondTime - firstTime;
  });
}

function publicPost(post: FeedPost, request: Request, env: Env): FeedPost {
  if (!env.INSTAGRAM_FEED_ARCHIVE || !env.INSTAGRAM_MEDIA_ARCHIVE) return post;
  const mediaUrl = new URL(`${MEDIA_PATH}${encodeURIComponent(post.id)}/0`, request.url).toString();
  const mediaUrls = post.mediaUrls?.map((_, index) =>
    new URL(`${MEDIA_PATH}${encodeURIComponent(post.id)}/${index}`, request.url).toString());
  return {
    ...post,
    mediaUrl,
    ...(mediaUrls?.length ? { mediaUrls } : {}),
  };
}

async function refreshArchive(env: Env, incoming: FeedPost[]): Promise<FeedPost[]> {
  if (!env.INSTAGRAM_FEED_ARCHIVE) return [];
  const posts = mergePosts(await readArchivedPosts(env), incoming);
  await env.INSTAGRAM_FEED_ARCHIVE.put(ARCHIVE_KEY, JSON.stringify(posts));
  return posts;
}

async function fetchInstagramMedia(request: Request, env: Env): Promise<Response> {
  if (!env.INSTAGRAM_FEED_ARCHIVE || !env.INSTAGRAM_MEDIA_ARCHIVE) {
    return json({ error: 'instagram_archive_unavailable' }, 503);
  }

  const path = new URL(request.url).pathname.slice(MEDIA_PATH.length).split('/');
  const [postId, rawIndex, extra] = path;
  const index = Number.parseInt(rawIndex || '', 10);
  if (!postId || !/^[A-Za-z0-9_-]{1,80}$/.test(postId) || !Number.isInteger(index) || index < 0 || extra !== undefined) {
    return new Response('Not found', { status: 404 });
  }

  const key = `posts/${postId}/${index}`;
  const cachedObject = await env.INSTAGRAM_MEDIA_ARCHIVE.get(key);
  if (cachedObject) {
    return new Response(request.method === 'HEAD' ? null : cachedObject.body, {
      headers: {
        'Content-Type': cachedObject.httpMetadata?.contentType || 'image/jpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  }

  const archivedPosts = await readArchivedPosts(env);
  const post = archivedPosts.find((candidate) => candidate.id === postId);
  if (!post) return new Response('Not found', { status: 404 });

  let sourceUrl = post.mediaUrls?.[index] || (index === 0 ? post.mediaUrl : undefined);
  if (!sourceUrl) return new Response('Not found', { status: 404 });

  let mediaResponse = await fetch(sourceUrl);
  if (!mediaResponse.ok) {
    const apiUrl = new URL(`https://graph.facebook.com/${env.INSTAGRAM_API_VERSION}/${postId}`);
    apiUrl.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}');
    const metaResponse = await fetch(apiUrl, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}` },
    });
    if (!metaResponse.ok) return new Response('Image unavailable', { status: 502 });

    const media = await metaResponse.json() as InstagramMedia;
    const refreshed = filterAndLimitPosts([media], getExcludedPostIds(env.INSTAGRAM_EXCLUDED_POST_IDS), 1)[0];
    if (!refreshed) return new Response('Image unavailable', { status: 502 });
    sourceUrl = refreshed.mediaUrls?.[index] || (index === 0 ? refreshed.mediaUrl : undefined);
    if (!sourceUrl) return new Response('Not found', { status: 404 });
    const updatedPosts = mergePosts(archivedPosts, [refreshed]);
    await env.INSTAGRAM_FEED_ARCHIVE.put(ARCHIVE_KEY, JSON.stringify(updatedPosts));
    mediaResponse = await fetch(sourceUrl);
  }

  if (!mediaResponse.ok || !mediaResponse.headers.get('Content-Type')?.toLowerCase().startsWith('image/')) {
    return new Response('Image unavailable', { status: 502 });
  }

  const body = await mediaResponse.arrayBuffer();
  const contentType = mediaResponse.headers.get('Content-Type') || 'image/jpeg';
  await env.INSTAGRAM_MEDIA_ARCHIVE.put(key, body, { httpMetadata: { contentType } });
  return new Response(request.method === 'HEAD' ? null : body, {
    headers: {
      'Content-Type': contentType,
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function getExcludedPostIds(configuredIds = ''): Set<string> {
  const additionalIds = configuredIds.split(',').map((id) => id.trim()).filter(Boolean);
  return new Set([...DEFAULT_EXCLUDED_POST_IDS, ...additionalIds]);
}

export function filterAndLimitPosts(
  mediaItems: InstagramMedia[],
  excludedIds: ReadonlySet<string>,
  limit: number,
): FeedPost[] {
  return mediaItems
    .flatMap((media): FeedPost[] => {
      const permalink = allowedPermalink(media.permalink);
      const mediaType = media.media_type;
      const normalizedMediaType = mediaType?.toUpperCase();
      const mediaUrls = normalizedMediaType === 'CAROUSEL_ALBUM'
        ? [...new Set((media.children?.data || [])
            .filter((child) => child.media_type?.toUpperCase() === 'IMAGE')
            .map((child) => allowedMediaUrl(child.media_url))
            .filter((url): url is string => Boolean(url)))]
        : [];
      const mediaUrl = mediaUrls[0] ||
        allowedMediaUrl(media.media_url) ||
        allowedMediaUrl(media.thumbnail_url) ||
        allowedMediaUrl(media.children?.data?.[0]?.media_url) ||
        allowedMediaUrl(media.children?.data?.[0]?.thumbnail_url);

      if (
        !media.id ||
        excludedIds.has(media.id) ||
        !mediaType ||
        !normalizedMediaType ||
        EXCLUDED_MEDIA_TYPES.has(normalizedMediaType) ||
        !mediaUrl ||
        !permalink
      ) return [];

      return [{
        id: media.id,
        mediaType,
        mediaUrl,
        ...(mediaUrls.length > 0 ? { mediaUrls } : {}),
        permalink,
        ...(media.caption !== undefined ? { caption: media.caption } : {}),
        ...(media.timestamp !== undefined ? { timestamp: media.timestamp } : {}),
      }];
    })
    .sort((first, second) => {
      const firstTime = Date.parse(first.timestamp || '') || 0;
      const secondTime = Date.parse(second.timestamp || '') || 0;
      return secondTime - firstTime;
    })
    .slice(0, limit);
}

async function handleFeed(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  if (url.pathname !== FEED_PATH) return new Response('Not found', { status: 404 });

  const origin = allowedOrigin(request.headers.get('Origin'), env);
  if (request.headers.has('Origin') && !origin) {
    return json({ error: 'origin_not_allowed' }, 403);
  }

  const limit = Math.min(12, Math.max(1, Number.parseInt(url.searchParams.get('limit') || '6', 10) || 6));
  const cache = (globalThis.caches as CacheStorage & { default: Cache }).default;
  const key = cacheKey(FEED_PATH, String(limit));
  const cached = await cache.match(key);
  if (cached) return json(await cached.json(), 200, origin);

  try {
    const missingBindings = [
      ...(!env.INSTAGRAM_ACCESS_TOKEN ? ['INSTAGRAM_ACCESS_TOKEN'] : []),
      ...(!env.INSTAGRAM_USER_ID ? ['INSTAGRAM_USER_ID'] : []),
    ];
    if (missingBindings.length > 0) {
      console.error(JSON.stringify({
        event: 'instagram_feed_missing_bindings',
        missingBindings,
      }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    const apiUrl = new URL(
      `https://graph.facebook.com/${env.INSTAGRAM_API_VERSION}/${env.INSTAGRAM_USER_ID}/media`,
    );
    apiUrl.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}');
    apiUrl.searchParams.set('limit', String(META_MEDIA_FETCH_LIMIT));

    let response: Response;
    try {
      response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`,
        },
      });
    } catch (error) {
      console.error(JSON.stringify({
        event: 'instagram_graph_fetch_failed',
        errorName: diagnosticErrorName(error),
        errorMessage: error instanceof Error ? safeDiagnosticText(error.message) : undefined,
      }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    if (!response.ok) {
      const metaError = (await response.clone().json().catch(() => null) as InstagramMediaResponse | null)?.error;
      console.error(JSON.stringify({
        event: 'instagram_graph_http_error',
        httpStatus: response.status,
        errorType: metaError?.type,
        errorCode: metaError?.code,
        errorSubcode: metaError?.error_subcode,
        isTransient: metaError?.is_transient,
        fbtraceId: metaError?.fbtrace_id?.slice(0, 100),
        errorMessage: metaError?.message ? safeDiagnosticText(metaError.message) : undefined,
      }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    const result = (await response.json()) as InstagramMediaResponse;
    const excludedIds = getExcludedPostIds(env.INSTAGRAM_EXCLUDED_POST_IDS);
    const recentPosts = filterAndLimitPosts(result.data || [], excludedIds, META_MEDIA_FETCH_LIMIT);
    let archiveReady = false;
    if (env.INSTAGRAM_FEED_ARCHIVE && env.INSTAGRAM_MEDIA_ARCHIVE) {
      try {
        await refreshArchive(env, recentPosts);
        archiveReady = true;
      } catch (error) {
        console.error(JSON.stringify({
          event: 'instagram_archive_write_failed',
          errorName: diagnosticErrorName(error),
        }));
      }
    }
    const posts = recentPosts.slice(0, limit).map((post) =>
      archiveReady ? publicPost(post, request, env) : post);

    const payload = { posts };
    const cacheResponse = new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    });
    await cache.put(key, cacheResponse);
    return json(payload, 200, origin);
  } catch (error) {
    console.error(JSON.stringify({
      event: 'instagram_feed_processing_error',
      errorName: diagnosticErrorName(error),
      errorMessage: error instanceof Error ? safeDiagnosticText(error.message) : undefined,
    }));
    return json({ error: 'instagram_feed_unavailable' }, 503, origin);
  }
}

async function handleArchive(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const origin = allowedOrigin(request.headers.get('Origin'), env);
  if (request.headers.has('Origin') && !origin) {
    return json({ error: 'origin_not_allowed' }, 403);
  }
  if (!env.INSTAGRAM_FEED_ARCHIVE || !env.INSTAGRAM_MEDIA_ARCHIVE) {
    return json({ error: 'instagram_archive_unavailable' }, 503, origin);
  }

  try {
    const requestedId = url.searchParams.get('id');
    if (requestedId) {
      const archived = await readArchivedPosts(env);
      const post = archived.find((candidate) => candidate.id === requestedId);
      return json({ posts: post ? [publicPost(post, request, env)] : [] }, 200, origin);
    }

    const cache = (globalThis.caches as CacheStorage & { default: Cache }).default;
    const key = cacheKey(ARCHIVE_PATH, 'all');
    const cached = await cache.match(key);
    if (cached) return json(await cached.json(), 200, origin);

    const missingBindings = [
      ...(!env.INSTAGRAM_ACCESS_TOKEN ? ['INSTAGRAM_ACCESS_TOKEN'] : []),
      ...(!env.INSTAGRAM_USER_ID ? ['INSTAGRAM_USER_ID'] : []),
    ];
    if (missingBindings.length > 0) {
      console.error(JSON.stringify({ event: 'instagram_feed_missing_bindings', missingBindings }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    const apiUrl = new URL(
      `https://graph.facebook.com/${env.INSTAGRAM_API_VERSION}/${env.INSTAGRAM_USER_ID}/media`,
    );
    apiUrl.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_type,media_url,thumbnail_url}');
    apiUrl.searchParams.set('limit', String(META_MEDIA_FETCH_LIMIT));

    let response: Response;
    try {
      response = await fetch(apiUrl, {
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${env.INSTAGRAM_ACCESS_TOKEN}`,
        },
      });
    } catch (error) {
      console.error(JSON.stringify({
        event: 'instagram_graph_fetch_failed',
        errorName: diagnosticErrorName(error),
        errorMessage: error instanceof Error ? safeDiagnosticText(error.message) : undefined,
      }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    if (!response.ok) {
      const metaError = (await response.clone().json().catch(() => null) as InstagramMediaResponse | null)?.error;
      console.error(JSON.stringify({
        event: 'instagram_graph_http_error',
        httpStatus: response.status,
        errorType: metaError?.type,
        errorCode: metaError?.code,
        errorSubcode: metaError?.error_subcode,
        isTransient: metaError?.is_transient,
        fbtraceId: metaError?.fbtrace_id?.slice(0, 100),
        errorMessage: metaError?.message ? safeDiagnosticText(metaError.message) : undefined,
      }));
      return json({ error: 'instagram_feed_unavailable' }, 503, origin);
    }

    const result = await response.json() as InstagramMediaResponse;
    const recentPosts = filterAndLimitPosts(
      result.data || [],
      getExcludedPostIds(env.INSTAGRAM_EXCLUDED_POST_IDS),
      META_MEDIA_FETCH_LIMIT,
    );
    const archivedPosts = await refreshArchive(env, recentPosts);
    const payload = { posts: archivedPosts.map((post) => publicPost(post, request, env)) };
    await cache.put(key, new Response(JSON.stringify(payload), {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': `public, max-age=${CACHE_TTL_SECONDS}`,
      },
    }));
    return json(payload, 200, origin);
  } catch (error) {
    console.error(JSON.stringify({
      event: 'instagram_archive_processing_error',
      errorName: diagnosticErrorName(error),
      errorMessage: error instanceof Error ? safeDiagnosticText(error.message) : undefined,
    }));
    return json({ error: 'instagram_archive_unavailable' }, 503, origin);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      const origin = allowedOrigin(request.headers.get('Origin'), env);
      if (request.headers.has('Origin') && !origin) return new Response(null, { status: 403 });
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': origin || '',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Accept',
          'Access-Control-Max-Age': '86400',
          Vary: 'Origin',
        },
      });
    }

    const pathname = new URL(request.url).pathname;
    if (pathname.startsWith(MEDIA_PATH) && ['GET', 'HEAD'].includes(request.method)) {
      return fetchInstagramMedia(request, env);
    }
    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    if (pathname === ARCHIVE_PATH) return handleArchive(request, env);
    return handleFeed(request, env);
  },
};
