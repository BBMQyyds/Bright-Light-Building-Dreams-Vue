<template>

  <div class="main-page">

    <div class="type">
      <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
        <el-breadcrumb-item>&emsp;他们都在看</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-collapse v-model="this.categoryActiveItem" accordion @change="getBookList">
        <el-collapse-item v-for="(item, index) in categoryList" :key="index" :name="item">
          <template v-slot:title>
            <el-breadcrumb separator=">" style="font-size: 18px;margin: 40px 40px 40px 40px;">
              <el-breadcrumb-item>&emsp;{{ item }}</el-breadcrumb-item>
              <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
          </template>
          <div v-for="(row, index) in dividedBookList" v-if="bookList.length > 0" :key="index"
               class="item-row">
            <el-card
                v-for="book in row"
                :key="book.id"
                class="item-card"
                shadow="hover"
                style="margin: 0 20px 20px; background: transparent; width: 100%;">
              <div style="display: flex; align-items: center">
                <el-image v-loading="!book.img" :src="book.img"
                          alt="" style="width: 150px; height: 200px; margin-right: 20px; cursor: pointer"></el-image>
                <div class="item-info" style="width: 100%">
                  <div style="display: flex;align-items: center;margin-bottom: -10px">
                    <h2 class="item-title" style="font-size: 24px;text-align: left;flex: 5"
                        v-html="filterWord(book.title)"></h2>
                    <div class="item-tags" style="flex: 5;text-align: right;margin-right: 40px">
                      <el-tag v-for="tag in book.tags.slice(0, 3)" :key="tag" size="large" style="margin-right: 20px"
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
                      </p>
                    </div>
                    <div style="flex: 5;text-align: right;margin-right: 60px">
                      <p class="item-update" style="font-size: 16px;">
                        {{ '更新时间：' + book.update_time.split(' ')[0] }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!--加载动画,在中间小圈-->
          <div v-if="loading" style="padding-bottom: 40px">
            <p v-loading="true" element-loading-text="玩命加载中..."></p>
          </div>

        </el-collapse-item>
      </el-collapse>
    </div>

    <div class="new">
      <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
        <el-breadcrumb-item>&emsp;新书速递</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-collapse v-model="this.newCategoryActiveItem" accordion @change="getNewBookList">
        <el-collapse-item v-for="(item, index) in newCategoryList" :key="index" :name="item">
          <template v-slot:title>
            <el-breadcrumb separator=">" style="font-size: 18px;margin: 40px 40px 40px 40px;">
              <el-breadcrumb-item>&emsp;{{ item }}</el-breadcrumb-item>
              <el-breadcrumb-item></el-breadcrumb-item>
            </el-breadcrumb>
          </template>
          <div v-for="(row, index) in dividedNewBookList" v-if="newBookList.length > 0" :key="index"
               class="item-row">
            <el-card
                v-for="book in row"
                :key="book.id"
                class="item-card"
                shadow="hover"
                style="margin: 0 20px 20px; background: transparent; width: 100%;">
              <div style="display: flex; align-items: center">
                <el-image v-loading="!book.img" :src="book.img"
                          alt="" style="width: 150px; height: 200px; margin-right: 20px; cursor: pointer"></el-image>
                <div class="item-info" style="width: 100%">
                  <div style="display: flex;align-items: center;margin-bottom: -10px">
                    <h2 class="item-title" style="font-size: 24px;text-align: left;flex: 5"
                        v-html="filterWord(book.title)"></h2>
                    <div class="item-tags" style="flex: 5;text-align: right;margin-right: 40px">
                      <el-tag v-for="tag in book.tags.slice(0, 3)" :key="tag" size="large" style="margin-right: 20px"
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
                      </p>
                    </div>
                    <div style="flex: 5;text-align: right;margin-right: 60px">
                      <p class="item-update" style="font-size: 16px;">
                        {{ '更新时间：' + book.update_time.split(' ')[0] }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>

          <!--加载动画,在中间小圈-->
          <div v-if="newLoading" style="padding-bottom: 40px">
            <p v-loading="true" element-loading-text="玩命加载中..."></p>
          </div>

        </el-collapse-item>
      </el-collapse>
    </div>
  </div>

  <div class="segment">
    <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
      <el-breadcrumb-item>&emsp;好文当赏</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 以卡片形式展示章节 -->
    <div class="item-card-container">
      <el-card class="no-box" style="margin: auto; background: transparent;
      border: #C0C0C0 solid 1px; border-radius: 10px;">
        <!--加载动画,在中间小圈-->
        <div v-if="segmentLoading" style="padding-bottom: 40px">
          <p v-loading="true" element-loading-text="玩命加载中..."></p>
        </div>
        <div v-for="(row, index) in dividedSegmentList" v-if="segmentList.length > 0" :key="index"
             class="item-row">
          <el-card
              v-for="segment in row"
              :key="segment.id"
              class="item-card"
              shadow="hover"
              style="margin: 0 20px 20px; background: transparent; width: 100%;
        border: #C0C0C0 solid 1px; border-radius: 10px;">
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
      </el-card>
    </div>
  </div>

  <div class="segment">
    <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
      <el-breadcrumb-item>&emsp;新文当阅</el-breadcrumb-item>
      <el-breadcrumb-item></el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 以卡片形式展示章节 -->
    <div class="item-card-container">
      <el-card class="no-box" style="margin: auto; background: transparent;
      border: #C0C0C0 solid 1px; border-radius: 10px;">
        <!--加载动画,在中间小圈-->
        <div v-if="newSegmentLoading" style="padding-bottom: 40px">
          <p v-loading="true" element-loading-text="玩命加载中..."></p>
        </div>
        <div v-for="(row, index) in dividedSegmentList" v-if="segmentList.length > 0" :key="index"
             class="item-row">
          <el-card
              v-for="segment in row"
              :key="segment.id"
              class="item-card"
              shadow="hover"
              style="margin: 0 20px 20px; background: transparent; width: 100%;
        border: #C0C0C0 solid 1px; border-radius: 10px;">
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
      </el-card>
    </div>
  </div>

</template>

<script>

import request from "@/api";

export default {
  name: "RankPage",
  // created() {
  //   this.getCategoryList();
  //   this.getNewCategoryList();
  //   this.getSegmentList();
  //   this.getNewSegmentList();
  // },
  activated() {
    if (this.categoryList.length === 0) {
      this.getCategoryList();
    }
    if (this.newCategoryList.length === 0) {
      this.getNewCategoryList();
    }
    if (this.bookList.length === 0) {
      this.getBookList();
    } else {
      this.bookList.forEach((item) => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      });
    }
    if (this.newBookList.length === 0) {
      this.getNewBookList();
    } else {
      this.newBookList.forEach((item) => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      });
    }
    if (this.segmentList.length === 0) {
      this.getSegmentList();
    } else {
      this.segmentList.forEach((item) => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      });
    }
    if (this.newSegmentList.length === 0) {
      this.getNewSegmentList();
    } else {
      this.newSegmentList.forEach((item) => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      });
    }
  },
  data() {
    return {
      bookList: [],
      newBookList: [],
      segmentList: [],
      newSegmentList: [],
      categoryList: [],
      newCategoryList: [],
      categoryActiveItem: '',
      newCategoryActiveItem: '',
      loading: false,
      newLoading: false,
      segmentLoading: false,
      newSegmentLoading: false,
      itemsPerRow: 2,
      rowsPerPage: 4,
    }
  },
  computed: {
    dividedBookList() {
      const divided = [];
      for (let i = 0; i < this.bookList.length; i += this.itemsPerRow) {
        divided.push(this.bookList.slice(i, i + this.itemsPerRow));
      }
      return divided;
    },
    dividedNewBookList() {
      const divided = [];
      for (let i = 0; i < this.newBookList.length; i += this.itemsPerRow) {
        divided.push(this.newBookList.slice(i, i + this.itemsPerRow));
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
  methods: {
    toBook() {
      console.log('toBook');
    },
    // 获取分类列表
    getCategoryList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('getCategory'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.categoryList.push(...JSON.parse(this.$aes.decrypt(response.data.data)).slice(0, 5));
          if (this.categoryList.length > 0) {
            this.categoryActiveItem = this.categoryList[0];
            this.getBookList();
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
    getNewCategoryList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('getCategory'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.newCategoryList.push(...JSON.parse(this.$aes.decrypt(response.data.data)).slice(0, 5));
          if (this.newCategoryList.length > 0) {
            this.newCategoryActiveItem = this.newCategoryList[0];
            this.getNewBookList();
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
    getBookList() {
      this.loading = true;
      this.bookList = [];
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('selectTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          sortType: 'count',
          sort: 'desc',
          status: 1,
          offset: 0,
          pageSize: 8,
        })),
      })).then(response => {
        this.loading = false;
        if (response.data.code === '200') {
          this.bookList = JSON.parse(this.$aes.decrypt(response.data.data));
          for (let i = 0; i < this.bookList.length; i++) {
            this.$resource.getInterface(this.bookList[i]);
            this.bookList[i].heat = this.bookList[i].collect_count * 20 + this.bookList[i].comment_count * 15
                + this.bookList[i].like_count * 5 + this.bookList[i].browse_count * 2;
          }
          this.loading = false;
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
    getNewBookList() {
      this.newLoading = true;
      this.newBookList = [];
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('selectTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          sortType: 'time',
          sort: 'desc',
          status: 1,
          offset: 0,
          pageSize: 8,
        })),
      })).then(response => {
        this.newLoading = false;
        if (response.data.code === '200') {
          this.newBookList = JSON.parse(this.$aes.decrypt(response.data.data));
          for (let i = 0; i < this.newBookList.length; i++) {
            this.$resource.getInterface(this.newBookList[i]);
            this.newBookList[i].heat = this.newBookList[i].collect_count * 20 + this.newBookList[i].comment_count * 15
                + this.newBookList[i].like_count * 5 + this.newBookList[i].browse_count * 2;
          }
          this.newLoading = false;
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
      this.segmentLoading = true;
      request.post('/segment', JSON.stringify({
        apiType: this.$aes.encrypt('searchSegmentList'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          sortType: 'count',
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
            for (let i = 0; i < this.segmentList.length; i++) {
              this.$resource.getInterface(this.segmentList[i]);
              this.segmentList[i].heat = this.segmentList[i].collect_count * 20 + this.segmentList[i].comment_count * 15
                  + this.segmentList[i].like_count * 5 + this.segmentList[i].browse_count * 2
            }
            this.currentPage++;
            this.segmentLoading = false;
          } else {
            this.$msg({
              customClass: 'messageIndex',
              duration: 1000,
              type: 'warning',
              message: '没有更多了'
            });
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
    getNewSegmentList() {
      this.newSegmentLoading = true;
      request.post('/segment', JSON.stringify({
        apiType: this.$aes.encrypt('searchSegmentList'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: this.$store.state.searchKeyWord,
          sortType: 'time',
          sort: 'desc',
          status: 1,
          offset: (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow),
          pageSize: this.rowsPerPage * this.itemsPerRow,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          if (data !== null && data.length > 0) {
            this.newSegmentList.push(...data);
            for (let i = 0; i < this.newSegmentList.length; i++) {
              this.$resource.getInterface(this.newSegmentList[i]);
              this.newSegmentList[i].heat = this.newSegmentList[i].collect_count * 20 + this.newSegmentList[i].comment_count * 15
                  + this.newSegmentList[i].like_count * 5 + this.newSegmentList[i].browse_count * 2
            }
            this.currentPage++;
            this.newSegmentLoading = false;
          } else {
            this.$msg({
              customClass: 'messageIndex',
              duration: 1000,
              type: 'warning',
              message: '没有更多了'
            });
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
  }
}

</script>

<style lang="scss" scoped>

.messageIndex {
  z-index: 20000 !important;
}

.type {
  width: 90%;
  margin: 40px auto 40px;

  :deep {
    .el-collapse {
      border: #C0C0C0 solid 1px;
      border-radius: 5px;

      .el-collapse-item__header {
        background-color: transparent;
      }

      .el-collapse-item__wrap {
        background-color: transparent;
      }

      .el-collapse-item {
        border-bottom: #C0C0C0 solid 1px;
        border-radius: 5px;
      }
    }
  }
}

.new {
  width: 90%;
  margin: 40px auto 40px;

  :deep {
    .el-collapse {
      border: #C0C0C0 solid 1px;
      border-radius: 5px;

      .el-collapse-item__header {
        background-color: transparent;
      }

      .el-collapse-item__wrap {
        background-color: transparent;
      }

      .el-collapse-item {
        border-bottom: #C0C0C0 solid 1px;
        border-radius: 5px;
      }
    }
  }
}

.segment {
  width: 90%;
  margin: 40px auto 40px;
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

.el-tag {
  margin-right: 5px;
}

.el-image:hover {
  transform: scale(1.1);
  transition: all 0.5s;
}

.el-card:hover {
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  transition: all 0.5s;
}

.no-box {
  box-shadow: none !important;
}

.no-box:hover {
  box-shadow: none !important;
}

.latest:hover {
  color: #409EFF;
  cursor: pointer;
}

</style>