import App from './App.js'
import { createRenderer } from '../../lib/mini-vue.esm.js'

const app = new PIXI.Application({ width: 640, height: 360 })

document.body.appendChild(app.view)

const renderer = createRenderer({
  createElement(type) {
    if (type === 'rect') {
      const rect = new PIXI.Graphics()
      rect.beginFill(0xff0000)
      rect.drawRect(0, 0, 100, 100)
      rect.endFill()
      return rect
    }
  },
  patchProp(el, key, val) {
    el[key] = val
  },
  insert(el, parent) {
    parent.addChild(el)
  },
})

renderer.createApp(App).mount(app.stage)
