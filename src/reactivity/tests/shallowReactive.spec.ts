import { isReactive, shallowReactive } from '../reactive'

describe('shallowReactive', () => {
  it('happy path', () => {
    const original = { foo: { bar: 1 } }
    const observed = shallowReactive(original)
    expect(isReactive(observed)).toBe(true)
    expect(isReactive(observed.foo)).toBe(false)
  })
})
