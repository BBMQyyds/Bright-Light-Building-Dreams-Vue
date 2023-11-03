<template>
  <el-card>

  </el-card>
</template>

<script>
export default {
  name: "ItemList",
  props: {
    value: {
      type: String,//在props接受父组件传递数据
      default: 'fan'
    }
  },
  data() {
    return {
      listType: this.value,
      itemList: [],
    }
  },
  watch: {
    value() {
      this.listType = this.value;
    }
  },
}
</script>

<style scoped>

</style>