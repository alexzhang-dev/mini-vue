import { createRenderer } from '../runtime-core'
import { EventHandler, PropsValue } from '../runtime-core/types/element'
import { VNode } from '../runtime-core/vnode'
import type { ElementType, NormalNode } from './types'

function createElement(type: ElementType) {
  return document.createElement(type)
}

const isOn = (key: string) => /^on[A-Z]/.test(key)

function patchProp(e: NormalNode, prop: string | keyof HTMLElementEventMap, val: PropsValue) {
  const el = e as HTMLElement
  if (isOn(prop)) {
    const event = prop.slice(2).toLowerCase() as keyof HTMLElementEventMap
    el.addEventListener(event, val as EventHandler)
  } else {
    if (val === undefined || null) el.removeAttribute(prop)
    else el.setAttribute(prop, val as string)
  }
}

function insert<T extends NormalNode>(el: T, parent: T, anchor: T) {
  (parent as HTMLElement).insertBefore((el as HTMLElement), anchor || null)
}

function selector(container: string) {
  return document.querySelector(container)
}

function remove(c: NormalNode) {
  const child = c as HTMLElement
  const parentElement = child.parentNode
  if (parentElement) {
    parentElement.removeChild(child)
  }
}

function setElementText(e: NormalNode, text: string) {
  const el = e as HTMLElement
  el.textContent = text
}

const renderer = createRenderer({
  createElement,
  patchProp,
  insert,
  selector,
  remove,
  setElementText,
})

export const createApp = (rootComponent: VNode) => {
  return renderer.createApp(rootComponent)
}

export * from '../runtime-core'
export * from '../reactivity'
