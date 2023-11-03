<template>
  <div id="app">
    <router-view v-if="isRouterAlive" v-wechat-title="$route.meta.title"/>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      isRouterAlive: true,
    }
  },
}
</script>

<style>

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}

</style>
