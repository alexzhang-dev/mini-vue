import { Component } from "./component"
import { VNode } from "./vnode"

export type EmitFn1 = (preInject) => void
export type EmitFn2 = (event: string, ...args: any[]) => void
export type EmitFn = EmitFn1 | EmitFn2

export function emit(instance: VNode, event: string, ...params: unknown[]) {
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
