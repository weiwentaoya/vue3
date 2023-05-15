import { track, trigger } from "./effect";
import { ReactiveFlags } from "./reactive";

// 
export const baseHandlers = {
  get(target, key, receiver) {
    // 给代理对象添加标识，防止重复代理
    if (key === ReactiveFlags.IS_REACTIVE) {
      return true
    }
    const res = Reflect.get(target, key, receiver)
    // ...
    track(target, key, res)
    return res
  },
  set(target, key, value, receiver) {
    // ...
    const oldVal = Reflect.get(target, key, receiver)
    const res = Reflect.set(target, key, value, receiver)
    trigger(target, key, value, oldVal)
    return res
  }
};