import Options from './Options'
import Parser from './Parser'
import ApiError from './ApiError'

const Request = class {
  options

  constructor(defaultOptions) {
    this.options = new Options(defaultOptions)
  }

  host(host) {
    this.options.setHost(host)
    return this
  }

  lang(lang) {
    this.options.setLang(lang)
    return this
  }

  fields(...val) {
    if (val.length === 1 && typeof val[0] === 'string' && val[0].toLowerCase().trim() === 'all') {
      this.options.setAll()
    } else {
      this.options.setFields(val)
    }
    return this
  }

  all() {
    this.options.setAll()
    return this
  }

  limit(val) {
    this.options.setLimit(val)
    return this
  }

  page(val) {
    this.options.setPage(val)
    return this
  }

  order(val) {
    this.options.setOrder(val)
    return this
  }

  parse(...val) {
    this.options.setParse(val)
    return this
  }

  async languages() {
    const url = this.#url(this.options.host, 'languages')
    return this.#call(url)
  }

  async node(node) {
    const url = this.#url(this.options.host, 'node', this.options.lang, node)
    return this.#call(url, {
      fields: this.options.fields,
    })
  }

  async children(node) {
    const url = this.#url(this.options.host, 'children', this.options.lang, node)
    return this.#call(url, {
      page: this.options.page,
      limit: this.options.limit,
      order: this.options.order,
      fields: this.options.fields,
    })
  }

  async call(node, data) {
    const url = this.#url(this.options.host, node)
    this.parse('raw') // always raw
    return this.#call(url, data)
  }

  #url(...args) {
    let url = args.shift()
    if (!url) {
      throw new Error('No host defined for Api request')
    }
    url = url.endsWith('/') ? url.substring(0, url.length - 1) : url
    let i
    for (i = 0; i < args.length; i += 1) {
      if (args[i]) {
        let arg = `${args[i]}`
        arg = arg.startsWith('/') ? arg.substring(1) : arg
        arg = arg.endsWith('/') ? arg.substring(0, arg.length - 1) : arg
        url += `/${encodeURI(arg)}`
      }
    }
    return url
  }

  async #call(url, data) {
    const options = {}
    if (data && typeof data === 'object') {
      options.method = 'POST'
      options.mode = 'cors'
      options.cache = 'no-cache'
      options.headers = { 'content-type': 'application/json' }
      options.body = JSON.stringify(data)
    } else {
      options.method = 'GET'
      options.mode = 'cors'
      options.cache = 'no-cache'
    }
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new ApiError(response.statusText, response.status, url)
      }
      const json = await response.json()
      if (!json.ok) {
        throw new ApiError('API reports an error', json.status, url)
      }
      if (!this.options.parse.raw && Object.prototype.hasOwnProperty.call(json, 'content')) {
        json.content = new Parser(this.options.parse).parse(json.content)
      }
      return json
    } catch (E) {
      if (E instanceof ApiError) throw E
      throw new ApiError(E.message ?? 'Unknown fatal error', E.cause ?? 500, url)
    }
  }
}

export default Request
