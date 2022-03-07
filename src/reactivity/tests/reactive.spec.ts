import { reactive } from '../reactive'

describe('reactive', () => {
  it('happy path', () => {
    const original = { foo: 1 }
    const observed = reactive(original)
    // 期望包装后和源对象不一样
    expect(observed).not.toBe(original)
    // 期望包装后某个属性的值和源对象一样
    expect(observed.foo).toBe(original.foo)
  })
})
