import { createVNode, } from './vnode'
import type { VNode } from './vnode'
import { ContainerType, RendererType } from './render'

export function createAppAPI(renderer: RendererType, selector: (s: string) => ContainerType) {
  return function createApp(rootComponent: VNode) {
    return {
      mount(rootContainer: string | ContainerType) {
        // 在 vue3 中，会将 rootComponent 转为一个虚拟节点 VNode
        // 后续所有的操作都会基于虚拟节点
        // 这里就调用了一个 createVNode 的 API 将 rootComponent 转换为一个虚拟节点
        // 【注意了】这个虚拟节点就是程序的入口，所有子节点递归处理
        const vnode = createVNode(rootComponent)
        // 调用 render 来渲染虚拟节点，第二个参数是容器【container】
        renderer(vnode, selector ? selector(rootContainer as string) : rootContainer as ContainerType)
      },
    }
  }
}
