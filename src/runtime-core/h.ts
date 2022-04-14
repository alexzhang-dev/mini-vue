import { createVNode, } from './vnode'
import type { Props, VNode, VNodeType } from './vnode'

export function h<T extends Props = {}>(type: VNodeType, props: T, children?: VNode[] | string | undefined) {
  return createVNode(type, props, children)
}
