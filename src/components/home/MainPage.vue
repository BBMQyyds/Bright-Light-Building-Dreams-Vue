<template>
  <div class="main-page">

    <el-carousel v-loading="!imgList" :interval="4000" height="400px" type="card">
      <el-carousel-item v-for="item in imgList" :key="item">
        <div class="item">
          <img :src="item.src" alt="图片丢失了" class="img">
          <div class="text">
            <h1 style="font-family: 华文行楷,serif;font-size: 32px;font-weight: lighter;color: white;">
              {{ item.name }}</h1>
            <p style="font-family: 华文行楷,serif;font-size: 20px;font-weight: lighter;color: white;">
              {{ item.description }}</p>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>

    <el-card v-loading="recommendList.length === 0" class="recommend" style="padding-bottom: 25px">
      <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
        <el-breadcrumb-item>站主推荐</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-col :span="6">
        <el-card v-if="recommendList[0]" class="box-card"
                 style="margin: 10px 10px;height: 500px;cursor: pointer;border: 2px solid #FFD700;">
          <div>
            <el-image v-loading="!recommendList[0].img"
                      :src="recommendList[0].img" alt="" style="width: 240px;height: 320px;margin-top: 10px">
            </el-image>
            <div class="info">
              <h1 style="margin-left: 20px;text-align: left;font-weight: bold">
                {{ recommendList[0].title }}</h1>
              <p style="margin-left: 20px;text-align: left;font-style: italic">
                {{ recommendList[0].author_name }}
                <el-tag v-for="(tag,index) in recommendList[0].tags.slice(0,2)" :key="index" class="ml-2"
                        size="small" style="margin-left: 10px">{{ tag }}
                </el-tag>
              </p>
              <p style="margin-left: 20px;text-align: left">
                {{
                  recommendList[0].intro.length > 16 ? recommendList[0].intro.slice(0, 16) + '...' : recommendList[0].intro
                }}</p>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="18">
        <el-row>
          <el-col v-for="(item,index) in recommendList.slice(1,5)" :key="index" :span="6">
            <el-card class="box-card" style="margin: 10px 10px;height: 240px;cursor: pointer">
              <div>
                <el-image v-loading="!item.img"
                          :src="item.img" alt="" style="width: 90px;height: 120px;margin-top: 5px"></el-image>
                <div class="info">
                  <h1 style="text-align: center;font-weight: bold">{{ item.title }}</h1>
                  <p style="text-align: center;font-style: italic">
                    {{ item.author_name }}
                    <el-tag v-for="(tag,index) in item.tags.slice(0,2)" :key="index" class="ml-2"
                            size="small" style="margin-left: 10px">{{ tag }}
                    </el-tag>
                  </p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
        <el-row>
          <el-col v-for="(item,index) in recommendList.slice(5,9)" :key="index" :span="6">
            <el-card class="box-card" style="margin: 10px 10px;height: 240px;cursor: pointer">
              <div>
                <el-image v-loading="!item.img"
                          :src="item.img" alt="" style="width: 90px;height: 120px;margin-top: 5px"></el-image>
                <div class="info">
                  <h1 style="text-align: center;font-weight: bold">{{ item.title }}</h1>
                  <p style="text-align: center;font-style: italic">
                    {{ item.author_name }}
                    <el-tag v-for="(tag,index) in item.tags.slice(0,2)" :key="index" class="ml-2"
                            size="small" style="margin-left: 10px">{{ tag }}
                    </el-tag>
                  </p>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-col>
    </el-card>

    <el-card v-loading="hotAuthorList.length === 0" class="hotAuthor">
      <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
        <el-breadcrumb-item>人气作者</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-row>
        <el-col v-for="(item,index) in hotAuthorList.slice(0,4)" :key="index" :span="6">
          <el-card :style="getBorder(index)" class="box-card" style="margin: 10px 10px;height: 240px;cursor: pointer">
            <div>
              <el-avatar :src="item.img" :style="getBorder(index)" fit="cover" size="default"></el-avatar>
              <div class="info">
                <h1>
                  {{ item.username }}</h1>
                <p>
                  {{ item.intro.length > 32 ? item.intro.slice(0, 32) + '...' : item.intro }}</p>
                <p>
                  粉丝数：{{ this.$utils.numfix(item.fan_count) }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row style="margin-bottom: 10px;">
        <el-col v-for="item in hotAuthorList.slice(4,10)" :key="item.index" :span="4">
          <el-card class="box-card" style="margin: 10px 10px;height: 220px;cursor: pointer">
            <div>
              <el-avatar :src="item.img" fit="cover" size="default"></el-avatar>
              <div class="info">
                <h1>
                  {{ item.username }}</h1>
                <p>
                  {{ item.intro.length > 16 ? item.intro.slice(0, 16) + '...' : item.intro }}</p>
                <p>
                  粉丝数：{{ this.$utils.numfix(item.fan_count) }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-card>

    <el-card v-loading="newSegmentList.length === 0" class="newSegment">
      <el-breadcrumb separator=">" style="font-size: 20px;margin: 10px 10px">
        <el-breadcrumb-item>最近更新</el-breadcrumb-item>
        <el-breadcrumb-item></el-breadcrumb-item>
      </el-breadcrumb>
      <el-table :cell-style="{'color':'black','text-align':'center'}"
                :data="newSegmentList"
                :header-cell-style="{backgroundColor:'#F2F6FC','color':'black','text-align':'center'}"
                border
                style="margin-top: 20px;margin-bottom: 10px">
        <el-table-column :resizable="false" label="故事名称" prop="tale_name"></el-table-column>
        <el-table-column :resizable="false" label="章节名称" prop="title"></el-table-column>
        <el-table-column :resizable="false" label="更新时间" prop="update_time"></el-table-column>
        <el-table-column :resizable="false" label="贡献人" prop="user_name"></el-table-column>
      </el-table>
    </el-card>

  </div>
</template>

<script>

import request from "@/api";

export default {
  name: "MainPage",
  data() {
    return {
      user: this.$store.state.user,
      imgList: [
        {
          name: '脑洞大开',
          src: require('@/assets/img/interface/brain.jpg'),
          description: '发挥你们的想象，编织出一个个脑洞大开的故事',
        },
        {
          name: '博德之门',
          src: require('@/assets/img/interface/baldur.jpg'),
          description: '博德之门太贵？那就来这里书写属于自己的传奇吧',
        },
        {
          name: '灵光一闪',
          src: require('@/assets/img/interface/idea.jpg'),
          description: '种下你的灵光，看看能收获什么样的奇思妙想',
        },
        {
          name: '逆天改命',
          src: require('@/assets/img/interface/nitian.jpg'),
          description: '故事不够刺激？那就改写一段逆天的剧情吧',
        },
      ],
      recommendList: [],
      hotAuthorList: [],
      newSegmentList: [],
    }
  },
  // created() {
  //   this.getRecommendList();
  //   this.getHotAuthorList();
  //   this.getNewSegmentList();
  // },
  activated() {
    if (this.recommendList.length === 0) {
      this.getRecommendList();
    } else {
      this.recommendList.forEach(item => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getInterface(item);
        }
      })
    }
    if (this.hotAuthorList.length === 0) {
      this.getHotAuthorList();
    } else {
      this.hotAuthorList.forEach(item => {
        if (!this.$resource.isLoaded(item.img)) {
          this.$resource.getAvatar(item);
        }
      })
    }
    if (this.newSegmentList.length === 0) {
      this.getNewSegmentList();
    }
  },
  methods: {
    getRecommendList() {
      request.post('/tale', JSON.stringify({
        apiType: this.$aes.encrypt('selectTaleByPage'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          sortType: 'browse_count',
          sort: 'desc',
          status: 1,
          offset: 0,
          pageSize: 9,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.recommendList = JSON.parse(this.$aes.decrypt(response.data.data));
          for (let i = 0; i < this.recommendList.length; i++) {
            this.$resource.getInterface(this.recommendList[i]);
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
    getHotAuthorList() {
      request.post('/user', JSON.stringify({
        apiType: this.$aes.encrypt('selectUserList'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          sortType: 'fan_count',
          sort: 'desc',
          status: 1,
          offset: 0,
          pageSize: 10,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.hotAuthorList = JSON.parse(this.$aes.decrypt(response.data.data));
          for (let i = 0; i < this.hotAuthorList.length; i++) {
            this.$resource.getAvatar(this.hotAuthorList[i]);
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
      request.post('/segment', JSON.stringify({
        apiType: this.$aes.encrypt('getSegmentList'),
        data: this.$aes.encrypt(JSON.stringify({
          id: this.user ? this.user.id : null,
          searchKeyWord: '',
          sortType: 'update_time',
          sort: 'desc',
          status: 1,
          offset: 0,
          pageSize: 10,
        })),
      })).then(response => {
        if (response.data.code === '200') {
          this.newSegmentList = JSON.parse(this.$aes.decrypt(response.data.data));
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
    getBorder(index) {
      if (index === 0) {
        return 'border: 2px solid #FFD700;'
      } else if (index === 1) {
        return 'border: 2px solid #C0C0C0;'
      } else if (index === 2) {
        return 'border: 2px solid #B87333;'
      } else {
        return 'border: 2px solid #625B57;'
      }
    },
  }
};

</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.main-page {
  width: 100%;
  height: 100%;
  text-align: center;
  justify-content: center;
}

.item {
  position: relative;
  height: 100%;
}

.img {
  width: 100%;
  height: 100%;
}

.text {
  position: absolute;
  right: 5%;
  bottom: 5%;
}

.el-carousel {
  margin: 120px auto 80px;
  width: 80%;
  height: 100%;
}

.recommend {
  background: transparent;
  border: none !important;
  margin: auto auto 80px;
  width: 75%;
  height: auto;
}

.hotAuthor {
  background: transparent;
  border: none !important;
  margin: auto auto 80px;
  width: 75%;
  height: auto;
}

.newSegment {
  background: transparent;
  border: none !important;
  margin: auto auto 80px;
  width: 75%;
  height: auto;
}

:deep(.el-table) {
  background-color: transparent !important;
}

:deep(.el-table__row) {
  background-color: transparent;
}

:deep(.el-table__row :hover) {
  cursor: pointer;
}

.box-card {
  background: transparent;
}

h1 {
  font-size: 20px;
  font-weight: lighter;
  color: black;
}

p {
  font-size: 15px;
  font-weight: lighter;
  color: black;
}

.el-image:hover {
  transform: scale(1.1);
  transition: all 0.5s;
}

.el-avatar:hover {
  transform: scale(1.1);
  transition: all 0.5s;
}

</style>