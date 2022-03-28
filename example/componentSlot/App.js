import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    return h('div', {}, [
      h(Foo, {}, [h('div', {}, '123'), h('div', {}, '456')]),
      // h(Foo, {}, h('div', {}, '123')),
    ])
  },
  setup() {},
}
