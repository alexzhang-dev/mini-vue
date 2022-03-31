import { effect } from '../reactivity'
import { EMPTY_OBJ } from '../shared'
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
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options

  function render(vnode, container, parentInstance) {
    // 这里的 render 调用 patch 方法，方便对于子节点进行递归处理
    patch(null, vnode, container, parentInstance)
  }

  function patch(n1, n2, container, parentInstance) {
    const { type, shapeFlags } = n2
    switch (type) {
      case Fragment:
        processFragment(n2, container, parentInstance)
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

  function processFragment(n2, container, parentInstance) {
    // 因为 fragment 就是用来处理 children 的
    mountChildren(n2.children, container, parentInstance)
  }

  function processElement(n1, n2, container, parentInstance) {
    // n1 存在，update 逻辑
    if (n1) {
      patchElement(n1, n2, container, parentInstance)
    } else {
      // 不存在 init 逻辑
      mountElement(n1, n2, container, parentInstance)
    }
  }

  function patchElement(n1, n2, container, parentInstance) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
    patchChildren(n1, n2, container, parentInstance)
  }

  function patchChildren(n1, n2, container, parentInstance) {
    const prevShapeFlag = n1.shapeFlags
    const shapeFlag = n2.shapeFlags
    const c1 = n1.children
    const c2 = n2.children
    // 情况1：array => text
    // 对新的 shapeFlag 进行判断
    // 如果是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        // 如果老的 shapeFlag 是 array_children，需要做两件事
        // 1. 清空原有 children
        unmountChildren(n1.children)
        // 2. 挂载文本 children
      }
      if (c1 !== c2) {
        hostSetElementText(n2.el, c2)
      }
    } else {
      if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
        // 如果是 text -> array
        // 1. 清空 text
        hostSetElementText(n1.el, '')
        // 2. mountChildren
        mountChildren(c2, container, parentInstance)
      }
    }
  }

  function unmountChildren(children) {
    for (let i = 0; i < children.length; i++) {
      // 遍历 children，同时执行 remove 逻辑
      // 由于这里涉及到元素渲染的实际操作，所以我们要抽离出去作为一个API
      hostRemove(children[i].el)
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps === newProps) return
    // 情况1: old !== new 这个走更新的逻辑
    for (const propKey of Reflect.ownKeys(newProps)) {
      const oldProp = oldProps[propKey]
      const newProp = newProps[propKey]
      if (oldProp !== newProp) {
        // 更新属性
        hostPatchProp(el, propKey, newProp, oldProp)
      }
    }
    // 情况2: old 存在，new !== undefined，这个走删除的逻辑
    // 情况2 在 hostPatchProp 内部处理
    // 情况3: old 存在，new 不存在，这个也走删除的逻辑
    if (oldProps !== EMPTY_OBJ) {
      for (const propKey of Reflect.ownKeys(oldProps)) {
        if (!(propKey in oldProps)) {
          hostPatchProp(el, propKey, undefined, oldProps[propKey])
        }
      }
    }
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
      mountChildren(n2.children, domEl, parentInstance)
    }
    // 最后将 domEl 加入 dom 树中
    hostInsert(domEl, container)
  }

  function mountChildren(children, container, parentInstance) {
    children.forEach(vnode => {
      patch(null, vnode, container, parentInstance)
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
