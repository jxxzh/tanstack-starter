import handler from '@tanstack/react-start/server-entry'

const FEISHU_AUTH_ENDPOINT = '/api/auth/feishu/session'
const FEISHU_UA_PATTERN = /(Lark|Feishu)/i
const FORBIDDEN_MESSAGE =
  'This app is only available inside Feishu Workbench after login.'

function isFeishuRequest(request: Request) {
  const userAgent = request.headers.get('user-agent') ?? ''
  return FEISHU_UA_PATTERN.test(userAgent)
}

function isDocumentRequest(request: Request) {
  if (request.method !== 'GET') {
    return false
  }

  const destination = request.headers.get('sec-fetch-dest')
  if (destination) {
    return destination === 'document'
  }

  const accept = request.headers.get('accept') ?? ''
  return accept.includes('text/html')
}

async function hasAuthenticatedSession(request: Request) {
  const authRequest = new Request(new URL(FEISHU_AUTH_ENDPOINT, request.url), {
    method: 'GET',
    headers: request.headers,
  })

  const response = await handler.fetch(authRequest)
  if (!response.ok) {
    return false
  }

  const payload = (await response.json().catch(() => null)) as {
    authenticated?: boolean
  } | null

  return payload?.authenticated === true
}

function createForbiddenResponse(request: Request) {
  const accept = request.headers.get('accept') ?? ''

  if (accept.includes('text/html')) {
    return new Response(
      `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Forbidden</title></head><body><main style="font-family: system-ui, sans-serif; margin: 0; min-height: 100vh; display: grid; place-items: center; padding: 24px; text-align: center;"><div><h1 style="margin: 0 0 12px; font-size: 24px;">Access Denied</h1><p style="margin: 0; color: #555;">${FORBIDDEN_MESSAGE}</p></div></main></body></html>`,
      {
        status: 403,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
        },
      },
    )
  }

  return Response.json({ message: FORBIDDEN_MESSAGE }, { status: 403 })
}

export default {
  async fetch(request: Request) {
    const requestUrl = new URL(request.url)

    if (
      !isDocumentRequest(request) ||
      requestUrl.pathname.startsWith('/api/')
    ) {
      return handler.fetch(request)
    }

    if (await hasAuthenticatedSession(request)) {
      return handler.fetch(request)
    }

    if (!isFeishuRequest(request)) {
      return createForbiddenResponse(request)
    }

    return handler.fetch(request)
  },
}
