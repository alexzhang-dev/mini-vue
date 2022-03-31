import { createRenderer } from '../runtime-core'

function createElement(type) {
  return document.createElement(type)
}

const isOn = (key: string) => /^on[A-Z]/.test(key)

function patchProp(el, prop, val, oldVal) {
  if (isOn(prop)) {
    const event = prop.slice(2).toLowerCase()
    el.addEventListener(event, val)
  } else {
    console.log({ prop, val, oldVal })

    if (val === undefined || null) el.removeAttribute(prop)
    else el.setAttribute(prop, val)
  }
}

function insert(el, parent) {
  parent.appendChild(el)
}

function selector(container) {
  return document.querySelector(container)
}

function remove(child) {
  const parentElement = child.parentNode
  if (parentElement) {
    parentElement.removeChild(child)
  }
}

function setElementText(el, text) {
  el.textContent = text
}

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  selector,
  remove,
  setElementText,
})

export const createApp = (...args) => {
  return renderer.createApp(...args)
}

export * from '../runtime-core'
