
import { isArray, isFunction } from "../shared"
import { ShapeFlags } from "../shared/ShapeFlags"
import { Component } from "./component"
import { RawSlotsType } from "./types/slots"
import { VNode } from "./vnode"

export function initSlots(instance: Component, children: VNode["children"]) {
  const { vnode } = instance
  if (vnode.shapeFlags & ShapeFlags.SLOT_CHILDREN)
    normalizeObjectSlots(children as RawSlotsType, instance.slots)
}


function normalizeObjectSlots(rawSlots: RawSlotsType, slots: Component["slots"]) {
  for (const key in rawSlots) {
    const slot = rawSlots[key]
    if (isFunction(slot))
      slots[key] = props => normalizeSlotValue(slot(props))
  }
}
function normalizeSlotValue(slots: VNode | VNode[]): VNode[] {
  return isArray(slots) ? slots : [slots]
}
