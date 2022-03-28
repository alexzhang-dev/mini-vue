import { h, renderSlots } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup() {},
  render() {
    const foo = h('p', {}, 'foo')
    return h('p', {}, [foo, renderSlots(this.$slots)])
  },
}
