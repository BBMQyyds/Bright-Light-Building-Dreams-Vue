<template>
  <div class="main-page" style="text-align: center;padding: 40px;">
    <el-card class="box-card" style="background: transparent;width: 75%;margin: auto;border: none;">
      <Info/>
    </el-card>
  </div>
</template>

<script>

import router from "@/router";
import Info from "@/components/personal/center/Info.vue";

export default {
  name: "CenterPage",
  data() {
    return {
      activeIndex: '1',
    };
  },
  components: {
    Info,
  },
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
  },
  methods: {
    handleSelect(key) {
      this.activeIndex = key;
    },
  },
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.el-menu {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
  color: black;
}

.el-menu-item {
  color: black;
  background: transparent !important;
  padding-left: 60px !important;
}

.icon {
  color: black;
}

.el-menu-item:hover {
  color: #409EFF !important;
  background: transparent !important;

  .icon {
    color: #409EFF !important;
  }
}

</style>