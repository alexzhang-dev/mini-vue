import { h, ref } from '../../lib/mini-vue.esm.js'

export default {
  setup() {
    const counter = ref(1)
    function inc() {
      counter.value += 1
    }
    return {
      counter,
      inc,
    }
  },
  render() {
    return h('div', {}, [
      h('div', {}, 'counter: ' + this.counter),
      h('button', { onClick: this.inc }, 'inc'),
    ])
  },
}
