import { effect } from '../effect'
import { isReactive, reactive } from '../reactive'
import { isRef, proxyRefs, ref, unRef } from '../ref'

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
  it('isRef', () => {
    expect(isRef(1)).toBe(false)
    expect(isRef(ref(1))).toBe(true)
    expect(isRef(reactive({ foo: 1 }))).toBe(false)
  })
  it('unRef', () => {
    expect(unRef(ref(1))).toBe(1)
    expect(unRef(1)).toBe(1)
  })
  it('proxyRef', () => {
    const foo = {
      bar: ref(1),
      baz: 'baz',
    }

    // get
    const proxyFoo = proxyRefs(foo)
    expect(foo.bar.value).toBe(1)
    expect(proxyFoo.bar).toBe(1)

    // set
    proxyFoo.bar = 10
    expect(proxyFoo.bar).toBe(10)
    expect(foo.bar.value).toBe(10)

    proxyFoo.bar = ref(20)
    expect(proxyFoo.bar).toBe(20)
    expect(foo.bar.value).toBe(20)
  })
})
