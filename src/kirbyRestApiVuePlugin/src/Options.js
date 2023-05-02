const Options = class {
  host = null
  lang = null
  fields = []
  limit = null
  page = null
  order = null
  parse = {
    raw: false,
    routerLinks: false,
    nl2br: false,
    includeLabel: false,
    imageObjects: false,
  }
  constructor(defaultOptions) {
    this.init(defaultOptions)
  }
  init(_options) {
    const options = typeof _options === 'object' ? _options : {}
    this.setHost(options.host)
    this.setLang(options.lang)
    this.setFields(options.fields)
    this.setLimit(options.limit)
    this.setPage(options.page)
    this.setOrder(options.order)
    this.setParse(options.parse)
  }
  setHost(val) {
    if (typeof val === 'string' && val.length > 0 && val.startsWith('http')) {
      let host = val.toLowerCase().trim()
      if (host.endsWith('/')) {
        host = host.substring(0, host.length - 1)
      }
      this.host = host
    }
  }
  setLang(val) {
    if (typeof val === 'string' && val.length > 0) {
      this.lang = val.toLowerCase().trim()
    }
  }
  setFields(val) {
    if (typeof val === 'string' && val.toLowerCase().trim() === 'all') {
      this.setAll()
    }
    if (Array.isArray(val)) {
      const fields = val.filter((field) => typeof field === 'string' && field.length > 0)
      this.fields = fields.map((field) => field.toLowerCase())
    }
  }
  setAll() {
    this.fields = 'all'
  }
  setLimit(val) {
    if (typeof val === 'number' && Math.floor(val) === val && val > 0) {
      this.limit = val
    }
  }
  setPage(val) {
    if (typeof val === 'number' && Math.floor(val) === val && val > 0) {
      this.page = val
    }
  }
  setOrder(val) {
    if (typeof val === 'string') {
      const order = val.toLowerCase().trim()
      if (order === 'asc' || order === 'desc') {
        this.order = order
      }
    }
  }
  setParse(val) {
    const settings = Object.keys(this.parse)
    if (Array.isArray(val)) {
      settings.forEach((setting) => {
       const kebab = setting.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? "-" : "") + $.toLowerCase())
        if (val.indexOf(kebab, val) > -1) {
          this.parse[setting] = true
        }
      })
    } else if (typeof val === 'object') {
      settings.forEach((setting) => {
        this.parse[setting] = val[setting] || false
      })
    }
  }
}

export default Options
