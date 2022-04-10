export function transform(root, options) {
  const context = createTransformContext(root, options)
  traverseNode(root, context)
}

function createTransformContext(root, options) {
  return {
    root,
    nodeTransforms: options.nodeTransforms || {},
  }
}

function traverseNode(node, context) {
  const { nodeTransforms } = context
  for (let i = 0; i < nodeTransforms.length; i++) {
    const transform = nodeTransforms[i]
    transform(node)
  }
  traverseChildren(node, context)
}

function traverseChildren(node, context) {
  const children = node.children
  if (children) {
    for (let i = 0; i < children.length; i++) {
      traverseNode(children[i], context)
    }
  }
}
