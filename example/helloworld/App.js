import { h } from '../../lib/mini-vue.esm.js'

export default {
  render() {
    return h(
      'div',
      { class: 'red' },
      // string
      //'hi mini-vue',
      // array
      [h('p', { class: 'red' }, 'hello'), h('p', { class: 'blue' }, 'mini-vue')]
    )
  },
  setup() {
    return {
      title: 'mini-vue',
    }
  },
}
