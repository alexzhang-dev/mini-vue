import { getCurrentInstance } from './component'

export function provide(key, value) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    let provides = currentInstance.provides
    if (currentInstance.parent) {
      const parentProvides = currentInstance.parent.provides
      if (provides === parentProvides) {
        provides = currentInstance.provides = Object.create(parentProvides)
      }
    }
    provides[key] = value
  }
}
export function inject(key) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    const { parent } = currentInstance
    return parent.provides[key]
  }
}
