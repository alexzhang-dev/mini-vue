import { h } from '../../lib/mini-vue.esm.js'

export const Foo = {
  setup(props, { emit }) {
    const handleClick = () => {
      emit('add', 1, 2)
      emit('add-count', 1)
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
