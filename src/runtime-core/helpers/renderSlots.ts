import { h } from '../h'
import { InternalSlots } from '../types/slots'
import { Fragment } from '../vnode'

export function renderSlots(slots: InternalSlots, name: string = 'default', props: unknown) {
  // 此时 slots 就是 Object
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return h(Fragment, {}, slot(props))
    }
  }
}
