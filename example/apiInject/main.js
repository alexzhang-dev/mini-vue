import { createApp, h, provide, inject } from '../../lib/mini-vue.esm.js'

const Provider = {
  render() {
    return h('div', {}, [h('div', {}, 'Provider'), h(Consumer)])
  },
  setup() {
    provide('foo', 'foo')
  },
}

const Consumer = {
  render() {
    return h('div', {}, 'Consumer: ' + `inject foo: ${this.foo}`)
  },
  setup() {
    return {
      aa: '111',
      foo: inject('foo'),
    }
  },
}

createApp(Provider).mount('#app')
