class ReactiveEffect {
  private _fn: any
  // [scheduler] 构造函数加入 options，这里使用 public 可以供外部使用
  constructor(fn, public options) {
    this._fn = fn
  }
  run() {
    // 保存一下当前的 activeEffect
    activeEffect = this
    const res = this._fn()
    // [runner] return 运行的值
    return res
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
    // [scheduler] 这里需要判断一下 scheduler，如果存在就去运行 scheduler 而不是 fn
    if (effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect.run()
    }
  }
}

// 需要一个全局变量来保存当前的 effect
let activeEffect

export function effect(fn, options: any = {}) {
  // [scheduler]在创建 ReactiveEffect 实例的时候，保存一下 options
  const _effect = new ReactiveEffect(fn, options)
  _effect.run()
  // [runner]: 在这里将 run 方法 return 出去
  // 但是要注意 this 指向问题，所以可以 bind 后 return 出去
  return _effect.run.bind(_effect)
}
