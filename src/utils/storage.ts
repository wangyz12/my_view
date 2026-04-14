/**
 * 本地存储工具封装（支持 localStorage/sessionStorage、过期时间、TS 类型约束）
 */

// 存储类型枚举
type StorageType = 'local' | 'session'

// 存储值的结构（包含原始值和过期时间）
interface StorageValue<T = any> {
  value: T
  expire: number | null // 过期时间戳（毫秒），null 表示永不过期
}

/**
 * 获取存储实例（localStorage/sessionStorage）
 * 重命名为 _getStorage，避免和读取存储值的 getStorage 冲突
 */
const _getStorage = (type: StorageType): Storage => { // 关键：重命名为 _getStorage
  return type === 'local' ? localStorage : sessionStorage
}

/**
 * 设置存储
 * @param key 存储键名
 * @param value 存储值（支持任意类型）
 * @param expire 过期时间（秒），默认 null 永不过期
 * @param type 存储类型，默认 local
 */
export const setStorage = <T = any>(
  key: string,
  value: T,
  expire: number | null = null,
  type: StorageType = 'local'
): boolean => {
  try {
    // 处理过期时间：转换为时间戳（毫秒）
    const expireTime = expire ? Date.now() + expire * 1000 : null
    const storageValue: StorageValue<T> = { value, expire: expireTime }
    
    // 序列化并存储（改用 _getStorage）
    _getStorage(type).setItem(key, JSON.stringify(storageValue))
    return true
  } catch (error) {
    console.error(`存储 ${key} 失败：`, error)
    return false
  }
}

/**
 * 获取存储值
 * @param key 存储键名
 * @param type 存储类型，默认 local
 * @returns 存储值（自动反序列化），过期/不存在返回 null
 */
export const getStorage = <T = any>(key: string, type: StorageType = 'local'): T | null => {
  try {
    const storage = _getStorage(type) // 关键：改用 _getStorage
    const rawValue = storage.getItem(key)
    
    if (!rawValue) return null
    
    // 反序列化
    const storageValue: StorageValue<T> = JSON.parse(rawValue)
    
    // 校验过期时间
    if (storageValue.expire && Date.now() > storageValue.expire) {
      // 过期则删除并返回 null
      removeStorage(key, type)
      return null
    }
    
    return storageValue.value
  } catch (error) {
    console.error(`读取 ${key} 失败：`, error)
    return null
  }
}

/**
 * 删除指定存储
 * @param key 存储键名
 * @param type 存储类型，默认 local
 */
export const removeStorage = (key: string, type: StorageType = 'local'): boolean => {
  try {
    _getStorage(type).removeItem(key) // 关键：改用 _getStorage
    return true
  } catch (error) {
    console.error(`删除 ${key} 失败：`, error)
    return false
  }
}

/**
 * 清空所有存储
 * @param type 存储类型，默认 local
 */
export const clearStorage = (type: StorageType = 'local'): boolean => {
  try {
    _getStorage(type).clear() // 关键：改用 _getStorage
    return true
  } catch (error) {
    console.error(`清空 ${type}Storage 失败：`, error)
    return false
  }
}

/**
 * 批量设置存储
 * @param list 存储列表 [{ key, value, expire? }]
 * @param type 存储类型，默认 local
 */
export const setStorageBatch = (
  list: Array<{ key: string; value: any; expire?: number | null }>,
  type: StorageType = 'local'
): boolean => {
  try {
    list.forEach(item => {
      setStorage(item.key, item.value, item.expire, type)
    })
    return true
  } catch (error) {
    console.error('批量存储失败：', error)
    return false
  }
}

// 常用存储快捷方法（比如 Token 存储）
export const storageToken = {
  // 设置 Token（7 天过期）
  set: (token: string, expire = 60 * 60 * 24 * 7) => setStorage('token', token, expire),
  // 获取 Token
  get: () => getStorage<string>('token'),
  // 删除 Token
  remove: () => removeStorage('token')
}

// 导出默认方法（简化常用操作）
export default {
  set: setStorage,
  get: getStorage,
  remove: removeStorage,
  clear: clearStorage,
  batchSet: setStorageBatch,
  token: storageToken
}