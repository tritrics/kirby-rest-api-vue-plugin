import Options from './Options'
import Parser from './Parser'

const Request = class {
  /**
   * Api parent class
   */
  api

  /**
   * options which overwrite the default options from RestApi
   */
  options

  /**
   * Parser-options, set by config()
   */
  parser = {

    // return raw or parsed json
    parseResult: true,

    // parse intern links to router links in hmtl-fields
    routerLinks: false,

    // replace newlines \n with <br> in text-multiline (not in markdown)
    nl2br: false,

    // include label(s) of select and multiselect-fields
    includeLabel: false,
  }

  constructor(api) {
    this.api = api
    this.options = new Options()
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

  // coming functionality
  // filter() {}

  /**
   * @param  {...any} val raw|router-links|nl2br|include-label
   */
  parse(...val) {
    this.options.parseResult = !(val.indexOf('raw', val) > -1)
    this.options.routerLinks = val.indexOf('router-links', val) > -1
    this.options.nl2br = val.indexOf('nl2br', val) > -1
    this.options.includeLabel = val.indexOf('include-label', val) > -1
    return this
  }

  languages() {
    const url = this.#url(this.#prop('host'), 'languages')
    return this.#call(url)
  }

  node(node) {
    const url = this.#url(this.#prop('host'), 'node', this.#prop('lang'), node)
    return this.#call(url, {
      fields: this.#prop('fields'),
    })
  }

  children(node) {
    const url = this.#url(this.#prop('host'), 'children', this.#prop('lang'), node)
    return this.#call(url, {
      page: this.#prop('page'),
      limit: this.#prop('limit'),
      order: this.#prop('order'),
      fields: this.#prop('fields'),
    })
  }

  #prop(name) {
    return this.options[name] || this.api.options[name]
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

  /**
   * Async api calling, using
   * https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch
   * @param {string} url
   */
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
      if (this.options.parseResult && Object.prototype.hasOwnProperty.call(json, 'content')) {
        json.content = new Parser(this.api, this.options).parse(json.content)
      }
      return json
    } catch (E) {
      return {
        ok: 0,
        status: E.cause ?? 500,
        url,
        msg: E.message ?? 'Unknown fatal error',
      }
    }
  }
}

export default Request
