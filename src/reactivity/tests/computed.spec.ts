import { computed } from '../computed'
import { reactive } from '../reactive'

describe('computed', () => {
  it('happy path', () => {
    const user = reactive({
      age: 1,
    })

    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)
  })
  it('should computed lazily', () => {
    const value = reactive({ foo: 1 })
    const getter = jest.fn(() => value.foo)
    const cValue = computed(getter)

    // lazy
    expect(getter).not.toHaveBeenCalled()
    // 触发 get 操作时传入的 getter 会被调用一次
    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // 不会再次调用 computed
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // 在不需要这个 computed 的时候 value 变了 computed 也不会执行
    value.foo = 2
    expect(getter).toHaveBeenCalledTimes(1)

    // 在需要这个 computed 的时候再次计算（如果 computed 依赖的值已经发生更改）
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    // 不变拿的就是缓存
    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)
  })
})
