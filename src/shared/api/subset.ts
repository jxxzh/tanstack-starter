/**
 * Subset 查询协议类型定义
 * 用于 TanStack DB LoadSubsetOptions 与后端 API 之间的标准化查询
 * 支持 filters/sorts/limit + cursor/offset 双分页模式
 */

import type {
  CursorExpressions,
  LoadSubsetOptions,
  ParsedOrderBy,
  SimpleComparison,
} from '@tanstack/react-db'
import { parseLoadSubsetOptions } from '@tanstack/react-db'

/**
 * Wire format: 序列化后的筛选条件（字段路径转为字符串）
 */
export type SerializedFilter = Omit<SimpleComparison, 'field'> & {
  /** 字段路径（点分隔字符串，如 'user.name'） */
  field: string
}

/**
 * Wire format: 序列化后的排序条件
 */
export type SerializedSort = Omit<ParsedOrderBy, 'field'> & {
  /** 字段路径（点分隔字符串，如 'user.name'） */
  field: string
}

/**
 * 游标引用（cursor 分页模式）
 * 包含上一页最后一条记录的主键
 */
export type CursorRef = Pick<CursorExpressions, 'lastKey'>

/**
 * Subset 查询请求（wire format）
 * 完整的查询参数，支持 filters/sorts/limit + cursor/offset 双分页
 */
export interface SubsetQuery {
  /** 协议版本 */
  v?: number
  /** 每页返回的记录数 */
  limit?: number
  /** 偏移量（offset 分页模式） */
  offset?: number
  /** 游标（cursor 分页模式） */
  cursor?: CursorRef
  /** 筛选条件列表（序列化格式） */
  filters?: SerializedFilter[]
  /** 排序条件列表（序列化格式） */
  sorts?: SerializedSort[]
}

interface TransformOptions {
  pageMode: 'offset' | 'cursor'
}

export function transformLoadSubsetOptions(
  loadSubsetOptions: LoadSubsetOptions,
  options: TransformOptions,
): SubsetQuery {
  const { offset, cursor } = loadSubsetOptions
  const { pageMode } = options
  // 使用 TanStack 官方 helper 解析 where/orderBy/limit （只用且只能解析 where/orderBy/limit ）
  const { filters, sorts, limit } = parseLoadSubsetOptions(loadSubsetOptions)

  // 将 FieldPath (Array<string | number>) 转换为纯字符串数组
  // 后端只需要字符串路径
  const normalizedFilters: SerializedFilter[] = filters.map((f) => ({
    ...f,
    field: f.field.join('.'), // 转换为点分隔的字符串路径
  }))

  const normalizedSorts: SerializedSort[] = sorts.map((s) => ({
    ...s,
    field: s.field.join('.'), // 转换为点分隔的字符串路径
  }))

  // 构建 subset 对象
  const subsetQuery: SubsetQuery = {
    v: 1,
    limit,
    filters: normalizedFilters,
    sorts: normalizedSorts,
  }

  // 根据 offset 或 cursor 选择分页模式（互斥）
  if (pageMode === 'offset' && offset !== undefined) {
    // offset 分页模式
    subsetQuery.offset = offset
  } else if (pageMode === 'cursor' && cursor?.lastKey !== undefined) {
    // cursor 分页模式
    subsetQuery.cursor = {
      lastKey: cursor?.lastKey,
    }
  }

  return subsetQuery
}
