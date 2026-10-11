// lib/cors.ts — CORS for the static TMWS front end (GitHub Pages) calling this API.
// Set ALLOWED_ORIGIN to the published site, e.g. https://multipu.github.io
// The front end authenticates with a Bearer token, so cookies are not sent cross-site.
export function corsHeaders(req: Request, methods = 'POST, OPTIONS'): Record<string, string> {
  const allowed = process.env.ALLOWED_ORIGIN ?? '';
  const origin = req.headers.get('origin') ?? '';
  return {
    'Access-Control-Allow-Origin': origin && origin === allowed ? origin : allowed,
    'Access-Control-Allow-Methods': methods,
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    Vary: 'Origin',
  };
}

export const preflight = (req: Request) =>
  new Response(null, { status: 204, headers: corsHeaders(req, 'GET, POST, OPTIONS') });
