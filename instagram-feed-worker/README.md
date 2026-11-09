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
4. Deploy the Worker on its `workers.dev` hostname. A DNS Worker Route is not
   required for the current integration.
5. The Astro component calls that Worker URL by default. The existing
   `PUBLIC_INSTAGRAM_FEED_URL` build variable remains available to override it.

## Feed exclusions

`INSTAGRAM_EXCLUDED_POST_IDS` accepts comma-separated Instagram media IDs. The
three institutional posts currently excluded are also kept in the Worker source
as permanent defaults, so they remain filtered if the variable is omitted.
Standalone `VIDEO` and `REELS` media are filtered before the requested limit is
applied; photo carousels remain available with their first image as the preview.

Unified Login uses the Graph API on `graph.facebook.com` with the Instagram
account ID in the request path. This Worker does not call `/me/media` because
`/me` identifies the Business Integration System User for a Unified Login
token. It also does not refresh the SUAT. The feed cache uses the Cloudflare
Cache API for 15 minutes, so no KV namespace or binding is needed.

Astro fetches posts in the browser after the static page loads. New posts appear
after the Worker cache expires, without rebuilding Astro.

## Local preview

Run the Worker on an available port, for example `8789`, and set
`PUBLIC_INSTAGRAM_FEED_URL` to `http://127.0.0.1:8789/api/instagram-feed` in the
Astro dev environment. Add the corresponding local origin to `ALLOWED_ORIGINS`
only while testing locally.

## Security notes

- The Instagram token is read only by this Worker and sent to Meta over HTTPS.
- CORS allows only the configured site origins.
- The endpoint permits GET and OPTIONS and caps the request to 12 posts.
- API errors are returned without forwarding Meta's error body or credentials.
- Links are restricted to Instagram HTTPS post URLs.
