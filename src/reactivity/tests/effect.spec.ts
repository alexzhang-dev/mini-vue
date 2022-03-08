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
  it('scheduler', () => {
    // 1. scheduler 作为 effect 的一个 option
    // 2. 有了 scheduler 之后原来的 fn 参数只会执行初始化的一次
    // 3. 如果依赖更新时不会执行 fn ，而是会去执行 scheduler
    // 4. runner 不受影响
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    // 在这里将 scheduler 作为一个 option 传入 effect
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    // 会执行一次 effect 传入的 fn
    expect(dummy).toBe(1)
    obj.foo++
    // 有了 scheduler 之后，原来的 fn 就不会执行了
    expect(scheduler).toHaveBeenCalledTimes(1)
    expect(dummy).toBe(1)
    run()
    expect(dummy).toBe(2)
  })
})
