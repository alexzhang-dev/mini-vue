import { codegen } from '../src/codegen'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'
import { transformExpression } from '../src/transfroms/transformExpression'

describe('codegen', () => {
  test('text', () => {
    const template = 'hi'
    const ast = baseParse(template)
    transform(ast)
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
  test('interpolation', () => {
    const template = '{{message}}'
    const ast = baseParse(template)
    transform(ast, {
      nodeTransforms: [transformExpression],
    })
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
})
