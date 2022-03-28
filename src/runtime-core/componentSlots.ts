export function initSlots(instance, slots) {
  initObjectSlots(instance, slots)
}

function initObjectSlots(instance, slots) {
  if (!slots) return
  // 单独传了一个 h
  if (slots.vnode) {
    instance.slots.default = [slots]
    return
  }
  // 传了一个数组
  if (Array.isArray(slots)) {
    instance.slots.default = slots
    return
  }
  // 传了一个对象
  for (const slotName of Object.keys(slots)) {
    instance.slots[slotName] = normalizeSlots(slots[slotName])
  }
}

function normalizeSlots(slots) {
  return Array.isArray(slots) ? slots : [slots]
}
