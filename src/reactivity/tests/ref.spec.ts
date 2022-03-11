import { effect } from '../effect'
import { isReactive } from '../reactive'
import { ref } from '../ref'

describe('ref', () => {
  it('happy path', () => {
    const refFoo = ref(1)
    expect(refFoo.value).toBe(1)
  })
  it('ref should be reactive', () => {
    const r = ref(1)
    let dummy
    let calls = 0
    effect(() => {
      calls++
      dummy = r.value
    })
    expect(calls).toBe(1)
    expect(dummy).toBe(1)
    r.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
    r.value = 2
    expect(calls).toBe(2)
    expect(dummy).toBe(2)
  })
  it('should make nested properties reactive', () => {
    const a = ref({
      foo: 1,
    })
    let dummy
    effect(() => {
      dummy = a.value.foo
    })
    a.value.foo = 2
    expect(dummy).toBe(2)
    expect(isReactive(a.value)).toBe(true)
  })
})
