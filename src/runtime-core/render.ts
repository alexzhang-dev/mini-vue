import { createComponentInstance, setupComponent } from './component'

export function render(vnode, container) {
  // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
  patch(vnode, container)
}

export function patch(vnode, container) {
  // 去处理组件，在脑图中我们可以第一步是先判断 vnode 的类型
  // 这里先只处理 component 类型

  processComponent(vnode, container)
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
