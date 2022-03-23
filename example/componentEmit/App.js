import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    return h('div', {}, [
      h('p', {}, 'hello'),
      h(Foo, { onAdd: this.onAdd, onAddCount: this.onAddCount }),
    ])
  },
  setup() {
    function onAdd(a, b) {
      console.log('onAdd', a, b)
    }
    function onAddCount(num) {
      console.log('onAddCount', num)
    }
    return {
      onAdd,
      onAddCount,
    }
  },
}
