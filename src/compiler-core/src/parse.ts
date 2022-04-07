import { NodeType } from './ast'

export function baseParse(content: string) {
  const context = createContext(content)
  return createRoot(parseChildren(context))
}

function createContext(content: string) {
  return {
    source: content,
  }
}

function createRoot(children) {
  return {
    children,
  }
}

function parseChildren(context: { source: string }): any {
  const nodes: any = []
  let node
  if (context.source.startsWith('{{')) {
    node = parseInterpolation(context)
  }
  nodes.push(node)
  return [node]
}

function parseInterpolation(context: { source: string }) {
  const openDelimiter = '{{'
  const closeDelimiter = '}}'
  // 将字符串截取为 message}}
  const closeIndex = context.source.indexOf(
    closeDelimiter,
    openDelimiter.length
  )
  // 让后将字符串前面的 {{ 舍弃掉，我们将其称之为【推进】
  advanceBy(context, openDelimiter.length)
  // 获取到 {{}} 中间值的长度
  const rawContentLength = closeIndex - openDelimiter.length
  // 并将中间这个值获取出来
  const rawContent = context.source.slice(0, rawContentLength)
  const content = rawContent.trim()
  // 继续【推进】
  advanceBy(context, rawContentLength + closeDelimiter.length)
  return {
    type: NodeType.INTERPOLATION,
    content: {
      type: NodeType.SIMPLE_EXPRESSION,
      content: content,
    },
  }
}

function advanceBy(context, length: number) {
  context.source = context.source.slice(length)
}
