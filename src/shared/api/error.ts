/**
 * API 错误处理类
 */

export const API_ERROR_TYPE = {
  // server error
  HTTP: 'HTTP', // HTTP 状态码错误
  VALIDATE_FAILED: 'VALIDATE_FAILED', // 参数验证失败

  // client error
  CLIENT_UNKNOWN: 'CLIENT_UNKNOWN', // 未知客户端错误
  REQUEST_FAILED: 'REQUEST_FAILED', // 请求失败
} as const

export type APIErrorType = (typeof API_ERROR_TYPE)[keyof typeof API_ERROR_TYPE]

/**
 * API 错误信息 (与后端 APIException 对应)
 */
export interface APIErrorProps {
  statusCode: number
  detail: string
  errorType: APIErrorType
}

/**
 * API 异常类
 * 用于在运行时抛出和处理 API 错误
 */
export class APIError extends Error {
  public readonly statusCode: number
  public readonly errorType: APIErrorType
  public readonly cause?: Error

  constructor(data: APIErrorProps, cause?: Error) {
    super(data.detail, { cause })
    this.statusCode = data.statusCode
    this.errorType = data.errorType
  }
}
