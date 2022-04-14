import { getCurrentInstance } from './component'

export function provide(key: string, value: string | number | boolean) {
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
export function inject(key: string, defaultValue?: unknown) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    const { parent } = currentInstance
    if (key in parent.provides) {
      return parent.provides[key]
    } else if (defaultValue) {
      if (typeof defaultValue === 'function') return defaultValue()
      return defaultValue
    }
  }
}
