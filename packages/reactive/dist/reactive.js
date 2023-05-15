// packages/shared/src/index.ts
var isObject = (val) => val !== null && typeof val === "object";

// packages/reactive/src/effect.ts
var ActiveEffect = null;
var effect = (fn, options = {}) => {
  const effect2 = new CreateReactiveEffect(fn, options);
  return effect2;
};
var CreateReactiveEffect = class {
  constructor(fn, options) {
    this.fn = fn;
    this.options = options;
    this.run();
  }
  run() {
    try {
      this.parent = ActiveEffect;
      ActiveEffect = this;
      this.fn();
    } finally {
      ActiveEffect = this.parent;
      this.parent = null;
    }
  }
};
var targetMap = /* @__PURE__ */ new WeakMap();
var track = (target, key, value) => {
  if (!ActiveEffect)
    return;
  let depsMap = targetMap.get(target);
  if (!depsMap) {
    targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = /* @__PURE__ */ new Set());
  }
  if (!dep.has(ActiveEffect)) {
    dep.add(ActiveEffect);
  }
};
var trigger = (target, key, newVal, oldVal) => {
  let depsMap = targetMap.get(target);
  if (!depsMap)
    return;
  let dep = depsMap.get(key);
  dep && dep.forEach((effect2) => {
    if (effect2 !== ActiveEffect) {
      effect2.run();
    }
  });
};

// packages/reactive/src/handles.ts
var baseHandlers = {
  get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return true;
    }
    const res = Reflect.get(target, key, receiver);
    track(target, key, res);
    return res;
  },
  set(target, key, value, receiver) {
    const oldVal = Reflect.get(target, key, receiver);
    const res = Reflect.set(target, key, value, receiver);
    trigger(target, key, value, oldVal);
    return res;
  }
};

// packages/reactive/src/reactive.ts
var toProxyWeakMap = /* @__PURE__ */ new WeakMap();
var ReactiveFlags = /* @__PURE__ */ ((ReactiveFlags2) => {
  ReactiveFlags2["IS_REACTIVE"] = "__v_isReactive";
  return ReactiveFlags2;
})(ReactiveFlags || {});
var reactive = (target) => {
  if (!isObject(target)) {
    throw new Error(`target must be an object`);
  }
  const existingProxy = toProxyWeakMap.get(target);
  if (existingProxy)
    return existingProxy;
  if (target["__v_isReactive" /* IS_REACTIVE */])
    return target;
  const proxy = new Proxy(target, baseHandlers);
  toProxyWeakMap.set(target, proxy);
  return proxy;
};
var o = { count: 0 };
var state = reactive(o);
var state1 = reactive(o);
var state2 = reactive(state1);
console.log(state === state1);
console.log(state1 === state2);
export {
  ActiveEffect,
  ReactiveFlags,
  effect,
  reactive,
  track,
  trigger
};
//# sourceMappingURL=reactive.js.map
