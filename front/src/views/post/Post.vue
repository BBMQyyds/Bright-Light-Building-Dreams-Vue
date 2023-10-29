<template>
  <div class="content">
    <div class="date">
      <div id="date_content">
        <span>
         发布于{{ post.createTime | formatDateTime }}
        </span>
      </div>
    </div>
    <div class="title">
      <div id="title_content">
        {{ post.title }}
      </div>
      <div id="title_extra">
        <span>
          浏览数:{{post.views}} | 评论数:{{post.comments}} | 点赞数:{{post.upvotes}}
        </span>
      </div>
    </div>
    <hr>
<!--    <div class="description">-->
<!--      <div id="description_content">-->
<!--        <span>-->
<!--          {{post.description}}-->
<!--        </span>-->
<!--      </div>-->
<!--    </div>-->
    <div class="post_content">
      <router-link to="/CheckUser">
      <div id="user_identity">
        <el-avatar :size="50" :src="imageUrl"></el-avatar>
        <span id="identity_text">
          {{user.username}}
        </span>
      </div>
      </router-link>
      <div id="post_content_content">
        <span>
          {{ post.content }}
        </span>
      </div>
      <div class="button_group">

      </div>
    </div>
    <div class="comment">
      <div id="comment_content">

      </div>

    </div>
  </div>
</template>

<script>
  import request from "../../util/request";
  export default {
    name: "Post",
    data(){
      return{
        post:{},
        user:{},
        postId:"",
        imageUrl:""
      }
    },
    created() {
      this.postId = this.$route.params.postId;
      this.getPost();
      this.addViews();
    },
    methods:{
      getPost(){
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
        this.$store.state.commonsModule.RequestBody.data=this.postId;
        request.post('/ForumRead/getPost',this.$store.state.commonsModule.RequestBody,{withCredentials:true}).then(res=>{
          this.post=JSON.parse(res.data.data);
          this.getAuthor();
        }).catch(err=>{
          console.log(err);
        })
      },
      addViews(){
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
        this.$store.state.commonsModule.RequestBody.data=this.postId;
        request.post('/ForumWrite/addViews',this.$store.state.commonsModule.RequestBody,{withCredentials:true}).then(res=>{
        }).catch(err=>{
          console.log(err);
        })
      },
      getAuthor(){
        this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
        this.$store.state.commonsModule.RequestBody.data=this.post.author;
        request.post('/ForumRead/getAuthor',this.$store.state.commonsModule.RequestBody,{withCredentials:true}).then(res=>{
          this.user=JSON.parse(res.data.data);
        }).catch(err=>{
          console.log(err);
        })
      },
      getAvatar(){
        if(this.imageUrl===""){
          this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
          this.$store.state.commonsModule.RequestBody.data=this.user.userId;
          request.post("/File/getAvatar",this.$store.state.commonsModule.RequestBody,{responseType: 'blob',withCredentials:true}).then(res=>{
            let blob = new Blob([res.data], { type: "application/octet-stream" });
            let url = window.URL.createObjectURL(blob);
            console.log(url);
            this.imageUrl=url;
            console.log(this.imageUrl);
          }).catch(err=>{
            console.log(err);
          })
        }
      },
    },
    filters: {
      formatDateTime(value) {
        if (!value) return "";
        // 将日期字符串解析为日期对象
        const dateObj = new Date(value.date.year, value.date.month - 1, value.date.day);
        const timeObj = value.time;
        // 格式化日期
        const formattedDate = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}-${dateObj.getDate()}`;
        // 格式化时间
        const formattedTime = `${timeObj.hour}:${timeObj.minute}:${timeObj.second}`;
        return `${formattedDate}，${formattedTime}`;
      }
    }
  }
</script>

<style scoped>
  a{
    text-decoration: none;
  }
  .content{
    position: absolute;
    margin-left: 15%;
    width: 53%;
  }
  .date{
    font-size: 12px;
    position: absolute;
    margin-top: 3%;
    margin-left: 80%;
  }
  .title{
    display: flex;
    margin-top: 6%;
    margin-left: 4%;
  }
  .title #title_content{
    font-size: 30px;
    font-weight: bold;
  }
  .title #title_extra{
    margin-left: 2%;
    margin-top: 4%;
    width: 300px;
    font-weight: lighter;
    font-size: 12px;
  }

  /*.description{*/
  /*  margin-top: 2%;*/
  /*  margin-left: 4%;*/
  /*  width: 92%;*/
  /*  background-color: #f6f4f4;*/
  /*}*/
  /*.description #description_content{*/
  /*  font-size: 15px;*/
  /*}*/
  .post_content{
    margin-top: 2%;
    margin-left: 4%;
    width: 93%;
    height: fit-content;
    background-color: #f6f4f4;
  }
  #user_identity{
    display: flex;
  }
  .post_content #user_identity{
    margin-left: 3%;
  }
  .post_content #user_identity #identity_text{
    margin-left: 2%;
    margin-top: 2%;
    font-size: 20px;
    font-weight: bold;
  }
  .post_content #post_content_content{
    margin-left: 9%;
    font-size: 15px;
    white-space: pre-line;
    word-wrap: break-word;
  }
</style>
