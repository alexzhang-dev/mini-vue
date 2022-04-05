import { h } from '../../lib/mini-vue.esm.js'
export default {
  name: 'Child',
  setup() {
    return {}
  },
  render(proxy) {
    return h('div', {}, [
      h('div', {}, 'child - props - msg: ' + this.$props.msg),
    ])
  },
}
