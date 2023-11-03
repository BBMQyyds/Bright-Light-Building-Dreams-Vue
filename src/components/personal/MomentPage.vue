<template>
  <div class="main-page">
    收藏
  </div>
</template>

<script>

import router from "@/router";

export default {
  name: "MomentPage",
  created() {
    if (!this.$store.state.user) {
      this.$msg({
        customClass: 'messageIndex',
        duration: 1000,
        type: 'warning',
        message: '您尚未登录',
      });
      router.push('/home/main');
    }
  }
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

</style>