export let ActiveEffect = null

// 用于存储原始对象和代理对象的映射关系
export const effect = (fn, options = {}) => {
  // ...
  const effect = new CreateReactiveEffect(fn, options)
  // ...
  return effect
}

class CreateReactiveEffect {
  private parent
  constructor(public fn,public options) {
    this.run()
  }
  run() {
    // debugger
    try {
      // effect会发生嵌套，按照树结构保存父级
      this.parent = ActiveEffect
      ActiveEffect = this
      this.fn()
    } finally {
      ActiveEffect = this.parent
      this.parent = null
    }
  }
}
// targetMap 结构如下
// {
//   target1: {
//     key1: [effect1, effect2],
//     key2: [effect3, effect4]
//   },
//   target2: {
//     key1: [effect5, effect6],
//     key2: [effect7, effect8]
//   }
// }
const targetMap = new WeakMap();
// 用于收集依赖
export const track = (target, key, value) => {
  // ...
  if (!ActiveEffect) return
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    targetMap.set(target, (depsMap = new Map()))
  }
  let dep = depsMap.get(key)
  if (!dep) {
    depsMap.set(key, (dep = new Set()))
  }
  if (!dep.has(ActiveEffect)) {
    dep.add(ActiveEffect)
  }
}

// 用于触发更新
export const trigger = (target, key, newVal, oldVal) => {
  // ...
  let depsMap = targetMap.get(target)
  if (!depsMap) return
  let dep = depsMap.get(key)
  dep && dep.forEach(effect => {
    if (effect !== ActiveEffect) {
      effect.run()
    }
  })
}