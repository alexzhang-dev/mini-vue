import typescript from '@rollup/plugin-typescript'

export default {
  // 入口文件
  input: './src/index.ts',
  // 出口文件，可以配多个
  // 例如 esm、cjs 规范
  output: [
    {
      format: 'cjs',
      file: './lib/mini-vue.cjs.js',
    },
    {
      format: 'esm',
      file: './lib/mini-vue.esm.js',
    },
  ],
  plugins: [typescript()],
}
