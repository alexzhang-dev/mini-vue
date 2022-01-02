import { reactive } from '../reactive'

describe('result', () => {
  it('should ', () => {
    const foo = {
      value: 0,
    }
    const observe = reactive(foo)
    expect(observe).not.toBe(foo)
    expect(observe.value).toBe(0)
  })
})
