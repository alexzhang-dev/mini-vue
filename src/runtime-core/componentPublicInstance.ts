import { hasOwn } from '../shared/index'
import { Component } from './component'

const PublicProxyGetterMapping: Record<string, (i: Component) => unknown> = {
  $el: i => i.vnode.el,
  $slots: i => i.slots,
  $props: i => i.props,
}

export const componentPublicInstanceProxyHandlers = {
  get({ _: instance }: { _: Component }, key: string) {
    const { setupState, props } = instance
    if (hasOwn(setupState, key)) {
      return Reflect.get(setupState, key)
    } else if (hasOwn(props, key)) {
      return Reflect.get(props, key)
    }
    const publicGetter = PublicProxyGetterMapping[key]
    if (publicGetter) {
      return publicGetter(instance)
    }
  },
}
