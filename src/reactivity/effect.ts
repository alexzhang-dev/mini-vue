import { extend } from '../shared/index'

// 需要一个全局变量来保存当前的 effect
let activeEffect, shouldTrack
export class ReactiveEffect {
  private _fn: any
  // [stop] 反向记录自己对应的 dep 那个 set
  deps = []
  active = true
  onStop?: () => void
  // [scheduler] 构造函数加入 options，这里使用 public 可以供外部使用
  constructor(fn, public options) {
    this._fn = fn
  }
  run() {
    if (!this.active) {
      return this._fn()
    }
    // 保存一下当前的 activeEffect
    shouldTrack = true
    activeEffect = this
    const res = this._fn()
    shouldTrack = false
    // [runner] return 运行的值
    return res
  }
  // [stop] 这个方法的作用就是去根据 this.deps 删除 this 对应的 effect
  stop() {
    cleanupEffect(this)
    // [onStop] 如果存在 onStop，就去运行 onStop
    if (this.onStop) this.onStop()
    this.active = false
  }
}

function cleanupEffect(effect) {
  if (effect.active) {
    effect.deps.forEach((dep: any) => {
      dep.delete(effect)
    })
    // 这里就没必要存了，直接清空就可以
    effect.deps.length = 0
  }
}

// 创建全局变量 targetMap
const targetMap = new WeakMap()
export function track(target, key) {
  if (!isTracking()) return
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
  // [stop]：反向追踪 activeEffect 的 dep
  // 因为一个 activeEffect 可能会对应多个 dep，每个 dep 是一个 set
  // 这里我们可以使用一个数组
  trackEffect(dep)
}

export function trackEffect(dep) {
  if (dep.has(activeEffect)) return
  activeEffect && activeEffect.deps.push(dep)
  dep.add(activeEffect)
}

export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}

export function trigger(target, key) {
  // trigger 的逻辑就更加简单了，我们只需要取出对应的 deps 这个 set，再遍历执行每个 effect 就可以了
  const depsMap = targetMap.get(target)
  const deps = depsMap.get(key)
  triggerEffect(deps)
}

export function triggerEffect(deps) {
  for (const effect of deps) {
    // [scheduler] 这里需要判断一下 scheduler，如果存在就去运行 scheduler 而不是 fn
    if (effect.options.scheduler) {
      effect.options.scheduler()
    } else {
      effect.run()
    }
  }
}

export function stop(runner) {
  // [stop] 如何获取到当前所属的 effect 实例呢？
  runner.effect.stop()
}

export function effect(fn, options: any = {}) {
  // [scheduler]在创建 ReactiveEffect 实例的时候，保存一下 options
  const _effect = new ReactiveEffect(fn, options)
  // [stop] 这里我们 options 会接收一个 onStop 方法
  // 其实我们可以将 options 中的所有数据全部挂载在 effect 上面
  // extend = Object.assign 封装一下是为了语义化更好
  extend(_effect, options)
  _effect.run()
  // [runner]: 在这里将 run 方法 return 出去
  // 但是要注意 this 指向问题，所以可以 bind 后 return 出去
  const runner: any = _effect.run.bind(_effect)
  // [stop] 在这里挂载一下所属的 effect
  runner.effect = _effect
  return runner
}
