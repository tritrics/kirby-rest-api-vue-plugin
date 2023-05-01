const Parser = class {
  /**
   * Api parent class
   */
  api

  /**
   * Parsing options
   */
  options

  /**
   * Default parsing options
   */
  default = {
    routerLinks: false,
    nl2br: false,
    includeLabel: false,
  }

  constructor(api, options) {
    this.api = api
    this.options = {
      ...this.default,
      ...options,
    }
  }

  parse(obj) {
    const res = Array.isArray(obj) ? [] : {}
    this.#each(obj, (node, key) => {
      if (typeof node === 'object' || Array.isArray(node)) {
        if (node['type'] !== undefined) {
          switch (node.type) {
            case 'blocks':
              res[key] = []
              this.#each(node.value, (block) => {
                res[key].push(this.parse(block))
              })
              break
            case 'datetime':
              res[key] = new Date(node.datetime)
              break
            case 'email':
            case 'tel':
            case 'url':
              delete node.type
              res[key] = node
              break
            case 'file':
            case 'user':
              res[key] = node
              delete node.type
              res[key].value = this.parse(node.value)
              break
            case 'files':
            case 'object':
            case 'pages':
            case 'users':
            case 'structure':
              res[key] = this.parse(node.value)
              break
            case 'html':
            case 'html-inline':
              delete node.type
              res[key] = this.#parseHtml(node.value)
              break
            case 'page':
              res[key] = node
              delete node.type
              break
            case 'multiselect':
            case 'select':
              res[key] = this.#parseSelect(node)
              break
            case 'number':
              res[key] = parseFloat(node.value)
              break
            case 'text-multiline':
              res[key] = this.#parseTextMultiline(node.value)
              break
            case 'toggle':
              res[key] = !node.value
              break
            default: // text, tags, markdown
              if (node['value'] !== undefined) {
                res[key] = node.value
              } else {
                res[key] = node
              }
          }
        } else {
          res[key] = this.parse(node)
        }
      } else {
        res[key] = node
      }
    })
    return res
  }

  #parseHtml(html) {
    let parsed = `${html}`

    // strip slashes
    parsed = parsed.replace(/\\(.)/mg, '$1')

    // set router-links
    if (this.options.routerLinks) {
      const regex = /<a.+?data-link-intern.*?>(.*?)<\/a>/gi
      parsed = parsed.replace(regex, (match, text) => {
        // don't extract in first regex, because it's not possible to know,
        // if href is before or after data-link-extern
        const regex2 = /href=["|'](.*?)["|']/i
        const href = regex2.exec(match)
        const url = Array.isArray(href) ? href[1] : '/'
        return `<router-link to="${url}" data-link-intern>${text}</router-link>`
      })
    }
    return parsed
  }

  #parseTextMultiline(text) {
    let parsed = `${text}`
    if (this.options.nl2br) {
      parsed = parsed.replace(/\n/mg, '<br />')
    }
    return parsed
  }

  #parseSelect(node) {
    if (this.options.includeLabel) {
      return {
        value: node.value,
        label: node.label,
      }
    }
    return node.value
  }

  #each(obj, iteratee) {
    if (Array.isArray(obj)) {
      obj.forEach((value, key) => iteratee(value, key, obj))
    }
    if (typeof obj === 'object') {
      Object.keys(obj || {}).forEach((key) => iteratee(obj[key], key, obj))
    }
  }
}

export default Parser
