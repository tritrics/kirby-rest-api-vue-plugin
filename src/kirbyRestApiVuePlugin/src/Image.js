const Image = class {
  orig = {}
  link = {}
  value = {}
  src = null
  width = null
  height = null
  crop = false
  blur = 0
  bw = false
  quality = null
  hires = false
  constructor(image, width, height, crop, blur, bw, quality) {
    this.#setOrig(image)
    this.resize(width, height, crop, blur, bw, quality)
  }
  resize(width, height, crop, blur, bw, quality) {
    this.#setCrop(crop)
    this.#setBlur(blur)
    this.#setBw(bw)
    this.#setQuality(quality)
    this.#setHires()
    this.#setDimensions(
      Math.floor(width) === width ? width : null,
      Math.floor(height) === height ? height : null,
    )
    this.#setSrc()
  }
  preload() {
    return new Promise((resolve, reject) => {
      if (typeof this.src === 'string') {
        const Preload = new Image()
        Preload.onload = resolve
        Preload.onerror = reject
        Preload.src = this.src
      } else {
        reject(new Error('image src is not set'))
      }
    })
  }
  toJSON() {
    return {
      InstanceOfImage: {
        orig: this.orig,
        link: this.link,
        value: this.value,
      }
    }
  }
  #setOrig(image) {
    if(typeof image === 'object' && image.isimage) {
      this.orig = { ...image }
      this.link = { ...image.link } || {}
      delete(this.orig.link)
      this.value = { ...image.value } || {}
      delete(this.orig.value)
    }
  }
  #setCrop(crop) {
    const cropvalues = ['top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right']
    if (crop === false) {
      this.crop = false
    } else if (crop === true) {
      this.crop = 'center'
    } else if (cropvalues.indexOf(crop) > -1) {
      this.crop = crop
    }
  }
  #setBlur(blur) {
    if (Math.floor(blur) === blur && blur >= 0) {
      this.blur = blur
    }
  }
  #setBw(bw) {
    if (bw === true || bw === false) {
      this.bw = bw
    }
  }
  #setQuality(quality) {
    if (Math.floor(quality) === quality && quality >= 1 && quality <= 100) {
      this.quality = quality
    }
  }
  #setHires() {
    this.hires = window.devicePixelRatio > 1
  }
  #setDimensions(width, height) {
    if (typeof this.orig !== 'object') {
      return
    }
    const ratio = Math.round(this.orig.width / this.orig.height, 4)
    const res = { width, height }
    // keep ratio, limit height to maxHeight
    if (width === null) {
      res.width = Math.round(height * ratio, 0)
      res.height = height
    // keep ratio, limit width to width
    } else if (height === null) {
      res.width = width
      res.height = Math.round(width / ratio, 0)
    // crop to fit in width and height
    } else if (typeof this.crop === 'string') {
      res.width = width
      res.height = height
    // keep ratio, fit either width or height
    } else {
      res.width = Math.round(height * ratio, 0)
      if (res.width <= width) {
        res.height = height
      } else {
        res.width = width
        res.height = Math.round(width / ratio, 0)
      }
    }
    // double resolution for hiRes displays
    if (this.hiRes) {
      res.width *= 2
      res.height *= 2
    }
    // correct the dimensions to not be bigger than original
    if ((res.width / this.orig.width) > 1 || (res.height / this.orig.height) > 1) {
      // take this.orig.width and calculate height
      if ((res.width / this.orig.width) >= (res.height / this.orig.height)) {
        if (height === null) {
          res.height = this.orig.height
        } else {
          res.height = Math.floor((this.orig.width * res.height) / res.width)
        }
        res.width = this.orig.width
      // take this.orig.height and calculate width
      } else {
        if (width === null) {
          res.width = this.orig.width
        } else {
          res.width = Math.floor((this.orig.height * res.width) / res.height)
        }
        res.height = this.orig.height
      }
    }
    this.width = res.width
    this.height = res.height
  }
  #setSrc() {
    if (typeof this.orig !== 'object') {
      return
    }
    const ext = this.orig.ext.toLowerCase().replace(/jpeg/, 'jpg')
    const src = []
    src.push(this.orig.dir + this.orig.file)
    src.push(`${this.width}x${this.height}`)
    if (typeof this.crop === 'string') {
      src.push(`crop-${this.crop}`)
    }
    if (this.blur !== null && this.blur > 0) {
      src.push(`blur${this.blur}`)
    }
    if (this.bw === true) {
      src.push('bw')
    }
    if (this.quality !== null && this.quality > 0) {
      src.push(`q${this.quality}`)
    }
    this.src = `${src.join('-')}.${ext}`
  }
}

export default Image
