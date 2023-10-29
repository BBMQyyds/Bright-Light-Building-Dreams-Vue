<template>
  <div id="content">
    <div id="p1">
      帖子创建
    </div>
    <div id="title">
      <label for="title_input"
             style='display: inline-block'
             class="front_label">标题：</label> <!-- 标题文本 -->
      <el-input v-model="post.title"
                type="textarea"
                placeholder="请输入帖子的标题"
                maxlength="20"
                rows="1"
                size="large"
                show-word-limit
                id="title_input"></el-input>
    </div>
    <div id="description">
      <label for="description_input"
             style='display: inline-block'
             class="front_label">描述：</label> <!-- 标题文本 -->
      <el-input v-model="post.description"
                type="textarea"
                placeholder="请输入帖子的描述"
                maxlength="100"
                rows="3"
                size="large"
                show-word-limit
                id="description_input"></el-input>
    </div>
    <div id="tags">
      <label for="tag_list"
             style='display: inline-block'
             class="front_label">标签：</label> <!-- 标题文本 -->
      <div id="tag-list">
        <el-tag
          :key="tag"
          v-for="tag in this.tags"
          closable
          size="30px"
          :disable-transitions="false"
          @close="handleClose(tag)">
          {{tag}}
        </el-tag>
        <el-input
          class="input-new-tag"
          v-if="inputVisible"
          v-model="inputValue"
          ref="saveTagInput"
          size="small"
          @keyup.enter.native="handleInputConfirm"
          @blur="handleInputConfirm"
        >
        </el-input>
        <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
      </div>
    </div>
    <div id="post_content">
      <label for="content_input"
             style='display: inline-block'
             class="front_label">帖子具体内容：</label> <!-- 标题文本 -->
      <el-input v-model="post.content"
                type="textarea"
                placeholder="请输入帖子的具体内容"
                maxlength="500"
                :autosize="{ minRows: 8, maxRows: 15}"
                size="large"
                show-word-limit
                id="content_input"></el-input>
    </div>
    <div id="buttons">
      <el-button type="success"
                 size="medium"
                 @click="commitPost"
                 >确定</el-button>
      <el-button
                 size="medium"
                 @click="goback">取消</el-button>
    </div>
  </div>
</template>

<script>
  import request from "../../util/request";
  export default {
    beforeRouteEnter(to, from, next) {
      // 在路由进入前记录来源路由的信息
      next(vm => {
        vm.fromRoute = from;
      });
    },
    name: "CreatePost",
    data(){
      return{
        tags:[],
        inputVisible: false,
        inputValue: '',
        post:{
          title:'',
          description:'',
          tags:'',
          content:'',
          author:'',
        },
        fromRoute: this.$route.params.from,
      }
    },
    created() {
    },
    methods:{
      handleClose(tag) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      },

      showInput() {
        this.inputVisible = true;
        this.$nextTick(_ => {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },

      handleInputConfirm() {
        let inputValue = this.inputValue;
        if (inputValue) {
          this.tags.push(inputValue);
        }
        this.inputVisible = false;
        this.inputValue = '';
      },
      goback(){
        this.$router.push({path: this.fromRoute.path});
      },
      commitPost(){
        if(this.post.title===''||this.post.description===''||this.post.content===''){
          this.$message({
            message: '请填写完整信息，标题、描述和帖子具体内容都不能为空',
            type: 'warning'
          });
          return;
        }else{
          this.$store.state.commonsModule.RequestBody.ip=localStorage.getItem("localIp");
          this.post.author=JSON.parse(localStorage.getItem("user")).userId;
          this.post.tags=this.tags.toString();
          this.$store.state.commonsModule.RequestBody.data=JSON.stringify(this.post);
          request.post('/ForumWrite/createPost',this.$store.state.commonsModule.RequestBody,{withCredentials:true}).then(res=>{
            if(res.data.code===200){
              this.$message({
                message: '帖子创建成功',
                type: 'success'
              });
              this.$router.push({path: this.fromRoute.path});
            }else{
              this.$message({
                message: '帖子创建失败',
                type: 'error'
              });
            }
          }).catch(err=>{
            console.log(err);
          })
        }
      }
    }
  }
</script>

  <style scoped>
   #content{
     position: absolute;
     margin-left: 17%;
  }

   #p1{
    margin-top: 5%;
    margin-left: 45%;
    font-size: 45px;
   }
   .front_label {
     margin-bottom: 10px;
     font-size: 20px
   }
    #title{
      margin-top: 30px;
      margin-left: 100px;
      width: 400px;
    }
    #description{
      margin-left: 100px;
      margin-top: 45px;
      width: 700px;
    }
    #tags{
      margin-left: 100px;
      margin-top: 45px;
    }
   .el-tag + .el-tag {
     margin-left: 10px;
   }
   .button-new-tag {
     margin-left: 10px;
     height: 32px;
     line-height: 30px;
     padding-top: 0;
     padding-bottom: 0;
   }
   .input-new-tag {
     width: 90px;
     margin-left: 10px;
     vertical-align: bottom;
   }
   #post_content{
      margin-top: 45px;
      margin-left: 100px;
      width: 700px;
   }
   #buttons{
     margin-left: 350px;
     margin-top: 50px;
   }
</style>
