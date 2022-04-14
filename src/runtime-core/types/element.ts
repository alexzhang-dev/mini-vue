export type EventHandler = (...args: unknown[]) => void

export type PropsValue = string | EventHandler | number | null | undefined
export type Props = Record<string, PropsValue>