/**
 * 游标分页响应 (推荐)
 */
export interface CursorPageResponse<T> {
  items: T[]
  next_cursor: string | null
  has_next: boolean
  limit: number
}

/**
 * 偏移分页响应 (传统分页)
 */
export interface OffsetPageResponse<T> {
  items: T[]
  total: number
  skip: number
  limit: number
  has_next: boolean
  has_prev: boolean
}

/**
 * 批量操作响应
 */
export interface BatchOperationResponse {
  total: number
  success_count: number
}
