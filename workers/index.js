// from: https://developers.cloudflare.com/workers/templates/pages/alter_headers/

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  // pass through the original request
  let response = await fetch(request.url, request)

  // make the response headers mutable by re-constructing the Response.
  response = new Response(response.body, response)

  // https://infosec.mozilla.org/guidelines/web_security#x-frame-options
  response.headers.set('X-Frame-Options', 'DENY')

  // https://infosec.mozilla.org/guidelines/web_security#x-xss-protection
  response.headers.set('X-XSS-Protection', '1; mode=block')
  return response
}
