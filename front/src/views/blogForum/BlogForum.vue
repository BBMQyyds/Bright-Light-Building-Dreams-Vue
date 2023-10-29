<template>
  <div>
    <div class="forum_list">
      <el-row>
        <el-col v-for="(post, index) in this.postList" :key="post.postId" :span="15">
          <el-card class="post_card">
            <div id="title">
              <router-link :to="{ name: 'Post', params: { postId: post.postId } }">
                <el-link type="primary">{{ post.title }}</el-link>
              </router-link>
            </div>
            <div class="description">
              <span id="description_content">
                {{post.description}}
              </span>
            </div>
            <div class="content">
              <span id="content">
              <span v-if="showFullContent">{{ post.content }}</span>
              <span v-else>{{ post.content.substring(0, maxDescriptionLength) }}</span>
              <a v-if="post.content.length > maxDescriptionLength" @click="toggleContent" class="toggle-link">
                {{ showFullContent ? '收起内容' : '显示更多' }}
              </a>
              </span>
            </div>

            <div id="button_group">
              <el-button
                id="upvote_button"
                :class="{
                  'upvote-active': upvoteClicked[index],
                  'upvote-inactive': !upvoteClicked[index]
                }"
                icon="el-icon-caret-top"
                @click="toggleUpvote(index)">
                点赞 | {{ post.upvotes }}
              </el-button>
              <el-button
                id="comment_button"
                icon="el-icon-chat-dot-round"
                @click="toComment(index)">
                {{ post.comments }}条评论
              </el-button>
              <el-button
                id="share_button"
                icon="el-icon-s-promotion">
                分享
              </el-button>
              <el-button
                id="star_button"
                icon="el-icon-star-off">
                收藏
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  import request from "../../util/request";
  import {restoreNewlines} from "../../util/commonUtils";
  export default {
    name: "BlogForum",
    data() {
      return {
        Avatar: "",
        upvoteClicked: [], // 用于追踪每个按钮的点击状态
        showFullContent: false,
        maxDescriptionLength: 15, // 设置您希望的最大显示长度
        pageAttribute:{
          page:1,
          size:5,
          sort:"createTime",
          order:"desc"
        },
        postList:[],
      }
    },
    created() {
      this.getPostList();
    },
    methods:{
      getPostList(){
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
        this.$store.state.commonsModule.RequestBody.data=JSON.stringify(this.pageAttribute);
        request.post("/ForumRead/getPostList",this.$store.state.commonsModule.RequestBody,{ withCredentials: true }).then(res=>{
          this.postList=JSON.parse(res.data.data);
          console.log(this.postList);
          this.upvoteClicked = new Array(this.postList.length).fill(false);
        }).catch(err=>{
          console.log(err)
        })
      },
      toggleContent() {
        this.showFullContent = !this.showFullContent;
      },
      toggleUpvote(index) {
       if(this.upvoteClicked[index]){
         this.upvoteClicked[index]=false;
         this.postList[index].upvotes--;
       }else{
          this.upvoteClicked[index]=true;
          this.postList[index].upvotes++;
       }
      },
      toComment(index){

      }
    }
  };
</script>

<style scoped>
  .forum_list {
    margin-left: 16%;
  }
  .post_card{
  }
  .el-link {
    font-size: 32px;
    font-weight: bold;
    font-style: normal;
  }
  .description{
  }
  .description #description_content{
    font-size: 20px;
    font-style: normal;
  }
  .content #content{
    font-size: 14px;
  }
  .toggle-link {
    color: #64b1d5; /* 设置文本颜色为蓝色 */
    text-decoration: underline; /* 添加下划线 */
  }
  #button_group{
    margin-top: 20px;
  }
  #upvote_button{
    font-size: 15px;
  }
  #upvote_button.upvote-active {
    background-color: #226fff !important;
    color: white !important;
  }
  #upvote_button.upvote-inactive{
    background-color: #FFFFFF;
  }
  #comment_button{
    margin-left: 20px;
    font-size: 15px;
  }
  #share_button{
    margin-left: 20px;
    font-size: 15px;
  }
  #star_button{
    margin-left: 20px;
    font-size: 15px;
  }
  .content #content{
    white-space: pre-line;
    word-wrap: break-word;
  }
  /* 在这里可以添加样式 */
</style>
