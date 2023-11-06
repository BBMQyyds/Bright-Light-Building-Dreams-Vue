<template>
  <div class="home-bg">
    <div class="home">
      <TopBar/>
      <div class="content">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component" v-if="$route.meta.keepAlive" :key="$route.path"/>
          </keep-alive>
          <component :is="Component" v-if="!$route.meta.keepAlive" :key="$route.path"/>
        </router-view>
      </div>
      <BottomBar/>
    </div>
  </div>
</template>

<script>
import TopBar from "@/components/bar/TopBar.vue";

export default {
  name: "home",
  components: {
    TopBar,
  },
  data() {
    return {
      // includeList: ["LibraryPage", "ShelfPage", "RankPage", "SearchPage", "MainPage"],
      // includeList: [],
    };
  },
};
</script>

<style scoped>

.messageIndex {
  z-index: 20000 !important;
}

.home-bg {
  background: #EEEEEE;
  background-size: cover;
  height: 100%;
  width: 100%;
}

.home {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  background: rgba(255, 255, 255, 0.65);
}

.home {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  margin-top: 57px;
}

</style>
