import { VNode } from "./vnode"

export function emit(instance: VNode, event, ...params) {
  const { props } = instance
  const camelize = (str: string) => {
    return str.replace(/-(\w)/, (_, str: string) => {
      return str.toUpperCase()
    })
  }
  const capitalize = (str: string) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  const handler = props[`on${capitalize(camelize(event))}`] as (...args: unknown[]) => void
  handler && handler(...params)
}
