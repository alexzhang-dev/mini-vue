import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    return h('div', {}, [h('p', {}, 'hello'), h(Foo, { onAdd: this.onAdd })])
  },
  setup() {
    function onAdd() {
      console.log('onAdd')
    }
    return {
      onAdd,
    }
  },
}
