import { h } from '../../lib/mini-vue.esm.js'

window.self = null

export default {
  render() {
    window.self = this
    return h(
      'div',
      { class: 'red' },
      // string
      //'hi mini-vue',
      // array
      [h('p', { class: 'red' }, 'hello'), h('p', { class: 'blue' }, 'mini-vue')]
      // setupState
      // 'hi ' + this.title
    )
  },
  setup() {
    return {
      title: 'mini-vue',
    }
  },
}
