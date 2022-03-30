import { effect } from '../reactivity'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { createAppAPI } from './createApp'
import { Fragment, TextNode } from './vnode'

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    insert: hostInsert,
    patchProp: hostPatchProp,
    selector: hostSelector,
  } = options

  function render(vnode, container, parentInstance) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(null, vnode, container, parentInstance)
  }

  function patch(n1, n2, container, parentInstance) {
    const { type, shapeFlags } = n2
    switch (type) {
      case Fragment:
        processFragment(n1, n2, container, parentInstance)
        break
      case TextNode:
        processTextNode(n2, container)
        break
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentInstance)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n2, container, parentInstance)
        }
        break
    }
  }

  function processTextNode(vnode, container) {
    // TextNode 本身就是纯 text
    const element = (vnode.el = document.createTextNode(vnode.children))
    container.appendChild(element)
  }

  function processFragment(n1, n2, container, parentInstance) {
    // 因为 fragment 就是用来处理 children 的
    mountChildren(n1, n2, container, parentInstance)
  }

  function processElement(n1, n2, container, parentInstance) {
    // n1 存在，update 逻辑
    if (n1) {
      patchElement(n1, n2, container)
    } else {
      // 不存在 init 逻辑
      mountElement(n1, n2, container, parentInstance)
    }
  }

  function patchElement(n1, n2, container) {
    // TODO patch props
    // TODO patch children
  }

  function mountElement(n1, n2, container, parentInstance) {
    // 此函数就是用来将 vnode -> domEl 的
    const { type: domElType, props, children, shapeFlags } = n2
    // 创建 dom
    const domEl = (n2.el = hostCreateElement(domElType))
    // 加入 attribute
    for (const prop in props) {
      hostPatchProp(domEl, prop, props[prop])
    }
    // 这里需要判断children两种情况，string or array
    if (shapeFlags & ShapeFlags.TEXT_CHILDREN) {
      domEl.textContent = children
    } else if (shapeFlags & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(n1, n2, domEl, parentInstance)
    }
    // 最后将 domEl 加入 dom 树中
    hostInsert(domEl, container)
  }

  function mountChildren(n1, n2, container, parentInstance) {
    n2.children.forEach(vnode => {
      patch(n1, vnode, container, parentInstance)
    })
  }

  function processComponent(vnode, container, parentInstance) {
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
    effect(() => {
      if (instance.isMounted) {
        // update 逻辑
        const subTree = instance.render.call(instance.proxy)
        vnode.el = subTree.el
        const preSubTree = instance.subTree
        instance.subTree = subTree
        patch(preSubTree, subTree, container, instance)
      } else {
        // init 逻辑
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ))
        patch(null, subTree, container, instance)
        vnode.el = subTree.el
        instance.isMounted = true
      }
    })
  }

  return {
    createApp: createAppAPI(render, hostSelector),
  }
}
