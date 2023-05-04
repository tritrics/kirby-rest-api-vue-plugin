<script setup>
import ApiRequestView from './views/ApiRequestView.vue'
</script>

<template>
  <Suspense>
    <template #default>
      <ApiRequestView />
    </template>
    <template #fallback>
      <div>loading...</div>
    </template>
  </Suspense>
</template>
