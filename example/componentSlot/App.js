import { h } from '../../lib/mini-vue.esm.js'
import { Foo } from './Foo.js'

export default {
  render() {
    const app = h('div', {}, 'App')
    // const foo = h(Foo, {}, [h('div', {}, '123')])
    // 我们可以从数组的形式转换为 Object 的形式
    // 通过 key 来指定位置
    const foo = h(
      Foo,
      {},
      {
        header: ({ count }) => h('div', {}, '123' + count),
        footer: () => h('div', {}, '456'),
      }
    )
    return h('div', {}, [app, foo])
  },
  setup() {},
}
