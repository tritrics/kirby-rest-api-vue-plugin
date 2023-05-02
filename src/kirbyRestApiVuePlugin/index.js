import Image from './src/Image'
import Options from './src/Options'
import Request from './src/Request'

const KirbyApiVuePlugin = class {
  options
  default = {
    host: null,
    lang: null,
    fields: [],
    limit: 10,
    page: 1,
    order: 'asc',
    parse: {}
  }
  constructor() {
    this.options = new Options()
  }

  install(app, options) {
    this.init(options)
    app.config.globalProperties.$api = {
      init: (val) => this.init(val),
      request: () => new Request(this.options),
      image: (...args) => new Image(...args),
    }
  }
  init(obj) {
    if (typeof obj === 'object') {
      const merged = {
        ...this.default,
        ...obj,
      }
      this.options.init(merged)
    } else {
      this.options.init(this.default)
    }
  }
}

export default new KirbyApiVuePlugin()
