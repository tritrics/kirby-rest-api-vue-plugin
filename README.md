# Kirby rest api vue plugin

A vue plugin, that is build to communicate easily with the [Kirby Rest Api Plugin](https://github.com/tritrics/kirby-rest-api). The plugin reflects the public api methods and (optionally) converts the requested data.

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
## Using

... documentation coming