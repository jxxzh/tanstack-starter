import { useEffect } from 'react'
import { clientEnv } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'

const FEISHU_SDK_SRC =
  'https://lf-scm-cn.feishucdn.com/lark/op/h5-js-sdk-1.5.38.js'
const FEISHU_AUTH_ENDPOINT = '/api/auth/feishu/session'
const FEISHU_UA_PATTERN = /(Lark|Feishu)/i
const AUTH_ROUTE_PATH = '/auth'
const REQUEST_ACCESS_LOW_VERSION_ERRNO = 103
const REQUEST_ACCESS_INVALID_REDIRECT_ERRNO = 20029
const REQUEST_AUTH_CODE_INVALID_URL_ERRNO = 10236

type FeishuAuthError = {
  errno?: number
  errMsg?: string
  errString?: string
}

let bootstrapPromise: Promise<void> | null = null

function isFeishuContainer() {
  return FEISHU_UA_PATTERN.test(navigator.userAgent)
}

function parseScopeList(scope?: string) {
  if (!scope) {
    return ['contact:user.base:readonly']
  }

  const scopeList = scope
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)

  return scopeList.length > 0 ? scopeList : ['contact:user.base:readonly']
}

function resolveAuthRouteTargetPath(redirectPath: string | null) {
  if (
    !redirectPath ||
    !redirectPath.startsWith('/') ||
    redirectPath.startsWith(AUTH_ROUTE_PATH)
  ) {
    return '/'
  }

  try {
    const normalizedUrl = new URL(redirectPath, window.location.origin)
    return `${normalizedUrl.pathname}${normalizedUrl.search}`
  } catch {
    return '/'
  }
}

function normalizeBootstrapLocation() {
  if (window.location.pathname === AUTH_ROUTE_PATH) {
    const searchParams = new URLSearchParams(window.location.search)
    const targetPath = resolveAuthRouteTargetPath(searchParams.get('redirect'))
    const currentPathWithSearch = `${window.location.pathname}${window.location.search}`

    if (targetPath !== currentPathWithSearch) {
      window.location.replace(targetPath)
      return false
    }
  }

  if (window.location.hash) {
    window.history.replaceState(
      null,
      '',
      `${window.location.pathname}${window.location.search}`,
    )
  }

  return true
}

function formatFeishuAuthError(prefix: string, error?: FeishuAuthError) {
  const details = [
    error?.errno ? `errno=${error.errno}` : null,
    error?.errMsg || null,
    error?.errString || null,
  ]
    .filter(Boolean)
    .join(', ')

  return details ? `${prefix}: ${details}` : prefix
}

function isRedirectUrlConfigError(error?: FeishuAuthError) {
  const text = `${error?.errMsg ?? ''} ${error?.errString ?? ''}`.toLowerCase()

  return (
    error?.errno === REQUEST_ACCESS_INVALID_REDIRECT_ERRNO ||
    error?.errno === REQUEST_AUTH_CODE_INVALID_URL_ERRNO ||
    text.includes('invalid redirect uri') ||
    text.includes('invalid url')
  )
}

function getRedirectUrlConfigHint() {
  const currentUrl =
    typeof window === 'undefined' ? 'unknown' : window.location.href

  return `Please verify Feishu Web App settings: H5 trusted domain, web app home page URL, and redirect URL allowlist. Current URL: ${currentUrl}`
}

function loadFeishuSdk() {
  if (window.tt) {
    return Promise.resolve()
  }

  return new Promise<void>((resolve, reject) => {
    const onReady = () => {
      if (window.tt) {
        resolve()
        return
      }

      reject(new Error('Feishu SDK loaded but tt bridge is unavailable'))
    }

    if (window.h5sdk?.ready) {
      window.h5sdk.ready(onReady)
      return
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-feishu-sdk="true"]',
    )

    if (existingScript) {
      existingScript.addEventListener('load', onReady, { once: true })
      existingScript.addEventListener(
        'error',
        () => reject(new Error('Failed to load Feishu SDK script')),
        { once: true },
      )
      return
    }

    const script = document.createElement('script')
    script.src = FEISHU_SDK_SRC
    script.async = true
    script.dataset.feishuSdk = 'true'
    script.addEventListener('load', onReady, { once: true })
    script.addEventListener(
      'error',
      () => reject(new Error('Failed to load Feishu SDK script')),
      { once: true },
    )
    document.head.append(script)
  })
}

function requestAccessCodeWithRequestAuthCode(appId: string) {
  return new Promise<string>((resolve, reject) => {
    window.tt?.requestAuthCode?.({
      appId,
      success: (result) => {
        if (!result?.code) {
          reject(new Error('requestAuthCode returned empty code'))
          return
        }

        resolve(result.code)
      },
      fail: (error) => {
        if (isRedirectUrlConfigError(error)) {
          reject(
            new Error(
              `${formatFeishuAuthError('requestAuthCode failed', error)}. ${getRedirectUrlConfigHint()}`,
            ),
          )
          return
        }

        reject(
          new Error(formatFeishuAuthError('requestAuthCode failed', error)),
        )
      },
    })
  })
}

async function requestAccessCode(appId: string, scopeList: string[]) {
  if (!window.tt?.requestAccess) {
    return requestAccessCodeWithRequestAuthCode(appId)
  }

  return new Promise<string>((resolve, reject) => {
    const fallbackToRequestAuthCode = async (error: FeishuAuthError) => {
      if (!window.tt?.requestAuthCode) {
        reject(new Error(formatFeishuAuthError('requestAccess failed', error)))
        return
      }

      try {
        const code = await requestAccessCodeWithRequestAuthCode(appId)
        resolve(code)
      } catch (fallbackError) {
        reject(
          new Error(
            `${formatFeishuAuthError('requestAccess failed', error)}; ${String(
              fallbackError,
            )}`,
          ),
        )
      }
    }

    window.tt?.requestAccess?.({
      appID: appId,
      appId,
      scopeList,
      success: (result) => {
        if (!result?.code) {
          reject(new Error('requestAccess returned empty code'))
          return
        }

        resolve(result.code)
      },
      fail: (error) => {
        if (isRedirectUrlConfigError(error)) {
          reject(
            new Error(
              `${formatFeishuAuthError('requestAccess failed', error)}. ${getRedirectUrlConfigHint()}`,
            ),
          )
          return
        }

        if (error.errno === REQUEST_ACCESS_LOW_VERSION_ERRNO) {
          void fallbackToRequestAuthCode(error)
          return
        }

        void fallbackToRequestAuthCode(error)
      },
    })
  })
}

async function fetchSessionStatus() {
  const response = await fetch(FEISHU_AUTH_ENDPOINT, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    return false
  }

  const data = (await response.json()) as { authenticated?: boolean }
  return data.authenticated === true
}

async function createSessionByCode(code: string) {
  const response = await fetch(FEISHU_AUTH_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({ code }),
  })

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      message?: string
    } | null
    throw new Error(
      payload?.message ?? `Create session failed (${response.status})`,
    )
  }
}

async function runFeishuAuthBootstrap() {
  const appId = clientEnv.VITE_FEISHU_APP_ID

  if (!appId || !isFeishuContainer()) {
    return
  }

  if (!normalizeBootstrapLocation()) {
    return
  }

  const isAuthenticated = await fetchSessionStatus()
  if (isAuthenticated) {
    return
  }

  await loadFeishuSdk()

  const code = await requestAccessCode(
    appId,
    parseScopeList(clientEnv.VITE_FEISHU_SCOPE),
  )
  await createSessionByCode(code)
}

export function FeishuAuthBootstrap() {
  useEffect(() => {
    if (!bootstrapPromise) {
      bootstrapPromise = runFeishuAuthBootstrap().catch((error: unknown) => {
        logger.warn('Feishu auth bootstrap failed: %s', String(error))
      })
    }
  }, [])

  return null
}
