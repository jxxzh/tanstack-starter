import { ofetch } from 'ofetch'
import { clientEnv } from '@/shared/config/client-env'
import { API_ERROR_TYPE, APIError } from './error'

/**
 * API 请求客户端
 * 统一处理错误和响应
 */
export const apiRequest = ofetch.create({
  baseURL: clientEnv.VITE_API_URL,

  onRequestError: ({ error }) => {
    throw new APIError({
      statusCode: 0,
      detail: error?.message,
      errorType: API_ERROR_TYPE.REQUEST_FAILED,
    })
  },

  onResponseError: ({ error, response }) => {
    throw new APIError({
      statusCode: response.status,
      detail: response._data?.message ?? error?.message,
      errorType: response._data?.error ?? API_ERROR_TYPE.CLIENT_UNKNOWN,
    })
  },
})
