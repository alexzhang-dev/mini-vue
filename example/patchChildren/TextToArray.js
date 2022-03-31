import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  setup() {
    const isChange = ref(false)
    window.isChange = isChange
    return {
      isChange,
    }
  },
  render() {
    return h(
      'div',
      {},
      this.isChange
        ? [h('div', {}, 'newChildren1'), h('div', {}, 'newChildren2')]
        : 'oldChildren'
    )
  },
}
