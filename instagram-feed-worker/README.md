# Instagram feed worker

This Cloudflare Worker keeps the Astro site static while serving the latest
publications from the school's professional Instagram account. It returns only
display fields needed by the homepage and caches the result for 15 minutes.

## One-time setup

1. Set `INSTAGRAM_USER_ID` to the Instagram account ID assigned to the app's
   Unified Login configuration.
2. Set the System User Access Token (SUAT) as the Worker secret
   `INSTAGRAM_ACCESS_TOKEN`. Never put it in Git, the Astro environment, or
   browser code.
3. Confirm the Unified Login configuration grants `instagram_basic` and includes
   the school's Instagram account as an authorized asset.
4. For the latest-feed integration alone, deploy the Worker on its
   `workers.dev` hostname. To enable the accumulated Activities archive, first
   create and bind the KV namespace and R2 bucket described below, then deploy
   the updated Worker. A DNS Worker Route is not required for either endpoint.
5. The Astro component calls that Worker URL by default. The existing
   `PUBLIC_INSTAGRAM_FEED_URL` build variable remains available to override it.

## Feed exclusions

`INSTAGRAM_EXCLUDED_POST_IDS` accepts comma-separated Instagram media IDs. The
three institutional posts currently excluded are also kept in the Worker source
as permanent defaults, so they remain filtered if the variable is omitted.
Standalone `VIDEO` and `REELS` media are filtered before the requested limit is
applied. Photo carousels include every available image in `mediaUrls`, while
`mediaUrl` remains the first image for the homepage preview and older clients.

Unified Login uses the Graph API on `graph.facebook.com` with the Instagram
account ID in the request path. This Worker does not call `/me/media` because
`/me` identifies the Business Integration System User for a Unified Login
token. It also does not refresh the SUAT. The feed cache uses the Cloudflare
Cache API for 15 minutes. The growing Activities archive additionally needs
these bindings on the deployed Worker:

- `INSTAGRAM_FEED_ARCHIVE`: KV namespace containing accumulated post records.
- `INSTAGRAM_MEDIA_ARCHIVE`: R2 bucket for durable copies of photos and carousel
  slides.

The Worker updates the KV archive from the newest 20 Graph API media items each
time the 15-minute feed cache refreshes. Old records remain in Activities, and
their media links point back through the Worker. On the first request for each
image, the Worker saves it to R2; expired Instagram CDN URLs are refreshed from
Graph API before the copy is made. The homepage feed remains limited to six
posts. The new
`/api/instagram-archive` endpoint returns the complete archive, or one item with
`?id=<media-id>` for the publication detail page.

Before deploying this feature, create one KV namespace and one R2 bucket, then
bind them to the Worker using the exact names above. Do not remove or replace
`INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID`, `INSTAGRAM_API_VERSION`,
`ALLOWED_ORIGINS`, or `INSTAGRAM_EXCLUDED_POST_IDS`. No token or Meta permission
changes are needed. The existing `wrangler.toml` intentionally does not contain
placeholder Cloudflare resource IDs; add the bindings to the deployment
configuration before deploying.

Astro fetches posts in the browser after the static page loads. New posts appear
after the Worker cache expires, without rebuilding Astro.

## Configure the archive bindings

In Cloudflare, create one KV namespace and one R2 bucket. Add them to the
Worker's deployment configuration with:

```toml
[[kv_namespaces]]
binding = "INSTAGRAM_FEED_ARCHIVE"
id = "<ID returned by wrangler kv namespace create>"

[[r2_buckets]]
binding = "INSTAGRAM_MEDIA_ARCHIVE"
bucket_name = "<existing R2 bucket name>"
```

The current repository does not include these entries because the account's
resource IDs and bucket name are not available locally. Add real values before
deploying the updated Worker; the Astro Activities page can still preview the
latest six posts while the archive endpoint is unavailable.

## Local preview

Run the Worker on an available port, for example `8789`, and set
`PUBLIC_INSTAGRAM_FEED_URL` to `http://127.0.0.1:8789/api/instagram-feed` in the
Astro dev environment. Add the corresponding local origin to `ALLOWED_ORIGINS`
only while testing locally.

## Security notes

- The Instagram token is read only by this Worker and sent to Meta over HTTPS.
- CORS allows only the configured site origins.
- The latest-feed endpoint permits GET and OPTIONS and caps the request to 12
  posts. The archive endpoint returns the accumulated records, and the media
  endpoint serves saved images without exposing the token.
- API errors are returned without forwarding Meta's error body or credentials.
- Links are restricted to Instagram HTTPS post URLs.
