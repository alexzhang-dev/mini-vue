import { createRenderer } from '../runtime-core'

function createElement(type) {
  return document.createElement(type)
}

const isOn = (key: string) => /^on[A-Z]/.test(key)

function patchProp(el, prop, props) {
  if (isOn(prop)) {
    const event = prop.slice(2).toLowerCase()
    el.addEventListener(event, props[prop])
  } else {
    el.setAttribute(prop, props[prop])
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
