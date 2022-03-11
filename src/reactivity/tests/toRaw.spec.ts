import {
  reactive,
  readonly,
  shallowReactive,
  shallowReadonly,
  toRaw,
} from '../reactive'

describe('toRaw', () => {
  it('happy path', () => {
    // toRaw 可以 return 通过 `reactive` 、 `readonly` 、`shallowReactive` 、`shallowReadonly` 包装的 origin 值
    const reactiveOrigin = { key: 'reactive' }
    expect(toRaw(reactive(reactiveOrigin))).toEqual(reactiveOrigin)
    const readonlyOrigin = { key: 'readonly' }
    expect(toRaw(readonly(readonlyOrigin))).toEqual(readonlyOrigin)
    const shallowReadonlyOrigin = { key: 'shallowReadonly' }
    expect(toRaw(shallowReadonly(shallowReadonlyOrigin))).toEqual(
      shallowReadonlyOrigin
    )
    const shallowReactiveOrigin = { key: 'shallowReactive' }
    expect(toRaw(shallowReactive(shallowReactiveOrigin))).toEqual(
      shallowReactiveOrigin
    )

    const nestedWrapped = {
      foo: { bar: { baz: 1 }, foo2: { bar: { baz: 2 } } },
    }
    expect(toRaw(reactive(nestedWrapped))).toEqual(nestedWrapped)
  })
})
