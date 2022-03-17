export const componentPublicInstanceProxyHandlers = {
  get(target, key) {
    if (key === '$el') {
      const { _: vnode } = target
      return vnode.el
    }
    return target.setupState[key]
  },
}
