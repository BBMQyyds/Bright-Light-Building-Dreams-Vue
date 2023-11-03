<template>
  <div class="library-page">

    <!-- 添加分类和标签选择选项 -->
    <div class="filter-container">
      <div class="classify" style="margin-bottom: 20px">
        <span style="font-size: 16px;color: #909399;">分 类 ：</span>
        <el-button v-for="category in categoryList" :key="category" :plain="selectedCategory !== category"
                   size="default"
                   style="padding-top: 8px;margin-left: 20px"
                   type="primary" @click="changeCategory(category)">{{ category }}
        </el-button>
      </div>
      <div class="tag" style="margin-bottom: 20px">
        <span style="font-size: 16px;color: #909399;">标 签 ：</span>
        <el-button v-for="tag in tagList" :key="tag" :plain="selectedTag !== tag" size="default"
                   style="padding-top: 8px;margin-left: 20px"
                   type="primary" @click="changeTag(tag)">{{ tag }}
        </el-button>
      </div>
    </div>

    <!--添加按最新、最热排序-->
    <div class="sort" style="margin-bottom: 20px">
      <span style="font-size: 16px;color: #909399;">排 序 ：</span>
      <el-radio-group v-model="sort" style="margin-left: 20px" @change="query">
        <el-radio-button label="update_time">最新</el-radio-button>
        <el-radio-button label="collect_count * 20 + comment_count * 15 +
         like_count * 5 + browse_count * 2">最热
        </el-radio-button>
      </el-radio-group>
    </div>

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
            style="margin-right: 20px; background: transparent; border: none; box-shadow: none">
          <div style="display: flex; align-items: center">
            <el-image v-loading="!book.img" :src="book.img"
                      alt="" style="width: 120px; height: 160px; margin-right: 20px; cursor: pointer"></el-image>
            <div style="display: flex; flex-direction: column; justify-content: space-between">
              <div class="book-info">
                <h2 class="book-title">{{ book.title }}</h2>
                <p class="book-author">{{ book.author_name }}&emsp;热度：{{ this.$utils.numfix(book.heat) }}</p>
                <div class="book-tags">
                  <el-tag v-for="tag in book.tags.slice(0, 3)" :key="tag" size="small">{{ tag }}</el-tag>
                </div>
                <p class="book-intro">{{ book.intro.length > 16 ? book.intro.slice(0, 16) + '...' : book.intro }}</p>
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

export default {
  name: "libraryPage",
  data() {
    return {
      bookList: [],
      itemsPerRow: 4,
      rowsPerPage: 6,
      sort: "update_time",
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
  },
  // created() {
  //   this.getCategoryList();
  //   this.getTagList();
  //   this.getTaleList();
  // },
  activated() {
    if (this.categoryList.length === 1) {
      this.getCategoryList();
    }
    if (this.tagList.length === 1) {
      this.getTagList();
    }
    if (this.bookList.length === 0) {
      this.getTaleList();
    } else {
      this.bookList.forEach(item => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      });
    }
  },
  methods: {
    changeCategory(category) {
      this.selectedCategory = category;
      this.query();
    },
    changeTag(tag) {
      this.selectedTag = tag;
      this.query();
    },
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
        apiType: this.$aes.encrypt('selectTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          type: this.selectedCategory === '全部' ? null : this.selectedCategory,
          tag: this.selectedTag === '全部' ? null : this.selectedTag,
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
            for (let i = (this.currentPage - 1) * 24; i < this.bookList.length; i++) {
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
    // 获取分类列表
    getCategoryList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('getCategory'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.categoryList.push(...JSON.parse(this.$aes.decrypt(response.data.data)));
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
    // 获取标签列表
    getTagList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('getTags'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.tagList.push(...JSON.parse(this.$aes.decrypt(response.data.data)));
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
  },
};
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

.library-page {
  padding: 40px;
}

.classify {
  display: flex;
  align-items: center;
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

</style>
