import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'
window.self = null

export default {
  render() {
    window.self = this
    return h(
      'div',
      {
        class: 'red', // event
        onClick() {
          console.log('click')
        },
        onMousedown() {
          console.log('mousedown')
        },
      },
      // string
      // 'hi mini-vue'
      // array
      // [h('p', { class: 'red' }, 'hello'), h('p', { class: 'blue' }, this.title)]
      // setupState
      // 'hi ' + this.title
      // component
      [h(Foo, { count: 1 })]
    )
  },
  setup() {
    return {
      title: 'mini-vue',
    }
  },
}
