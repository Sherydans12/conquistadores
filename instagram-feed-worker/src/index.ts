interface Env {
  INSTAGRAM_ACCESS_TOKEN: string;
  INSTAGRAM_USER_ID: string;
  INSTAGRAM_API_VERSION: string;
  ALLOWED_ORIGINS: string;
  INSTAGRAM_EXCLUDED_POST_IDS?: string;
}

interface InstagramMedia {
  id?: string;
  caption?: string;
  media_type?: string;
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
  children?: { data?: Array<{ media_url?: string; thumbnail_url?: string }> };
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
  permalink: string;
  caption?: string;
  timestamp?: string;
}

const CACHE_TTL_SECONDS = 900;
const FEED_PATH = '/api/instagram-feed';
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

function cacheKey(limit: number): Request {
  return new Request(`https://instagram-feed-cache.invalid${FEED_PATH}?version=3&limit=${limit}`);
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
      const mediaUrl =
        media.media_url ||
        media.thumbnail_url ||
        media.children?.data?.[0]?.media_url ||
        media.children?.data?.[0]?.thumbnail_url;
      const permalink = allowedPermalink(media.permalink);
      const mediaType = media.media_type;
      const normalizedMediaType = mediaType?.toUpperCase();

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
  const key = cacheKey(limit);
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
    apiUrl.searchParams.set('fields', 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,children{media_url,thumbnail_url}');
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
    const posts = filterAndLimitPosts(result.data || [], excludedIds, limit);

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

    if (request.method !== 'GET') return new Response('Method not allowed', { status: 405 });
    return handleFeed(request, env);
  },
};
