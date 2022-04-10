import { ref } from '../../lib/mini-vue.esm.js'

export default {
  setup() {
    return {
      message: 'mini-vue',
    }
  },
  template: `<div>hi, {{message}}</div>`,
}
