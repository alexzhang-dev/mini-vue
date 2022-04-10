export function codegen(ast) {
  const context = createCodegenContext()
  const { push } = context
  const funcName = 'render'
  push(`export `)
  const args = ['_ctx', '_cache']
  const signature = args.join(', ')
  push(`function ${funcName}(${signature}) { `)
  push(`return '${genNode(ast)}'`)
  push(` }`)
  return context.code
}

function genNode(ast) {
  const { codegenNode } = ast
  return `${codegenNode.content}`
}

function createCodegenContext() {
  const context = {
    code: '',
    push(source: string) {
      context.code += source
    },
  }
  return context
}
