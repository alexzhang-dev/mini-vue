import { hasChanged, isObject } from '../shared'
import { trackEffect, triggerEffect, isTracking } from './effect'
import { reactive } from './reactive'

class RefImpl {
  private _value: any
  // 这里我们也需要一个 deps Set 用于储存所有的依赖
  public deps = new Set()
  constructor(value) {
    this._value = isObject(value) ? reactive(value) : value
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
