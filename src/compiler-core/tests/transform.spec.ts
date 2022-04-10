import { NodeType } from '../src/ast'
import { baseParse } from '../src/parse'
import { transform } from '../src/transform'

describe('transform', () => {
  test('should change text content', () => {
    const ast = baseParse('<div>hi</div>')
    const transformText = node => {
      if (node.type === NodeType.TEXT) {
        node.content += ' mini-vue'
      }
    }
    transform(ast, {
      nodeTransforms: [transformText],
    })
    expect(ast.children[0].children[0].content).toEqual('hi mini-vue')
  })
})
