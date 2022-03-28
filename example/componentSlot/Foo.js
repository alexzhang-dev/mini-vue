import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup() {},
  render() {
    const foo = h('p', {}, 'foo')
    return h('p', {}, [foo, this.$slots])
  },
}
