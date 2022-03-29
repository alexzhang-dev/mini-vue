import { h, getCurrentInstance } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup() {
    console.log('Foo:', getCurrentInstance())
  },
  render() {
    return h('div', {}, 'Foo')
  },
}
