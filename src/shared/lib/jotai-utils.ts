import { createStore } from 'jotai'
import { createJSONStorage } from 'jotai/utils'
import { getCookieFn, removeCookieFn, setCookieFn } from './cookie'

export const jotaiStore = createStore()

// biome-ignore lint/suspicious/noExplicitAny: any is used to avoid type errors
export const cookieStorage = createJSONStorage<any>(() => {
  return {
    getItem: (key) => getCookieFn(key),
    setItem: (key, value) => setCookieFn(key, value),
    removeItem: (key) => removeCookieFn(key),
  }
})
