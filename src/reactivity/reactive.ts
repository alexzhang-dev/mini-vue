import { track, trigger } from './effect'

export function reactive(raw) {
  return new Proxy(raw, {
    get(target, key, receiver) {
      const res = Reflect.get(target, key, receiver)
      // 在 get 时收集依赖
      track(target, key)
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      // 在 set 时触发依赖
      trigger(target, key)
      return res
    },
  })
}
