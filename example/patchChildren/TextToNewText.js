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
    return h('div', {}, this.isChange ? 'newChildren' : 'oldChildren')
  },
}
