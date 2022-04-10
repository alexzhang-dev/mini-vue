export const extend = Object.assign

export function isObject(val) {
  return val !== null && typeof val === 'object'
}

export function isString(val) {
  return typeof val === 'string'
}

export function isArray(val) {
  return Array.isArray(val)
}

export function hasChanged(val, newVal) {
  return !Object.is(val, newVal)
}

export function hasOwn(target = {}, key) {
  return Reflect.has(target, key)
}

export const EMPTY_OBJ = {}
