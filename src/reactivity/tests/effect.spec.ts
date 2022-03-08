import { effect, stop } from '../effect'
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
  it('stop', () => {
    let dummy
    const obj = reactive({ prop: 1 })
    const runner = effect(() => {
      dummy = obj.prop
    })
    obj.prop = 2
    expect(dummy).toBe(2)
    // stop 一个 runner 之后
    stop(runner)
    obj.prop++
    // 依赖再次更新，当时传入的 effect 则不会重新执行
    expect(dummy).toBe(2)
    // runner 不受到影响
    runner()
    expect(dummy).toBe(3)
  })

  it('stop should not clean other effect', () => {
    const foo = reactive({
      foo: 1,
    })
    const bar = reactive({
      bar: 2,
    })
    let baz
    effect(() => {
      baz = foo.foo + bar.bar
    })
    foo.foo = 2
  })

  it('onStop', () => {
    const obj = reactive({
      foo: 1,
    })
    const onStop = jest.fn()
    let dummy
    // onStop 是一个函数，也是 effect 的 option
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      {
        onStop,
      }
    )
    // 在调用 stop 的时候，onStop 也会执行
    stop(runner)
    expect(onStop).toBeCalledTimes(1)
  })
})
