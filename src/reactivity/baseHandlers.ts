import { track, trigger } from './effect'

const get = createGetter()
const set = createSetter()

function createGetter(isReadonly = false) {
  return function get(target, key, receiver) {
    const res = Reflect.get(target, key, receiver)
    // 在 get 时收集依赖
    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}

function createSetter() {
  return function set(target, key, value, receiver) {
    const res = Reflect.set(target, key, value, receiver)
    // 在 set 时触发依赖
    trigger(target, key)
    return res
  }
}

// mutable 可变的
export const mutableHandlers = {
  get,
  set,
}

export const readonlyHandlers = {
  get,
  set(target, key, value) {
    return true
  },
}
