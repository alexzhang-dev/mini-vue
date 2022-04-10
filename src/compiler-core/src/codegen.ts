import { NodeType } from './ast'
import {
  CREATE_ELEMENT_VNODE,
  HelperNameMapping,
  TO_DISPLAY_STRING,
} from './runtimeHelpers'

export function codegen(ast) {
  const context = createCodegenContext()
  const { push } = context

  if (ast.helpers.length) {
    genFunctionPreamble(ast, context)
  }

  const funcName = 'render'
  push(`export `)
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${funcName}(${signature}) { `)
  push(`return `)
  genNode(ast.codegenNode, context)
  push(` }`)
  return context.code
}

function genFunctionPreamble(ast, context) {
  const VueBinding = 'Vue'
  const { push, newLine } = context
  const aliasHelper = s => `${HelperNameMapping[s]}: _${HelperNameMapping[s]}`
  push(`const { ${ast.helpers.map(aliasHelper).join(', ')} } = ${VueBinding}`)
  newLine()
}

function genNode(node, context) {
  switch (node.type) {
    case NodeType.TEXT:
      genText(node, context)
      break
    case NodeType.INTERPOLATION:
      genInterpolation(node, context)
      break
    case NodeType.SIMPLE_EXPRESSION:
      genExpression(node, context)
      break
    case NodeType.ELEMENT:
      genElement(node, context)
      break
  }
}

function genElement(node, context) {
  const { push, helper } = context
  const { tag } = node
  push(`${helper(CREATE_ELEMENT_VNODE)}('${tag}')`)
}

function genExpression(node, context) {
  const { push } = context
  push(`${node.content}`)
}

function genInterpolation(node, context) {
  const { push } = context
  push(`${context.helper(TO_DISPLAY_STRING)}(`)
  genNode(node.content, context)
  push(`)`)
}

function genText(node, context) {
  const { push } = context
  push(`'${node.content}'`)
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source
    },
    newLine() {
      context.code += '\n'
    },
    helper(name) {
      return `_${HelperNameMapping[name]}`
    },
  }
  return context
}
