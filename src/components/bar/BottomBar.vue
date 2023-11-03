<template>
  <div class="bottom-bar">
    <el-footer style="text-align: center; color: #999; font-size: 14px;">
      <a href="https://beian.miit.gov.cn/" target="_blank">备案号：冀ICP备2023010443号</a>
      <br>
      <a href="https://github.com/BBMQyyds/zhitale" target="_blank">https://github.com/BBMQyyds/zhitale</a>
      <br>
      <span>联系我们：18331596583 3369855428@qq.com</span>
    </el-footer>
  </div>
</template>

<script>

export default {
  name: "BottomBar",
};

</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.bottom-bar {
  background: url("../../assets/img/bottom.jpg") no-repeat;
  background-size: cover;
}

a {
  color: #777777;
}

span {
  color: #777777;
}

</style>
