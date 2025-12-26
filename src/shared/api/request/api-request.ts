import { ofetch } from 'ofetch'
import { env } from '@/shared/config/env'

export const apiRequest = ofetch.create({
  baseURL: env.VITE_BASE_URL,
})
