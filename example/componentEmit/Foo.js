import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    const handleClick = () => {
      emit('add')
    }
    return {
      handleClick,
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
