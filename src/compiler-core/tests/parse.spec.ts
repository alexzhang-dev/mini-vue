import { NodeType } from '../src/ast'
import { baseParse } from '../src/parse'

describe('Parse', () => {
  describe('interpolation', () => {
    test('simple interpolation', () => {
      const interpolationStr = '{{ message }}'
      const ast = baseParse(interpolationStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.INTERPOLATION,
        content: {
          type: NodeType.SIMPLE_EXPRESSION,
          content: 'message',
        },
      })
    })
  })
  describe('element', () => {
    test('simple element', () => {
      const interpolationStr = '<div></div>'
      const ast = baseParse(interpolationStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.ELEMENT,
        tag: 'div',
      })
    })
  })
  describe('text', () => {
    test('simple text', () => {
      const interpolationStr = 'simple text'
      const ast = baseParse(interpolationStr)
      expect(ast.children[0]).toStrictEqual({
        type: NodeType.TEXT,
        content: 'simple text',
      })
    })
  })
})
