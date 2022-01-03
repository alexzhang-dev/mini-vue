import { reactive } from '../reactive'
import { effect } from '../effect'

describe('result', () => {
  it('should ', () => {
    const foo = reactive({
      value: 1,
    })
    let newFoo
    effect(() => {
      newFoo = foo.value * 10
    })
    expect(newFoo).toBe(10)
    foo.value = 20
    expect(newFoo).toBe(200)
  })
  it('runner', () => {
    let counter = 0
    const runner = effect(() => {
      counter++
    })
    expect(counter).toBe(1)
    runner()
    expect(counter).toBe(2)
  })
  it('scheduler', () => {
    // 1. effect 接收两个参数，第二个参数可以传入一个函数 scheduler
    // 2. effect 先执行第一个函数，scheduler 不会自动执行
    // 3. 当 reactive 执行 set update 的时候，scheduler 会执行，但是 runner 不会执行
    let dummy
    let run: any
    const scheduler = jest.fn(() => {
      run = runner
    })
    const obj = reactive({ foo: 1 })
    const runner = effect(
      () => {
        dummy = obj.foo
      },
      { scheduler }
    )
    expect(scheduler).not.toHaveBeenCalled()
    expect(dummy).toBe(1)
    // should be called on first trigger
    obj.foo++
    expect(scheduler).toHaveBeenCalledTimes(1)
    // should not run yet
    expect(dummy).toBe(1)
    // manually run
    run()
    // should have run
    expect(dummy).toBe(2)
  })
})
