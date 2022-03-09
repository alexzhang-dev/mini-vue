import { readonly } from '../reactive'

describe('readonly', () => {
  it('happy path', () => {
    // not set
    const original = { foo: 1, bar: 2 }
    const wrapped = readonly(original)
    expect(wrapped).not.toBe(original)
    expect(wrapped.bar).toBe(2)
    wrapped.foo = 2
    expect(wrapped.foo).toBe(1)
  })
})
