import { ShapeFlags } from '../shared/ShapeFlags'

export const Fragment = Symbol('Fragment')

export function createVNode(type, props?, children?) {
  // 这里先直接返回一个 VNode 结构
  const vnode = {
    type,
    props,
    children,
    el: null,
    shapeFlags: getShapeFlags(type),
  }
  // 还要对于 children 进行处理
  if (typeof children === 'string') {
    // 或运算符，vnode.shapeFlags | ShapeFlags.TEXT_CHILDREN
    // 这里其实非常巧妙，例如我们现在时 0001，0001 | 0100 = 0101
    vnode.shapeFlags |= ShapeFlags.TEXT_CHILDREN
  } else if (Array.isArray(children)) {
    // 这里也是同理
    vnode.shapeFlags |= ShapeFlags.ARRAY_CHILDREN
  }
  return vnode
}

function getShapeFlags(type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
