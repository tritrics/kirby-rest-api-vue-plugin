import Image from './src/Image'
import Options from './src/Options'
import Request from './src/Request'

const KirbyApiVuePlugin = class {
  /**
   * option class holding default options for each request
   * each option can be overwritten in specific request
   */
  options

  /**
   * default options
   */
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

    /**
     * methods available by vue.$api | this.$api
     */
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
