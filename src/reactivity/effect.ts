class ReactiveEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }
  run() {
    activeEffect = this
    this._fn()
    activeEffect = null
  }
}

const targetMap = new Map()

export function track(target, key) {
  // 去看一个 targetMap 中有没有某个属性的值
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  // 取依赖
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  dep.add(activeEffect)
}

let activeEffect

export function trigger(target, key) {
  const depsMap = targetMap.get(target)
  const dep = depsMap.get(key)
  // set
  for (const effect of dep) {
    effect.run()
  }
}

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
