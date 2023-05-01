const Options = class {
  /**
   * url to api including path (can be set in Kirby's config.php)
   */
  host = null

  /**
   * lang-code, only needed in multilanguage sites
   */
  lang = null

  /**
   * fieldnames as array to be includes in response
   * can be 'all' to include all fields
   */
  fields = []

  /**
   * parameter for children request:
   * count of selected children
   */
  limit = null

  /**
   * parameter for children request:
   * count of page, for pagination in combinition with limit
   */
  page = null

  /**
   * parameter for children request:
   * order of selected children, can be 'asc' or 'desc'
   */
  order = null

  init(_options) {
    const options = typeof _options === 'object' ? _options : {}
    this.setHost(options.host)
    this.setLang(options.lang)
    this.setFields(options.fields)
    this.setLimit(options.limit)
    this.setPage(options.page)
    this.setOrder(options.order)
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
}

export default Options
