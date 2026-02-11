import { createStore } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import { getCookieFn, removeCookieFn, setCookieFn } from './cookie'

export const jotaiStore = createStore()

function createCookieStringStorage() {
  return {
    getItem: (key: string) => getCookieFn(key),
    setItem: (key: string, value: string) => setCookieFn(key, value),
    removeItem: (key: string) => removeCookieFn(key),
  }
}

export function createCookieStorage<Value>() {
  return createJSONStorage<Value>(() => createCookieStringStorage())
}
