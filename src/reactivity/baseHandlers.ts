import { isObject, extend } from '../shared'
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive'

const get = createGetter()
const readonlyGet = createGetter(true)
const set = createSetter()
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key, receiver)
    // 如果是 shallow ，直接 return res 即可
    if (shallow) return res

    // [嵌套转换]
    // 在 shared 中写一个工具函数 isObject 用于判断是否是对象
    if (isObject(res)) {
      return isReadonly ? readonly(res) : reactive(res)
    }

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
  get: readonlyGet,
  set(target, key, value) {
    console.warn(
      `key: ${key} set value: ${value} fail, because the target is readonly`,
      target
    )
    return true
  },
}

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})
