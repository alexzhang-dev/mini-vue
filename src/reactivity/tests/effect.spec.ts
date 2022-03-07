import { effect } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })
    let nextAge
    effect(() => {
      nextAge = user.age + 1
    })
    expect(nextAge).toBe(11)

    // update
    user.age++
    expect(nextAge).toBe(12)
  })
  it('runner', () => {
    // runner 就是 effect(fn) 返回一个函数，执行该函数就相当于重新执行了一次传入 effect 的 fn
    // 同时执行 runner 也会将 fn 的返回值返回
    let foo = 1
    const runner = effect(() => {
      foo++
      return 'foo'
    })
    expect(foo).toBe(2)
    // 调用 runner
    const r = runner()
    expect(foo).toBe(3)
    // 获取 fn 返回的值
    expect(r).toBe('foo')
  })
})
