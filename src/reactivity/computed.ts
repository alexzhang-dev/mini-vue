import { ReactiveEffect } from './effect'

class ComputedRefImpl {
  private _getter: any
  private _value: any
  private _dirty = true
  private _effect: any
  constructor(getter) {
    this._getter = getter
    this._effect = new ReactiveEffect(getter, {
      scheduler: () => {
        // 在 scheduler 中把锁打开
        this._dirty = true
      },
    })
  }
  get value() {
    if (this._dirty) {
      this._value = this._effect.run()
      this._dirty = false
    }
    return this._value
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter)
}
