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
})
