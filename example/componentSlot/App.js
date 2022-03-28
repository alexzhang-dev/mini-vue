import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    return h('div', {}, [h(Foo, {}, h('div', {}, 'slot Foo'))])
  },
  setup() {},
}
