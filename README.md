# Kirby rest api vue plugin

A vue plugin, that is build to communicate easily with tritrics/kirby-rest-api (not published yet). The plugin reflects the public rest-api methods and (optionally) converts the requested data.

## Installation

```npm install kirby-rest-api-rest-plugin```

## Importing to project

```
import apiPlugin from 'kirby-rest-api-rest-plugin'

createApp(App).use(apiPlugin, {
  host: 'http://domain.com/rest-api',
  [lang: 'en',]
}).mount('#app')

```

## Requesting data

```
async myFunction() {

  # Create a new request
  const request = this.$api.request()

  # overwrite host and language from Plugin configuration (only for this request)
  request.host('http://otherdomain.com/rest-api')
  request.lang('dk')

  # request fields
  request.fields('myfield', 'myotherfield')

  # request all fields
  request.fields('all')
  request.all() // shortcut

  # configure children()-request
  request.limit(5) // integer count of children
  request.page(2) // integer pagination
  request.order('desc') // asc|desc sorting

  # don't parse result
  request.parse('raw')

  # configure parser
  request.parse(
    'router-links', // convert <a>-tags in html fields to router-links
    'nl2br', // replace newline to <br> in textfields
    'include-label' // include labels from select fields
  )

  # request
  const json = await request.languages()
  const json = await request.node('/path/of/slugs') // leave empty for site data
  const json = request.children('/path/of/slugs') // leave empty for site children
  
  # log result (only in develop mode)
  json.log()
}
```

### Short notation

```
async myFunction() {
	const json = await this.$api.request().all().node('/path/of/slugs')
	json.log()
}
```

## Images

Resized images can be easily requested from Kirby:

```
const image = this.$api.image(
	json.content.myImageField[0], // simply pass node from result
	[width] // null|integer requested width in px
	[height] // null|integer requested height in px
	[crop] // null|true or option below, true is shortcut for 'center'
	[blur] // null|integer blur factor > 0
	[bw] // bool black/white
	[quality] // null|integer jpg quality <= 100
)

# Image data can than be taken from the object. Kirby automatically resizes
# and caches the new image.
const src = image.src
const width = image.width
const height = image.height
```

crop options : 'top-left', 'top', 'top-right', 'left', 'center', 'right', 'bottom-left', 'bottom', 'bottom-right'

## License

MIT

## Supporting

Free to use, but I will be happy if you [buy me a coffee](https://www.buymeacoffee.com/tritrics).

