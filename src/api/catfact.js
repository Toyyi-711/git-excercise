/**
 * API 调用层 —— 集中管理所有 HTTP 请求
 *
 * 设计原则：
 *  1. 与组件解耦：组件不直接写 fetch，统一从这里 import
 *  2. 统一错误处理：在底层拦截 HTTP 错误（4xx / 5xx）
 *  3. 集中配置 baseURL、headers，将来换源/加 token 只改这里
 *  4. 用 JSDoc 标注类型，编辑器能智能提示
 */

const BASE_URL = 'https://catfact.ninja'

/**
 * 底层请求函数 —— 所有接口都通过它发出去
 * @template T 期望返回的数据类型
 * @param {string} path  接口路径，例如 '/fact'
 * @param {RequestInit} [options] fetch 的第二参数
 * @returns {Promise<T>}
 */
async function request(path, options = {}) {
  // 1. 拼接完整 URL
  const url = `${BASE_URL}${path}`

  // 2. 合并默认配置：方法、超时、请求头
  const config = {
    method: 'GET',                // 默认 GET
    headers: {
      'Accept': 'application/json', // 告诉服务器：我要 JSON
      'Content-Type': 'application/json',
    },
    ...options,                    // 调用方可以覆盖上面的默认值
  }

  // 3. 真正发请求
  const response = await fetch(url, config)

  // 4. 检查 HTTP 状态码。fetch 不会因 4xx/5xx 抛错，要自己判断
  if (!response.ok) {
    // 抛出有意义的错误，让上层 catch
    throw new Error(`HTTP ${response.status} ${response.statusText}`)
  }

  // 5. 解析 JSON 响应体
  return response.json()
}

/* ============================================================
 *  业务接口 —— 上层组件只调用这些具名函数，不直接写 fetch
 * ============================================================ */

/**
 * 获取一条随机的猫咪冷知识
 * @returns {Promise<{fact: string, length: number}>}
 */
export function getRandomFact() {
  return request('/fact')
}

/**
 * 获取猫咪冷知识列表（分页）
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<Paginated<{fact: string, length: number}>>}
 */
export function getFacts({ page = 1, limit = 10 } = {}) {
  // 用 URLSearchParams 拼 query string：?page=1&limit=10
  const query = new URLSearchParams({ page, limit })
  return request(`/facts?${query}`)
}

/**
 * 获取猫咪品种列表（分页）
 * @param {{ page?: number, limit?: number }} params
 * @returns {Promise<Paginated<Breed>>}
 */
export function getBreeds({ page = 1, limit = 10 } = {}) {
  const query = new URLSearchParams({ page, limit })
  return request(`/breeds?${query}`)
}

/* ============================================================
 *  类型定义（用 JSDoc 表达，零成本）
 * ============================================================ */

/**
 * @template T
 * @typedef {{
 *   data: T[],
 *   current_page: number,
 *   last_page: number,
 *   per_page: number,
 *   total: number,
 * }} Paginated
 */

/**
 * @typedef {{
 *   breed: string,
 *   country: string,
 *   origin: string,
 *   coat: 'Short' | 'Semi-long' | 'Long' | 'Hairless',
 *   pattern: string,
 * }} Breed
 */
