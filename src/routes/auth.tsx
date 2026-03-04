import { createFileRoute } from '@tanstack/react-router'
import { useEffect } from 'react'
import { clientEnv } from '@/shared/config/env'

const FEISHU_AUTH_ENDPOINT = '/api/auth/feishu/session'
const FEISHU_UA_PATTERN = /(Lark|Feishu)/i
const AUTH_CHECK_INTERVAL_MS = 800

function isFeishuContainer() {
  return FEISHU_UA_PATTERN.test(navigator.userAgent)
}

function getRedirectPath() {
  const searchParams = new URLSearchParams(window.location.search)
  const redirect = searchParams.get('redirect')

  if (!redirect || !redirect.startsWith('/') || redirect.startsWith('/auth')) {
    return '/'
  }

  return redirect
}

async function fetchAuthStatus() {
  const response = await fetch(FEISHU_AUTH_ENDPOINT, {
    method: 'GET',
    credentials: 'include',
  })

  if (!response.ok) {
    return false
  }

  const payload = (await response.json()) as { authenticated?: boolean }
  return payload.authenticated === true
}

export const Route = createFileRoute('/auth')({
  component: AuthPage,
})

function AuthPage() {
  const hasFeishuAppId = Boolean(clientEnv.VITE_FEISHU_APP_ID)
  const inFeishu = typeof navigator !== 'undefined' && isFeishuContainer()

  useEffect(() => {
    if (!inFeishu || !hasFeishuAppId) {
      return
    }

    let disposed = false
    let timer: number | null = null

    const checkAuth = async () => {
      if (disposed) {
        return
      }

      const authenticated = await fetchAuthStatus().catch(() => false)
      if (authenticated) {
        window.location.replace(getRedirectPath())
        return
      }

      timer = window.setTimeout(() => {
        void checkAuth()
      }, AUTH_CHECK_INTERVAL_MS)
    }

    void checkAuth()

    return () => {
      disposed = true

      if (timer !== null) {
        window.clearTimeout(timer)
      }
    }
  }, [inFeishu, hasFeishuAppId])

  return (
    <main className="flex min-h-svh items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="font-semibold text-2xl">正在验证登录状态</h1>
        {!hasFeishuAppId ? (
          <p className="text-muted-foreground">
            缺少 VITE_FEISHU_APP_ID，无法完成飞书免登录初始化。
          </p>
        ) : inFeishu ? (
          <p className="text-muted-foreground">
            正在通过飞书身份建立会话，请稍候，成功后将自动跳转。
          </p>
        ) : (
          <p className="text-muted-foreground">
            当前环境不是飞书工作台，请在飞书内打开此应用。
          </p>
        )}
      </div>
    </main>
  )
}
