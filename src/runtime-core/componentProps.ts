import { Component } from "./component";
import { VNode } from "./vnode";

export function initProps(instance: Component, rawProps: VNode["props"]) {
  instance.props = rawProps || {}
}
