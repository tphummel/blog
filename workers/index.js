// from: https://developers.cloudflare.com/workers/templates/pages/alter_headers/

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event))
})

async function handleRequest(event) {
  const {request} = event
  // pass through the original request
  let response = await fetch(request.url, request)

  // make the response headers mutable by re-constructing the Response.
  response = new Response(response.body, response)

  // https://infosec.mozilla.org/guidelines/web_security#x-frame-options
  response.headers.set('X-Frame-Options', 'DENY')

  // https://infosec.mozilla.org/guidelines/web_security#x-xss-protection
  response.headers.set('X-XSS-Protection', '1; mode=block')

  const { pathname } = new URL(event.request.url)
  const cf = event.request.cf !== undefined ? event.request.cf : {}
  const headers = new Map(event.request.headers)

  let eventData = {
    req_method: event.request.method,
    req_pathname: pathname,
    req_lat: cf.latitude,
    req_lon: cf.longitude,
    req_continent: cf.continent,
    req_country: cf.country,
    req_region: cf.region,
    req_city: cf.city,
    req_timezone: cf.timezone,
    req_region_code: cf.regionCode,
    req_metro_code: cf.metroCode,
    req_postal_code: cf.postalCode,
    req_colo: cf.colo,
    req_cf_ray: headers.get('cf-ray')
  }

  event.waitUntil(postLog(eventData))

  return response
}

function postLog (data) {
  return fetch('https://api.honeycomb.io/1/events/' + encodeURIComponent(HONEYCOMB_DATASET), {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers([['X-Honeycomb-Team', HONEYCOMB_KEY]]) 
  })
}
