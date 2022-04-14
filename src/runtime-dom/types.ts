
import { PropsValue } from "../runtime-core/types/element"

export type ElementType = string

export type NormalNode = HTMLElement | Text | null

export type RendererOptions<T extends NormalNode> = {
    createElement: (t: ElementType) => NormalNode,
    patchProp: (el: T, prop: string | keyof HTMLElementEventMap, val: PropsValue, newVal?: PropsValue) => void,
    insert: (el: T, parent: T, anchor: T) => void,
    selector: (container: string) => Element | null,
    remove: (c: T) => void,
    setElementText: (el: T, s: string) => void,
}