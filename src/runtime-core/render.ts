import { effect } from '../reactivity'
import { EMPTY_OBJ } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { createComponentInstance, setupComponent } from './component'
import { shouldUpdateComponent } from './componentUpdateUtils'
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
    patch(null, vnode, container, parentInstance, null)
  }

  function patch(n1, n2, container, parentInstance, anchor) {
    const { type, shapeFlags } = n2
    switch (type) {
      case Fragment:
        processFragment(n2, container, parentInstance, anchor)
        break
      case TextNode:
        processTextNode(n2, container)
        break
      default:
        if (shapeFlags & ShapeFlags.ELEMENT) {
          processElement(n1, n2, container, parentInstance, anchor)
        } else if (shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
          processComponent(n1, n2, container, parentInstance, anchor)
        }
        break
    }
  }

  function processTextNode(vnode, container) {
    // TextNode 本身就是纯 text
    const element = (vnode.el = document.createTextNode(vnode.children))
    container.appendChild(element)
  }

  function processFragment(n2, container, parentInstance, anchor) {
    // 因为 fragment 就是用来处理 children 的
    mountChildren(n2.children, container, parentInstance, anchor)
  }

  function processElement(n1, n2, container, parentInstance, anchor) {
    // n1 存在，update 逻辑
    if (n1) {
      patchElement(n1, n2, parentInstance, anchor)
    } else {
      // 不存在 init 逻辑
      mountElement(n2, container, parentInstance, anchor)
    }
  }

  function patchElement(n1, n2, parentInstance, anchor) {
    const oldProps = n1.props || EMPTY_OBJ
    const newProps = n2.props || EMPTY_OBJ
    const el = (n2.el = n1.el)
    patchProps(el, oldProps, newProps)
    patchChildren(n1, n2, el, parentInstance, anchor)
  }

  function patchChildren(n1, n2, container, parentInstance, anchor) {
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
        mountChildren(c2, container, parentInstance, anchor)
      } else {
        // array -> array
        patchKeyedChildren(c1, c2, container, parentInstance, anchor)
      }
    }
  }

  function patchKeyedChildren(c1, c2, container, parentInstance, anchor) {
    let l2 = c2.length
    // 声明三个指针，e1 是老节点最后一个元素，e2 是新节点最后一个元素，i 是当前对比的元素
    let e1 = c1.length - 1
    let e2 = l2 - 1
    let i = 0
    // 目前我们用来两个节点是否一样暂时只用 type 和 key
    function isSameVNode(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key
    }
    // 首先我们要从新旧节点头部开始对比
    while (i <= e1 && i <= e2) {
      if (isSameVNode(c1[i], c2[i])) {
        patch(c1[i], c2[i], container, parentInstance, anchor)
      } else {
        break
      }
      i += 1
    }
    // 对比完了头部，我们还要对比尾部
    while (i <= e1 && i <= e2) {
      // 尾部这里就是对比尾部的了
      if (isSameVNode(c1[e1], c2[e2])) {
        patch(c1[e1], c2[e2], container, parentInstance, anchor)
      } else {
        break
      }
      e1 -= 1
      e2 -= 1
    }
    if (i > e1) {
      if (i <= e2) {
        // nextPos 就是需要追加元素的索引
        // 如果这个新元素的索引已经超过了新节点的长度，那么说明是追加到尾部
        // anchor = null，如果没有超过新节点的长度，那么就是插入到某个位置
        // 此时 anchor = c2[nextPos].el，也就是这个新加元素的下一个元素
        const nextPos = e2 + 1
        const anchor = nextPos < l2 ? c2[nextPos].el : null
        while (i <= e2) {
          patch(null, c2[i], container, parentInstance, anchor)
          i += 1
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        hostRemove(c1[i].el)
        i += 1
      }
    } else {
      // 对比中间部分
      let s1 = i
      let s2 = i
      // 添加变量 toBePatched，用于记录所有需要 patch 的节点，也就是目前新节点的混乱部分的个数
      const toBePatched = e2 - s2 + 1
      // patched 是当前的 patch 过的个数
      let patched = 0
      // c2 混乱部分映射
      const keyToNewIndexMap = new Map()
      // 储存旧节点混乱元素的索引，创建定长数组，性能更好
      const newIndexToOldIndexMap = new Array(toBePatched)
      // 应该移动
      let shouldMove = false
      // 目前最大的索引
      let maxNewIndexSoFar = 0
      // 循环初始化每一项索引，0 表示未建立映射关系
      for (let i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0
      // 添加映射
      for (let i = s2; i <= e2; i++) {
        const nextChild = c2[i]
        keyToNewIndexMap.set(nextChild.key, i)
      }
      // 循环老的，根据映射找
      for (let i = s1; i <= e1; i++) {
        const prevChild = c1[i]
        if (patched >= toBePatched) {
          // 如果当前 patched 的个数已经超过了应该 patched 的个数
          // 那么直接删除
          hostRemove(prevChild.el)
          continue
        }
        let newIndex
        // 如果当前老的子节点的 key 不是空的
        if (prevChild.key !== null) {
          // 就去映射表中找到新的对应的 newIndex
          newIndex = keyToNewIndexMap.get(prevChild.key)
        } else {
          // 如果老的子节点的 key 是空的，还需要再次遍历新节点，找到与当前老节点相同的 VNode，并将其索引赋给 j
          for (let j = s2; j <= e2; j++) {
            if (isSameVNode(prevChild, c2[j])) {
              newIndex = j
              break
            }
          }
        }
        if (newIndex === undefined) {
          hostRemove(prevChild.el)
        } else {
          // 判断是否需要移动
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex
          } else {
            shouldMove = true
          }
          // 确定新节点存在，储存索引映射关系
          // newIndex 获取到当前老节点在新节点中的元素，减去 s2 是要将整个混乱的部分拆开，索引归于 0
          // 为什么是 i + 1 是因为需要考虑 i 是 0 的情况，因为我们的索引映射表中 0 表示的是初始化状态
          // 所以不能是 0，因此需要用到 i + 1
          newIndexToOldIndexMap[newIndex - s2] = i + 1
          patch(prevChild, c2[newIndex], container, parentInstance, null)
          patched += 1
        }
      }
      const increasingNewIndexSequence = shouldMove
        ? getSequence(newIndexToOldIndexMap)
        : []
      // 需要两个指针 i,j
      // j 指向获取出来的最长递增子序列的索引
      // i 指向我们新节点
      let j = increasingNewIndexSequence.length - 1
      for (let i = toBePatched - 1; i >= 0; i--) {
        // 获取元素的索引
        const nextIndex = i + s2
        const nextChild = c2[nextIndex]
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : null
        if (newIndexToOldIndexMap[i] === 0) {
          // 创建
          patch(null, nextChild, container, parentInstance, anchor)
        } else if (shouldMove) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            // 移动
            hostInsert(nextChild.el, container, anchor)
          } else {
            j -= 1
          }
        }
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
        if (!(propKey in newProps)) {
          hostPatchProp(el, propKey, undefined, oldProps[propKey])
        }
      }
    }
  }

  function mountElement(n2, container, parentInstance, anchor) {
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
      mountChildren(n2.children, domEl, parentInstance, anchor)
    }
    // 最后将 domEl 加入 dom 树中
    hostInsert(domEl, container, anchor)
  }

  function mountChildren(children, container, parentInstance, anchor) {
    children.forEach(vnode => {
      patch(null, vnode, container, parentInstance, anchor)
    })
  }

  function processComponent(n1, n2, container, parentInstance, anchor) {
    if (n1) {
      // update component
      updateComponent(n1, n2)
    } else {
      // init component
      mountComponent(n2, container, parentInstance, anchor)
    }
  }

  function updateComponent(n1, n2) {
    const instance = (n2.component = n1.component)
    // instance 挂载最新的虚拟节点
    if (shouldUpdateComponent(n1, n2)) {
      instance.next = n2
      instance.update()
    } else {
      n2.el = n1.el
      instance.vnode = n2
    }
  }

  function mountComponent(vnode, container, parentInstance, anchor) {
    // 通过 vnode 获取组件实例
    const instance = (vnode.component = createComponentInstance(
      vnode,
      parentInstance
    ))
    // setup component
    setupComponent(instance)
    // setupRenderEffect
    setupRenderEffect(instance, vnode, container, anchor)
  }

  function setupRenderEffect(instance, vnode, container, anchor) {
    instance.update = effect(() => {
      if (instance.isMounted) {
        // update 逻辑
        // 如果 instance.next 存在，那么就是 component 的更新部分
        const { next, vnode } = instance
        if (next) {
          // 更新组件 el、props
          next.el = vnode.el
          updateComponentPreRender(instance, next)
        }

        const subTree = instance.render.call(instance.proxy)
        vnode.el = subTree.el
        const preSubTree = instance.subTree
        instance.subTree = subTree
        patch(preSubTree, subTree, container, instance, anchor)
      } else {
        // init 逻辑
        const subTree = (instance.subTree = instance.render.call(
          instance.proxy
        ))
        patch(null, subTree, container, instance, anchor)
        vnode.el = subTree.el
        instance.isMounted = true
      }
    })
  }

  return {
    createApp: createAppAPI(render, hostSelector),
  }
}

function updateComponentPreRender(instance, nextVNode) {
  instance.vnode = nextVNode
  instance.props = nextVNode.props
  nextVNode = null
}

/**
 * 求最长递增子序列在原数组的下标数组
 * @param arr {number[]}
 * @return {number[]}
 */
function getSequence(arr: number[]): number[] {
  // 浅拷贝 arr
  const _arr = arr.slice()
  const len = _arr.length
  // 存储最长递增子序列对应 arr 中下标
  const result = [0]

  for (let i = 0; i < len; i++) {
    const val = _arr[i]

    // 排除等于 0 的情况
    if (val !== 0) {
      /* 1. 贪心算法 */

      // 获取 result 当前最大值的下标
      const j = result[result.length - 1]
      // 如果当前 val 大于当前递增子序列的最大值的时候，直接添加
      if (arr[j] < val) {
        _arr[i] = j // 保存上一次递增子序列最后一个值的索引
        result.push(i)
        continue
      }

      /* 2. 二分法 */

      // 定义二分法查找区间 [left, right]
      let left = 0
      let right = result.length - 1
      while (left < right) {
        // 求中间值（向下取整）
        const mid = (left + right) >> 1
        if (arr[result[mid]] < val) left = mid + 1
        else right = mid
      }

      // 当前递增子序列按顺序找到第一个大于 val 的值，将其替换
      if (val < arr[result[left]]) {
        if (left > 0) {
          // 保存上一次递增子序列最后一个值的索引
          _arr[i] = result[left - 1]
        }

        // 此时有可能导致结果不正确，即 result [left + 1] < result [left]
        // 所以我们需要通过 _arr 来记录正常的结果
        result[left] = i
      }
    }
  }

  // 修正贪心算法可能造成最长递增子序列在原数组里不是正确的顺序
  let len2 = result.length
  let idx = result[len2 - 1]
  // 倒序回溯，通过之前 _arr 记录的上一次递增子序列最后一个值的索引
  // 进而找到最终正确的索引
  while (len2-- > 0) {
    result[len2] = idx
    idx = _arr[idx]
  }

  return result
}
