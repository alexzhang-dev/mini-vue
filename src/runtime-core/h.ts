import { createVNode } from './vnode'
import type { VNode, VNodeType, VNodeProps } from './vnode'

export function h<T extends VNodeProps = {}>(type: VNodeType, props: T, children?: VNode[] | string | undefined) {
  return createVNode(type, props, children)
}
