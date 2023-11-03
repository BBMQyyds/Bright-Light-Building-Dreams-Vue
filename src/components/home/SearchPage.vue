<template>
  <div class="search-page">

    <!--添加按最新、最热排序-->
    <div class="sort" style="margin-bottom: 20px;margin-left: 150px">
      <el-radio-group v-model="thing" style="margin-left: 20px" @change="query">
        <el-radio-button label="tale">故事</el-radio-button>
        <el-radio-button label="segment">章节</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="sort" style="margin-left: 40px" @change="query">
        <el-radio-button label="relevance">相关</el-radio-button>
        <el-radio-button label="time">最新</el-radio-button>
        <el-radio-button label="count">最热
        </el-radio-button>
      </el-radio-group>
    </div>

    <div>
      <p style="font-size: 15px;margin-left: 250px">共<span style="color: #409EFF">{{ this.allCount }}</span>相关的结果
      </p>
    </div>

    <!-- 以卡片形式展示书籍 -->
    <div v-if="thing==='tale'" id="con" v-infinite-scroll="load"
         :infinite-scroll-disabled="loading || allLoaded"
         :infinite-scroll-immediate="false" class="item-card-container">
      <div v-for="(row, index) in dividedBookList" v-if="bookList.length > 0 || allLoaded" :key="index"
           class="item-row">
        <el-card
            v-for="book in row"
            :key="book.id"
            class="item-card"
            shadow="hover"
            style="margin: 0 20px 20px; background: transparent; width: 100%;background-blend-mode: darken;
        border: #409EFF solid 2px; border-radius: 10px;">
          <div style="display: flex; align-items: center">
            <el-image v-loading="!book.img" :src="book.img"
                      alt="" style="width: 150px; height: 200px; margin-right: 20px; cursor: pointer"></el-image>
            <div class="item-info" style="width: 100%">
              <div style="display: flex;align-items: center;margin-bottom: -10px">
                <h2 class="item-title" style="font-size: 24px;text-align: left;flex: 5"
                    v-html="filterWord(book.title)"></h2>
                <div class="item-tags" style="flex: 5;text-align: right;margin-right: 40px">
                  <el-tag v-for="tag in book.tags" :key="tag" size="large" style="margin-right: 20px"
                          type="success" v-html="filterWord(tag)"></el-tag>
                </div>
              </div>
              <div style="display: flex;align-items: center">
                <div style="flex: 5">
                  <p class="item-author" style="font-size: 16px;text-align: left;color:#696969;"
                     v-html="filterWord('作者：'+book.author_name +'&emsp;&emsp;热度：'+ this.$utils.numfix(book.heat))"></p>
                  <p class="item-intro" style="font-size: 16px;text-align: left;color:#696969;"
                     v-html="filterWord(book.intro)"></p>
                </div>
                <div style="flex: 5;text-align: right;margin-right: 60px">
                  <el-button style="padding-top: 8px" type="primary" @click="toBook(book.id)">开始阅读</el-button>
                </div>
              </div>
              <div style="display: flex;align-items: center">
                <div style="flex: 5">
                  <p class="item-update" style="font-size: 16px;text-align: left;color:#696969;">
                    最近更新：<span class="latest">{{
                      book.latest_segment ? book.latest_segment.title : '暂无更新'
                    }}</span>
                    <span style="color:#696969;margin-left: 20px;">{{
                        book.latest_segment ? this.$utils.getFormatTime(book.latest_segment.update_time) : ''
                      }}</span>
                  </p>
                </div>
                <div style="flex: 5;text-align: right;margin-right: 60px">
                  <p class="item-update" style="font-size: 16px;">
                    {{ '更新时间：' + book.update_time }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 以卡片形式展示章节 -->
    <div v-if="thing==='segment'" id="con" v-infinite-scroll="load"
         :infinite-scroll-disabled="loading || allLoaded"
         :infinite-scroll-immediate="false" class="item-card-container">
      <div v-for="(row, index) in dividedSegmentList" v-if="segmentList.length > 0 || allLoaded" :key="index"
           class="item-row">
        <el-card
            v-for="segment in row"
            :key="segment.id"
            class="item-card"
            shadow="hover"
            style="margin: 0 20px 20px; background: transparent; width: 100%;
        border: #409EFF solid 2px; border-radius: 10px;">
          <div style="display: flex; align-items: center">
            <el-image v-loading="!segment.img" :src="segment.img"
                      alt="" style="width: 150px; height: 200px; margin-right: 20px; cursor: pointer"></el-image>
            <div class="item-info" style="width: 100%">
              <div style="display: flex;align-items: center;margin-bottom: -10px">
                <h2 style="font-size: 22px;text-align: left;flex: 5">
                  <span class="item-title" v-html="filterWord(segment.title)"></span>
                </h2>
                <div class="item-name" style="flex: 5;text-align: right;margin-right: 60px">
                  <h2 style="font-size: 22px;text-align: right;flex: 5">
                    <span class="item-title" v-html="filterWord(segment.tale_name)"></span>
                  </h2>
                </div>
              </div>
              <div style="display: flex;align-items: center">
                <div style="flex: 5">
                  <p class="item-author" style="font-size: 16px;text-align: left;color:#696969;"
                     v-html="filterWord('作者：'+segment.user_name +'&emsp;&emsp;热度：'+ this.$utils.numfix(segment.heat))"></p>
                  <p class="item-content" style="font-size: 16px;text-align: left;color:#696969;"
                     v-html="filterWord(segment.content)"></p>
                </div>
                <div style="flex: 5;text-align: right;margin-right: 60px">
                  <el-button style="padding-top: 8px" type="primary" @click="toBook(segment.id)">开始阅读</el-button>
                </div>
              </div>
              <div style="display: flex;align-items: center">
                <div style="flex: 5">
                  <p class="item-update" style="font-size: 16px;text-align: left;color:#696969;">
                    {{ this.$utils.getFormatTime(segment.update_time) }}
                  </p>
                </div>
                <div style="flex: 5;text-align: right;margin-right: 60px">
                  <p class="item-update" style="font-size: 16px;">
                    {{ '更新时间：' + segment.update_time }}</p>
                </div>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!--加载动画,在中间小圈-->
    <div v-if="loading&&!allLoaded" style="margin-bottom: 50px">
      <p v-loading="true" element-loading-text="玩命加载中..."></p>
    </div>

    <!--已经到底了提示-->
    <div v-if="allLoaded">
      <el-alert center show-icon style="background: transparent;" title="被掏空什么的最讨厌了，没有更多了哦~"
                type="info">
      </el-alert>
    </div>

  </div>
</template>

<script>
import request from "@/api";
import {eventBus} from "@ai-zen/event-bus";

export default {
  name: "SearchPage",
  data() {
    return {
      thing: "tale",
      bookList: [],
      segmentList: [],
      allCount: 0,
      itemsPerRow: 1,
      rowsPerPage: 6,
      sort: "relevance",
      categoryList: ["全部"],
      selectedCategory: "全部",
      tagList: ["全部"],
      selectedTag: "全部",
      currentPage: 1,
      loading: true,
      allLoaded: false,
    };
  },
  computed: {
    dividedBookList() {
      const divided = [];
      for (let i = 0; i < this.bookList.length; i += this.itemsPerRow) {
        divided.push(this.bookList.slice(i, i + this.itemsPerRow));
      }
      return divided;
    },
    dividedSegmentList() {
      const divided = [];
      for (let i = 0; i < this.segmentList.length; i += this.itemsPerRow) {
        divided.push(this.segmentList.slice(i, i + this.itemsPerRow));
      }
      return divided;
    },
  },
  activated() {
    eventBus.on("search", () => {
      this.query();
    });
    this.query();
  },
  deactivated() {
    this.allCount = 0;
    this.currentPage = 1;
    this.bookList = [];
    this.segmentList = [];
    this.loading = true;
    this.allLoaded = false;
  },
  methods: {
    toBook(id) {
      console.log(id);
    },
    //查询
    query() {
      this.allCount = 0;
      this.currentPage = 1;
      this.bookList = [];
      this.segmentList = [];
      this.loading = true;
      this.allLoaded = false;
      this.getAllCount();
      this.getItemList();
    },
    // 加载更多
    load() {
      this.loading = true;
      this.getItemList();
    },
    // 获取书籍列表总数
    getAllCount() {
      if (this.thing === "tale") {
        this.getTaleCount();
      } else {
        this.getSegmentCount();
      }
    },
    // 获取书籍列表总数
    getTaleCount() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('searchTaleByPageCount'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          status: 1,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          if (data !== null) {
            this.allCount = data;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    // 获取章节列表总数
    getSegmentCount() {
      request.post('/segment', JSON.stringify({
        apiType: this.$aes.encrypt('searchSegmentCount'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          status: 1,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          if (data !== null) {
            this.allCount = data;
          }
        }
      }).catch(error => {
        console.log(error);
      });
    },
    getItemList() {
      if (this.thing === "tale") {
        this.getTaleList();
      } else {
        this.getSegmentList();
      }
    },
    // 获取书籍列表
    getTaleList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('searchTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          sortType: this.sort,
          sort: 'desc',
          status: 1,
          offset: (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow),
          pageSize: this.rowsPerPage * this.itemsPerRow,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          if (data !== null && data.length > 0) {
            this.bookList.push(...data);
            for (let i = (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow); i < this.bookList.length; i++) {
              this.$resource.getInterface(this.bookList[i]);
              this.bookList[i].heat = this.bookList[i].collect_count * 20 + this.bookList[i].comment_count * 15
                  + this.bookList[i].like_count * 5 + this.bookList[i].browse_count * 2
            }
            this.currentPage++;
            this.loading = false;
          } else {
            this.$msg({
              customClass: 'messageIndex',
              duration: 1000,
              type: 'warning',
              message: '没有更多了'
            });
            this.allLoaded = true;
          }
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(response.data.message)
          });
        }
      }).catch((err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试'
        });
      }));
    },
    getSegmentList() {
      request.post('/segment', JSON.stringify({
        apiType: this.$aes.encrypt('searchSegmentList'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          sortType: this.sort,
          sort: 'desc',
          status: 1,
          offset: (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow),
          pageSize: this.rowsPerPage * this.itemsPerRow,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          if (data !== null && data.length > 0) {
            this.segmentList.push(...data);
            for (let i = (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow); i < this.segmentList.length; i++) {
              this.$resource.getInterface(this.segmentList[i]);
              this.segmentList[i].heat = this.segmentList[i].collect_count * 20 + this.segmentList[i].comment_count * 15
                  + this.segmentList[i].like_count * 5 + this.segmentList[i].browse_count * 2
            }
            this.currentPage++;
            this.loading = false;
          } else {
            this.$msg({
              customClass: 'messageIndex',
              duration: 1000,
              type: 'warning',
              message: '没有更多了'
            });
            this.allLoaded = true;
          }
        } else {
          this.$msg({
            customClass: 'messageIndex',
            duration: 1000,
            type: 'error',
            message: this.$aes.decrypt(response.data.message)
          });
        }
      }).catch((err => {
        console.log(err);
        this.$msg({
          customClass: 'messageIndex',
          duration: 1000,
          type: 'error',
          message: '请求异常，请刷新重试'
        });
      }));
    },
    filterWord(text) {
      if (text) {
        let keywordJoin = this.$store.state.searchKeyWord;
        return text.replace(new RegExp('(' + keywordJoin + ')', 'g'), '<span style="color: #409EFF; ">$1</span>')
      }
    },
  },
};
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.item-row {
  justify-content: center;
  text-align: center;
  display: flex;
}

.item-card {
  width: 600px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.item-title:hover {
  color: #409EFF;
  cursor: pointer;
}

.search-page {
  padding: 40px;
}

.item-card-container {
  margin: auto;
  width: 80%;
}

.el-tag {
  margin-right: 5px;
}

.el-image:hover {
  transform: scale(1.1);
  transition: all 0.5s;
}

.el-card:hover {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
}

.latest:hover {
  color: #409EFF;
  cursor: pointer;
}

</style>
