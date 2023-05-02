import Options from './Options'
import Parser from './Parser'

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
    return await this.#call(url)
  }
  async node(node) {
    const url = this.#url(this.options.host, 'node', this.options.lang, node)
    return await this.#call(url, {
      fields: this.options.fields,
    })
  }
  async children(node) {
    const url = this.#url(this.options.host, 'children', this.options.lang, node)
    return await this.#call(url, {
      page: this.options.page,
      limit: this.options.limit,
      order: this.options.order,
      fields: this.options.fields,
    })
  }
  #url(...args) {
    let url = args.shift()
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
        throw new Error(response.statusText, { cause: response.status })
      }
      const json = await response.json()
      if (!json.ok) {
        throw new Error('API\'s response reports an error', { cause: json.status })
      }
      if (!this.options.parse.raw && Object.prototype.hasOwnProperty.call(json, 'content')) {
        json.content = new Parser(this.options.parse).parse(json.content)
      }
      return this.#return(json)
    } catch (E) {
      return this.#return({
        ok: 0,
        status: E.cause ?? 500,
        url,
        msg: E.message ?? 'Unknown fatal error',
      })
    }
  }
  #return(obj) {
    obj.log = () => console.log(JSON.stringify(obj, null, 2))
    return obj
  }
}

export default Request
