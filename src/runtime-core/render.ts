import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { Fragment, TextNode } from './vnode'

export function render(vnode, container, parentInstance) {
  // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
  patch(vnode, container, parentInstance)
}

export function patch(vnode, container, parentInstance) {
  const { type, shapeFlags } = vnode
  switch (type) {
    case Fragment:
      processFragment(vnode, container, parentInstance)
      break
    case TextNode:
      processTextNode(vnode, container)
      break
    default:
      if (shapeFlags & ShapeFlags.ELEMENT) {
        processElement(vnode, container, parentInstance)
      } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
        processComponent(vnode, container, parentInstance)
      }
      break
  }
}

function processTextNode(vnode, container) {
  // TextNode 本身就是纯 text
  const element = (vnode.el = document.createTextNode(vnode.children))
  container.appendChild(element)
}

function processFragment(vnode, container, parentInstance) {
  // 因为 fragment 就是用来处理 children 的
  mountChildren(vnode, container, parentInstance)
}

function processElement(vnode, container, parentInstance) {
  // 分为 init 和 update 两种，这里先写 init
  mountElement(vnode, container, parentInstance)
}

function mountElement(vnode, container, parentInstance) {
  // 此函数就是用来将 vnode -> domEl 的
  const { type: domElType, props, children, shapeFlags } = vnode
  // 创建 dom
  const domEl = (vnode.el = document.createElement(domElType))
  // 加入 attribute
  const isOn = (key: string) => /^on[A-Z]/.test(key)
  for (const prop in props) {
    if (isOn(prop)) {
      const event = prop.slice(2).toLowerCase()
      domEl.addEventListener(event, props[prop])
    } else {
      domEl.setAttribute(prop, props[prop])
    }
  }
  // 这里需要判断children两种情况，string or array
  if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
    domEl.textContent = children
  } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
    mountChildren(vnode, domEl, parentInstance)
  }
  // 最后将 domEl 加入 dom 树中
  container.appendChild(domEl)
}

function mountChildren(vnode, container, parentInstance) {
  vnode.children.forEach(vnode => {
    patch(vnode, container, parentInstance)
  })
}

export function processComponent(vnode, container, parentInstance) {
  mountComponent(vnode, container, parentInstance)
}

function mountComponent(vnode, container, parentInstance) {
  // 通过 vnode 获取组件实例
  const instance = createComponentInstance(vnode, parentInstance)
  // setup component
  setupComponent(instance)
  // setupRenderEffect
  setupRenderEffect(instance, vnode, container)
}

function setupRenderEffect(instance, vnode, container) {
  const subTree = instance.render.call(instance.proxy)
  patch(subTree, container, instance)
  vnode.el = subTree.el
}
