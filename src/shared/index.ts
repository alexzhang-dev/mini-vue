export const extend = Object.assign

export function isObject(val: unknown): val is Object {
  return val !== null && typeof val === 'object'
}

export function isString(val: unknown): val is String {
  return typeof val === 'string'
}

export function isArray(val: unknown): val is Array<unknown> {
  return Array.isArray(val)
}

export const isFunction = (val: unknown): val is Function => typeof val === 'function'

export function hasChanged(val, newVal) {
  return !Object.is(val, newVal)
}

export function hasOwn(target = {}, key) {
  return Reflect.has(target, key)
}

export const EMPTY_OBJ = {}

export { toDisplayString } from './toDisplayString'
