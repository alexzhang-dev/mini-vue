import { h } from '../h'
import { Fragment } from '../vnode'

export function renderSlots(slots, name = 'default', props) {
  // 此时 slots 就是 Object
  const slot = slots[name]
  if (slot) {
    return h(Fragment, {}, slot(props))
  }
}
