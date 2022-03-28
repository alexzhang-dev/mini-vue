import { h } from '../h'

export function renderSlots(slots, name?: string) {
  // 此时 slots 就是 Object
  return h('div', {}, name ? slots[name] : slots.default)
}
