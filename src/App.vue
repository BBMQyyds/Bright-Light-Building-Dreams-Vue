<template>
  <div id="app">
    <router-view v-if="isRouterAlive" v-wechat-title="$route.meta.title"/>
  </div>
</template>

<script>

export default {
  name: 'App',
  // provide() {
  //   return {
  //     reload: this.reload
  //   }
  // },
  data() {
    return {
      isRouterAlive: true,
    }
  },
  // methods: {
  //   reload() {
  //     this.$route.meta.keepAlive = false;
  //     this.$nextTick(() => {
  //       this.$route.meta.keepAlive = true;
  //     });
  //   }
  // }
}

</script>

<style>

html, body {
  width: 100%;
  height: 100%;
  margin: 0;
}

</style>
