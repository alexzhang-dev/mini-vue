import { h } from '../h'

export function renderSlots(slots, name = 'default', props) {
  // 此时 slots 就是 Object
  const slot = slots[name]
  if (slot) {
    return h('div', {}, slot(props))
  }
}
