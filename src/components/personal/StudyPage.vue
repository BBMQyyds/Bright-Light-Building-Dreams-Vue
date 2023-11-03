<template>
  <div>
    <div class="study-page">
      <h2 class="section-title">学习总结</h2>
      <ul v-infinite-scroll="load"
          :infinite-scroll-disabled="loading || allLoaded"
          :infinite-scroll-immediate="false"
          class="exp-list">
        <li v-for="item in codeList" :key="item.id" class="exp-item">
          <h3 class="exp-question">{{ item.title }}</h3>
          <div :codetype="item.type" class="hljs-container">
            <!--在右上角添加复制按钮-->
            <div style="text-align: right">
              <el-button class="copy-btn" type="text" @click="copyCode(item.code)">
                <i class="el-icon-document-copy"></i>复制
              </el-button>
            </div>
            <div style="display: flex;width: 100%;margin-top: -15px">
              <ul class="hljs-code-number">
                <li v-for="i in lineCount(item.code)" :key="i" class="line">{{ i }}</li>
              </ul>
              <highlightjs :code="item.code" :codetype="Vue" class="hljs"></highlightjs>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <!--已经到底了提示-->
    <div v-if="allLoaded">
      <el-alert center show-icon style="background: transparent;margin-bottom: 60px;font-size: 16px"
                title="被掏空什么的最讨厌了，没有更多了哦~"
                type="info">
      </el-alert>
    </div>
  </div>
</template>

<script>

import studyData from '@/assets/json/study.json'

export default {
  name: "StudyPage",
  methods: {
    lineCount(code) {
      const codeArr = code.split('\n');
      return codeArr.length;
    },
    copyCode(code) {
      const input = document.createElement('input');
      input.setAttribute('readonly', 'readonly');
      input.setAttribute('value', code);
      document.body.appendChild(input);
      input.select();
      if (document.execCommand('copy')) {
        document.execCommand('copy');
        this.$message({
          message: '复制成功',
          type: 'success',
          duration: 1000,
          customClass: 'messageIndex',
        });
      }
      document.body.removeChild(input);
    },
    load() {
      this.loading = true;
      if (this.page < this.codePageList.length) {
        this.codeList = this.codeList.concat(this.codePageList[this.page]);
        this.page++;
      } else {
        this.allLoaded = true;
        this.$message({
          message: '没有更多了哦~',
          type: 'warning',
          duration: 1000,
          customClass: 'messageIndex',
        });
      }
      this.loading = false;
    },
  },
  created() {
    this.codePageList = studyData;
    this.codeList = this.codePageList[0];
  },
  data() {
    return {
      codePageList: [],
      codeList: [],
      page: 1,
      loading: false,
      allLoaded: false,
//       codeList: [
//         {
//           id: 1,
//           type: 'Vue',
//           title: 'vue3使用keep-alive缓存界面',
//           code: `<router-view v-slot="{ Component }" v-wechat-title="$route.meta.title">
//   <keep-alive>
//     <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path"/>
//   </keep-alive>
//   <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path"/>
// </router-view>`,
//         }
//       ],
    }
  },
};
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.study-page {
  padding: 40px;
  margin-left: 18%;
}

.section-title {
  font-size: 20px;
  font-weight: bold;
  margin-top: 20px;
  margin-left: 50px;
}

.exp-list {
  list-style-type: none;
  padding: 0;
  margin: 0 0 0 50px;
}

.exp-item {
  margin-bottom: 40px;
  margin-left: 20px;
}

.exp-question {
  font-size: 18px;
  font-weight: bold;
}

/* 语法高亮 */
.hljs-container {
  position: relative;
  display: block;
  width: 1000px;
  padding: 30px 5px 2px;
  overflow-x: hidden;
  line-height: 20px;
  text-align: left;
  background: #21232A;
  box-shadow: 0 10px 30px 0 rgb(0 0 0 / 40%);
}

/** 3个点 */
.hljs-container::before {
  color: #8c939d;
  position: absolute;
  top: 10px;
  left: 15px;
  width: 12px;
  height: 12px;
  overflow: visible;
  font-weight: 700;
  font-size: 16px;
  line-height: 12px;
  white-space: nowrap;
  text-indent: 75px;
  background-color: #fc625d;
  border-radius: 16px;
  box-shadow: 20px 0 #fdbc40, 40px 0 #35cd4b;
  content: attr(codetype);
}

/** 滚动条 */
:deep(.hljs) {
  overflow-x: auto;
}

:deep(.hljs::-webkit-scrollbar) {
  width: 12px !important;
  height: 12px !important;
}

:deep(.hljs::-webkit-scrollbar-thumb) {
  height: 30px !important;
  background: #d1d8e6;
  background-clip: content-box;
  border: 2px solid transparent;
  border-radius: 19px;
  opacity: 0.8;
}

:deep(.hljs::-webkit-scrollbar-thumb:hover) {
  background: #a5b3cf;
  background-clip: content-box;
  border: 2px solid transparent;
}

:deep(.hljs::-webkit-scrollbar-track-piece) {
  width: 30px;
  height: 30px;
  background: #333;
}

::-webkit-scrollbar-button {
  display: none;
}

/** 行数样式 */
.hljs-code-number {
  flex: 1;
  padding: 29px 10px 0;
  color: #d1d8e6;
  font-size: 12px;
  list-style: none;
  border-right: 1px solid #d1d8e6;
}

.hljs {
  flex: 50;
  margin-right: 25px;
}

.copy-btn {
  color: #8c939d;
  margin-right: 10px;
  margin-top: -50px;
}

.copy-btn:hover {
  color: #409eff;
  cursor: pointer;
}

</style>

