import Image from './src/Image'
import Request from './src/Request'

let defaultOptions = {
  host: null,
  lang: null,
  fields: [],
  limit: 10,
  page: 1,
  order: 'asc',
  parse: []
}

export function createRequest() {
  return new Request(defaultOptions)
}

export function createImage(...args) {
  return new Image(...args)
}

export function setOptions(options) {
    defaultOptions = {
      ...defaultOptions,
      ...options || {},
    }
}

export function createApi (options) {
  if (typeof options === 'object') {
    setOptions(options)
  }
  return {
    install(app, options) {
      if (typeof options === 'object') {
        setOptions(options)
      }
      app.config.globalProperties.$api = {
        request: createRequest,
        image: createImage,
      }
    }
  }
}

export default () => createApi()