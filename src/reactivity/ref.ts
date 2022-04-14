import { hasChanged, isObject } from '../shared/index'
import { trackEffect, triggerEffect } from './effect'
import { reactive } from './reactive'

const enum RefFlags {
  IS_REF = '__v_isRef',
}

class RefImpl {
  private _value: any
  // 这里我们也需要一个 deps Set 用于储存所有的依赖
  public deps = new Set()
  constructor(value) {
    this._value = isObject(value) ? reactive(value) : value
    this[RefFlags.IS_REF] = true
  }
  get value() {
    // 在 get 中进行依赖收集
    trackEffect(this.deps)
    return this._value
  }
  set value(newValue) {
    if (hasChanged(this._value, newValue)) {
      this._value = newValue
      // 在 set 中进行触发依赖
      triggerEffect(this.deps)
    }
  }
}

export function ref(value) {
  return new RefImpl(value)
}

export function isRef(ref) {
  return !!ref[RefFlags.IS_REF]
}

export function unRef(ref) {
  return ref[RefFlags.IS_REF] ? ref.value : ref
}

export function proxyRefs(objectWithRefs) {
  if(!isObject(objectWithRefs)) return
  return new Proxy(objectWithRefs, {
    get(target, key, receiver) {
      // 自动 unRef
      return unRef(Reflect.get(target, key, receiver))
    },
    set(target, key, value, receiver) {
      // set 分为两种情况，如果原来的值是 ref，并且新的值不是 ref
      // 那么就去更新原来的 ref.value = newValue
      // 第二种情况就是原来的值是 ref，newValue 也是一个 ref
      // 那么就直接替换就 OK 了
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key].value = value)
      } else {
        return Reflect.set(target, key, value, receiver)
      }
    },
  })
}
