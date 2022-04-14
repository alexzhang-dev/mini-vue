import { h } from '../h'
import { InternalSlots } from '../types/slots'
import { Fragment } from '../vnode'

export function renderSlots(slots: InternalSlots, name: string = 'default', props: unknown) {
  // slots 只能是 Object
  const slot = slots[name]
  if (slot) {
    if (typeof slot === 'function') {
      return h(Fragment, {}, slot(props))
    }
  }
}
