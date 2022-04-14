import { VNode } from "../vnode"

export type RawSlotsType = {
    [key: string]: (props: unknown) => VNode[] | VNode
}

export type Slot = (...args: unknown[]) => VNode[]

export type InternalSlots = Record<string, Slot | undefined>