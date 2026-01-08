import { createIsomorphicFn } from '@tanstack/react-start'
import {
  deleteCookie as deleteCookieServer,
  getCookie as getCookieServer,
  setCookie as setCookieServer,
} from '@tanstack/react-start/server'

type CookieOptions = Omit<CookieInit, 'name' | 'value'>
type CookieSerializeOptions = NonNullable<Parameters<typeof setCookieServer>[2]>

function transformCookieOptions(
  options?: CookieOptions,
): CookieSerializeOptions | undefined {
  if (!options) return undefined

  const { expires, domain, path, ...rest } = options

  return {
    ...rest,
    domain: domain ?? undefined,
    path: path ?? undefined,
    expires:
      typeof expires === 'number' ? new Date(expires) : (expires ?? undefined),
  }
}

export const getCookieFn = createIsomorphicFn()
  .server((key: string) => {
    const value = getCookieServer(key)
    // logger.info('getCookieFn server key: %s, value: %s', key, value)
    return value ?? null
  })
  .client((key: string) => {
    // 因为 cookieStore 是异步的，所以这里使用 document.cookie 来获取 cookie
    const match = document.cookie.match(new RegExp(`(^| )${key}=([^;]+)`))
    const value = match ? decodeURIComponent(match[2]) : null
    // logger.info('getCookieFn client key: %s, value: %s', key, value)
    return value
  })

export const setCookieFn = createIsomorphicFn()
  .server((name: string, value: string, options?: CookieOptions) => {
    // logger.info('setCookieFn server name: %s, value: %s, options: %s', name, value, options)
    setCookieServer(name, value, transformCookieOptions(options))
  })
  .client((name: string, value: string, options?: CookieOptions) => {
    // logger.info('setCookieFn client name: %s, value: %s, options: %s', name, value, options)
    cookieStore.set({ name, value, ...options })
  })

export const removeCookieFn = createIsomorphicFn()
  .server((key: string, options?: CookieOptions) => {
    // logger.info('removeCookieFn server key: %s, options: %s', key, options)
    deleteCookieServer(key, transformCookieOptions(options))
  })
  .client((key: string, options?: CookieOptions) => {
    // logger.info('removeCookieFn client key: %s, options: %s', key, options)
    cookieStore.delete({ name: key, ...options })
  })
