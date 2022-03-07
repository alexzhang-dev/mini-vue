class ReactiveEffect {
  private _fn: any
  constructor(fn) {
    this._fn = fn
  }
  run() {
    // 保存一下当前的 activeEffect
    activeEffect = this
    this._fn()
  }
}

// 创建全局变量 targetMap
const targetMap = new WeakMap()
export function track(target, key) {
  // 我们在运行时，可能会创建多个 target，每个 target 还会可能有多个 key，每个 key 又关联着多个 effectFn
  // 而且 target -> key -> effectFn，这三者是树形的关系
  // 因此就可以创建一个 WeakMap 用于保存 target，取出来就是每个 key 对应这一个 depsMap，而每个 depsMap 又是一个 Set
  // 数据结构（避免保存重复的 effect）
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }
  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }
  // 将 effect 加入到 set 中
  dep.add(activeEffect)
}

export function trigger(target, key) {
  // trigger 的逻辑就更加简单了，我们只需要取出对应的 deps 这个 set，再遍历执行每个 effect 就可以了
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  for (const effect of deps) {
    effect.run()
  }
}

// 需要一个全局变量来保存当前的 effect
let activeEffect

export function effect(fn) {
  const _effect = new ReactiveEffect(fn)
  _effect.run()
}
