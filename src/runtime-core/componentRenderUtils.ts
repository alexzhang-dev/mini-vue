
import { Component } from "./component"

export function renderComponentRoot(instance: Component) {
  const { render, proxy } = instance
  const result = render!.call(proxy, proxy)
  return result
}
