import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup(props) {
    const handleClick = () => {
      console.log('aaaa')
    }
    return {
      handleClick,
      aa: '111',
    }
  },
  render() {
    return h(
      'button',
      {
        onClick: this.handleClick,
      },
      '点击我'
    )
  },
}
