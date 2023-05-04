<script setup async>
import { useApi } from '../kirbyRestApiVuePlugin'

const { request: newRequest } = useApi()
const json = await newRequest().all().node('apitest')
json.log()

// (async () => {
//   const { request: newRequest } = useApi()
//   const json = await newRequest().all().node('apitest')
//   json.log()
// })()

// const request = this.$api.request()
  // request.host('http://localhost/rest-api')
  // request.lang()
  // request.fields()
  // request.all()
  // request.limit()
  // request.page()
  // request.order()
  // request.parse('raw', 'router-links', 'nl2br', 'include-label')
  // const languages = await request.languages()
  // const node = await request.node()
  // const children = request.children()
  // const json = await this.$api.request().fields('files').node('apitest')
  // json.log()
  // const image = this.$api.image(json.content.files[0], 400, 400)
  // console.log(image.src)
</script>
<template>
  <h1>Kirby Rest Api Vue Plugin</h1>
</template>