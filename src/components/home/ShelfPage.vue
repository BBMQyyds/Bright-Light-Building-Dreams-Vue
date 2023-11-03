<template>
  <div class="main-page">
    <!-- 以卡片形式展示书籍 -->
    <div id="con" v-infinite-scroll="load"
         :infinite-scroll-disabled="loading || allLoaded"
         :infinite-scroll-immediate="false" class="book-card-container">
      <div v-for="(row, index) in dividedBookList" v-if="bookList.length > 0||allLoaded" :key="index" class="book-row">
        <el-card
            v-for="book in row"
            :key="book.id"
            class="book-card"
            shadow="hover"
            style="margin-right: 20px; background: rgba(255, 255, 255, 0.15);
            border: beige 1px solid;flex: 1;box-shadow: #8c939d 0 0 5px;">
          <div style="display: flex; align-items: center">
            <el-image v-loading="!book.img" :src="book.img" alt=""
                      style="width: 120px; height: 160px; margin-right: 20px;
                       cursor: pointer;box-shadow: 0 0 10px rgba(0,0,0,0.5);"></el-image>
            <div style="display: flex; flex-direction: column; justify-content: space-between">
              <div class="book-info">
                <h2 class="book-title">{{ book.title }}</h2>
                <div class="book-tags">
                  <span class="book-author" style="margin-right: 10px">{{ book.author_name }}</span>
                  <el-tag v-for="tag in book.tags.slice(0, 2)" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
                <p v-if="book.history_segment">阅读至：</p>
                <p v-if="book.history_segment" class="book-history">{{ book.history_segment.title }}</p>
                <p v-if="book.history_segment">{{ book.action_time }}</p>
                <p v-else>暂无阅读记录</p>
              </div>
            </div>
          </div>
        </el-card>
      </div>

      <el-skeleton v-else animated>
        <template #template>
          <div v-for="index in rowsPerPage" :key="index" class="book-row">
            <el-card v-for="index in itemsPerRow" :key="index" class="book-card" shadow="hover"
                     style="margin-right: 20px; background: transparent; border: none; box-shadow: none">
              <div style="display: flex; align-items: center">
                <el-skeleton-item style="width: 120px; height: 160px; margin-right: 20px"></el-skeleton-item>
                <div style="display: flex; flex-direction: column; justify-content: space-between">
                  <div class="book-info">
                    <el-skeleton-item style="width: 200px; height: 20px; margin-bottom: 10px"></el-skeleton-item>
                    <el-skeleton-item style="width: 150px; height: 20px; margin-bottom: 10px"></el-skeleton-item>
                    <el-skeleton-item style="width: 200px; height: 20px; margin-bottom: 10px"></el-skeleton-item>
                    <el-skeleton-item style="width: 200px; height: 20px; margin-bottom: 10px"></el-skeleton-item>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
        </template>
      </el-skeleton>
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
import router from "@/router";

export default {
  name: "ShelfPage",
  data() {
    return {
      user: this.$store.state.user,
      bookList: [],
      itemsPerRow: 4,
      rowsPerPage: 6,
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
  },
  // created() {
  //   this.getTaleList();
  // },
  activated() {
    if (!this.$store.state.user) {
      this.$msg({
        customClass: 'messageIndex',
        duration: 1000,
        type: 'warning',
        message: '您尚未登录',
      });
      router.push('/home/main');
    } else {
      if (this.bookList.length === 0) {
        this.getTaleList();
      } else {
        this.bookList.forEach(item => {
          if (!this.$resource.isLoaded(item.img)) {
            this.$resource.getInterface(item);
          }
        })
      }
    }
  },
  methods: {
    //查询
    query() {
      this.currentPage = 1;
      this.bookList = [];
      this.loading = true;
      this.allLoaded = false;
      this.getTaleList();
    },
    // 加载更多
    load() {
      this.loading = true;
      this.getTaleList();
    },
    // 获取书籍列表
    getTaleList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('selectCollectTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          status: 1,
          sort: 'desc',
          offset: (this.currentPage - 1) * (this.rowsPerPage * this.itemsPerRow),
          pageSize: this.rowsPerPage * this.itemsPerRow,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          let data = JSON.parse(this.$aes.decrypt(response.data.data));
          console.log(data);
          if (data !== null && data.length > 0) {
            this.bookList.push(...data);
            for (let i = (this.currentPage - 1) * 24; i < this.bookList.length; i++) {
              this.$resource.getInterface(this.bookList[i]);
              this.bookList[i].hover = false;
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
          this.loading = false;
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
  }
}
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.book-row {
  display: flex;
  margin-bottom: 20px;
}

.book-card {
  width: 600px;
  margin-right: 20px;
  margin-bottom: 20px;
}

.book-title:hover {
  color: #409EFF;
  cursor: pointer;
}

.main-page {
  padding: 40px;
}

.book-card-container {
  margin-top: 20px;
}

.el-tag {
  margin-right: 5px;
}

.el-image:hover {
  transform: scale(1.1);
  transition: all 0.5s;
}

.book-history {
  margin-top: -10px;
}

.book-history:hover {
  color: #409EFF;
  cursor: pointer;
}

</style>