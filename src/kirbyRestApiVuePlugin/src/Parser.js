import Image from './Image'

const Parser = class {
  options
  constructor(options) {
    this.options = options
  }
  parse(obj) {
    if (!obj) return ''
    const res = Array.isArray(obj) ? [] : {}
    this.#each(obj, (node, key) => {
      if (key === 'link') {
        res[key] = node
        return
      }
      if (Array.isArray(node)) {
        res[key] = this.parse(node)
        return
      }
      if (node && typeof node === 'object') {
        if (Object.prototype.hasOwnProperty.call(node, 'type')) {
          switch (node.type) {
            case 'blocks':
              res[key] = []
              this.#each(node.value, (block) => {
                res[key].push(this.parse(block))
              })
              break
            case 'datetime':
              res[key] = this.#parseDate(node)
              break
            case 'email':
            case 'tel':
            case 'url':
              delete node.type
              res[key] = node
              break
            case 'file':
              res[key] = this.#parseFile(node)
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
              res[key] = this.#parseHtml(node.value)
              break
            case 'page':
              res[key] = this.#parsePage(node)
              break
            case 'multiselect':
            case 'select':
              res[key] = this.#parseSelect(node)
              break
            case 'number':
              res[key] = this.#parseNumber(node)
              break
            case 'text-multiline':
              res[key] = this.#parseTextMultiline(node.value)
              break
            case 'toggle':
              res[key] = !node.value
              break
            case 'user':
              res[key] = this.#parseUser(node)
              break
            default:
              if (Object.prototype.hasOwnProperty.call(node, 'value')) {
                res[key] = node.value
              } else {
                res[key] = node
              }
          }
        } else {
          res[key] = this.parse(node)
        }
        return
      }
      res[key] = node
    })
    return res
  }
  #parsePage(node) {
    delete node.type
    return node
  }
  #parseFile(node) {
    delete node.type
    node.value = this.parse(node.value)
    if (node.isimage && this.options.imageObjects) {
      return new Image(node)
    }
    return node
  }
  #parseUser(node) {
    delete node.type
    node.value = this.parse(node.value)
    return node
  }
  #parseDate(node) {
    let date = new Date(node.datetime)
    date.toJSON = () => { return {
      InstanceOfDate: node
    }}
    return date
  }
  #parseNumber(node) {
    return parseFloat(node.value)
  }
  #parseHtml(node) {
    delete node.type
    let parsed = `${node}`

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
