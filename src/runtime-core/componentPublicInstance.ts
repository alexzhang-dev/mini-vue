export const componentPublicInstanceProxyHandlers = {
  get(target, key) {
    console.log('key', key)
    if (key === '$el') {
      const { _: vnode } = target
      console.log(vnode)
      return vnode.el
    }
    return target.setupState[key]
  },
}
