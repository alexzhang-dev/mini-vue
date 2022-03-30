import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  setup() {
    const counter = ref(1)
    function inc() {
      counter.value += 1
    }
    const props = ref({
      foo: 'foo',
      bar: 'bar',
    })
    function patchProp1() {
      // 逻辑1: old !== new
      props.value.foo = 'new-foo'
    }
    function patchProp2() {
      // 逻辑2: new === undefined || null, remove new
      props.value.bar = undefined
    }
    function patchProp3() {
      // 逻辑3: old 存在，new 不存在，remove new
      props.value = {
        bar: 'bar',
      }
    }
    return {
      counter,
      inc,
      props,
      patchProp1,
      patchProp2,
      patchProp3,
    }
  },
  render() {
    return h(
      'div',
      {
        foo: this.props.foo,
        bar: this.props.bar,
      },
      [
        h('div', {}, 'counter: ' + this.counter),
        h('button', { onClick: this.inc }, 'inc'),
        h(
          'button',
          { onClick: this.patchProp1 },
          '规则1，foo 应该修改为 new-foo'
        ),
        h('button', { onClick: this.patchProp2 }, '规则2，bar 应该会被删除'),
        h('button', { onClick: this.patchProp3 }, '规则3，foo 应该会被删除'),
      ]
    )
  },
}
