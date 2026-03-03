import { useEffect } from 'react'
import { clientEnv } from '@/shared/config/env'
import { logger } from '@/shared/lib/logger'

const FEISHU_SDK_SRC =
  'https://lf-scm-cn.feishucdn.com/lark/op/h5-js-sdk-1.5.38.js'
const FEISHU_AUTH_ENDPOINT = '/api/auth/feishu/session'
const FEISHU_UA_PATTERN = /(Lark|Feishu)/i
const REQUEST_ACCESS_LOW_VERSION_ERRNO = 103

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
        reject(
          new Error(
            error.errString || error.errMsg || 'requestAuthCode failed',
          ),
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
    window.tt?.requestAccess?.({
      appID: appId,
      scopeList,
      success: (result) => {
        if (!result?.code) {
          reject(new Error('requestAccess returned empty code'))
          return
        }

        resolve(result.code)
      },
      fail: async (error) => {
        if (error.errno === REQUEST_ACCESS_LOW_VERSION_ERRNO) {
          try {
            const code = await requestAccessCodeWithRequestAuthCode(appId)
            resolve(code)
            return
          } catch (fallbackError) {
            reject(fallbackError)
            return
          }
        }

        reject(
          new Error(error.errMsg || error.errString || 'requestAccess failed'),
        )
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
