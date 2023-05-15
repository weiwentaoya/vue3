import { isObject } from '@vue/shared'
import { baseHandlers } from './handles'

// 用于存储原始对象和代理对象的映射关系
const toProxyWeakMap = new WeakMap()

export const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

export const reactive = (target: object) => {
  if (!isObject(target)) {
    // 非对象类型无法被代理
    throw new Error(`target must be an object`)
  }
  // target 已经是一个 Proxy 了，直接返回
  const existingProxy = toProxyWeakMap.get(target)
  if (existingProxy) return existingProxy

  // target 已经是一个响应式对象了，直接返回
  if (target[ReactiveFlags.IS_REACTIVE]) return target

  // 防止代理过的对象被重复代理
  const proxy = new Proxy(target, baseHandlers)
  // 将原始对象和代理对象存储起来
  toProxyWeakMap.set(target, proxy)
  return proxy
  // ...
}
const o = { count: 0 }
const state = reactive(o)
const state1 = reactive(o)
const state2 = reactive(state1)
console.log(state === state1) // true);
console.log(state1 === state2) // true);

