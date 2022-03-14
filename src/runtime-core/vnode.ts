export function createVNode(type, props?, children?) {
  // 这里先直接返回一个 VNode 结构
  return {
    type,
    props,
    children,
  }
}
