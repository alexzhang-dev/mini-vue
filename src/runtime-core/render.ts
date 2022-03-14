import { isObject } from '../shared/index'
import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
  patch(vnode, container)
}

export function patch(vnode, container) {
  // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
  // 如果是 element 就去处理 element 的逻辑
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement(vnode, container) {
  // 分为 init 和 update 两种，这里先写 init
  mountElement(vnode, container)
}

function mountElement(vnode, container) {
  // 此函数就是用来将 vnode -> domEl 的
  const { type: domElType, props, children } = vnode
  // 创建 dom
  const domEl = document.createElement(domElType)
  // 加入 attribute
  for (const prop in props) {
    domEl.setAttribute(prop, props[prop])
  }
  // 这里需要判断children两种情况，string or array
  if (typeof children === 'string') {
    domEl.textContent = children
  } else if (Array.isArray(children)) {
    mountChildren(vnode, domEl)
  }
  // 最后将 domEl 加入 dom 树中
  container.appendChild(domEl)
}

function mountChildren(vnode, container) {
  vnode.children.forEach(vnode => {
    patch(vnode, container)
  })
}

export function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  // 通过 vnode 获取组件实例
  const instance = createComponentInstance(vnode)
  // setup component
  setupComponent(instance)
  // setupRenderEffect
  setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
  const subTree = instance.render()
  patch(subTree, container)
}
