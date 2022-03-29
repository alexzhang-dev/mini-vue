import { h, getCurrentInstance } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    return h('div', {}, [h(Foo)])
  },
  setup() {
    console.log('App:', getCurrentInstance())
  },
}
