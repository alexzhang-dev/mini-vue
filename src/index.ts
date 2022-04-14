export * from './runtime-dom'
import { baseCompile } from './compiler-core/src'
import * as runtimeDom from './runtime-dom'
import { registerCompiler } from './runtime-dom'

function compileToFunction(template: string) {
  const { code } = baseCompile(template)
  const render = new Function('Vue', code)(runtimeDom)
  return render
}

registerCompiler(compileToFunction)
