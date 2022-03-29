import { getCurrentInstance } from './component'

export function provide(key, value) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    currentInstance.providers[key] = value
  }
}
export function inject(key) {
  const currentInstance = getCurrentInstance()
  if (currentInstance) {
    const { parent } = currentInstance
    return parent.providers[key]
  }
}
