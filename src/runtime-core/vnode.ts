import { isObject } from '../shared'
import { ShapeFlags } from '../shared/ShapeFlags'
import { Component } from './component'
import { RawSlotsType } from './types/slots'

export const Fragment = Symbol('Fragment')
export const TextNode = Symbol('TextNode')

export type VNodeType = string | typeof Fragment | typeof TextNode | VNode

export type VNodeProps = {
  key?: number | string | null
  [key: string]: string | number | boolean | symbol | null | undefined | ((...args: unknown[]) => void)
}

export type VNode = {
  readonly type: VNodeType
  props: VNodeProps
  children: VNode[] | string | RawSlotsType
  el: null | HTMLElement | Text
  component: Component | null
  key: VNodeProps["key"]
  shapeFlags: ShapeFlags
  setup?: (...args: unknown[]) => Record<string, unknown> | null
  template?: "",
  render?: (...args: unknown[]) => VNode
}

export function createVNode<T extends VNodeProps>(type: VNodeType, props?: T, children?: VNode[] | string | undefined) {
  // 这里先直接返回一个 VNode 结构
  const vnode: VNode = {
    type,
    props: props || {},
    children: children || "",
    el: null,
    component: null,
    key: props ? props.key! : null,
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
  if (vnode.shapeFlags & ShapeFlags.STATEFUL_COMPONENT) {
    if (isObject(vnode.children)) {
      vnode.shapeFlags |= ShapeFlags.SLOT_CHILDREN
    }
  }
  return vnode
}

export function createTextVNode(text: string) {
  return createVNode(TextNode, {}, text)
}

function getShapeFlags(type) {
  return typeof type === 'string'
    ? ShapeFlags.ELEMENT
    : ShapeFlags.STATEFUL_COMPONENT
}
