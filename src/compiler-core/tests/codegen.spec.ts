import { codegen } from '../src/codegen'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'

describe('codegen', () => {
  test('text', () => {
    const template = 'hi'
    const ast = baseParse(template)
    transform(ast)
    const code = codegen(ast)
    expect(code).toMatchSnapshot()
  })
})
