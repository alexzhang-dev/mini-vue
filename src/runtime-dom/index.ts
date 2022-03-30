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

const renderer: any = createRenderer({
  createElement,
  patchProp,
  insert,
  selector,
})

export const createApp = (...args) => {
  return renderer.createApp(...args)
}

export * from '../runtime-core'
