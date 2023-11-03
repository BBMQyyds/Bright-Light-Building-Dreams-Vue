<template>
  <div class="personal">
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
</template>

<script>
import BottomBar from "@/components/bar/BottomBar.vue";

export default {
  name: "personal",
  components: {
    BottomBar,
  },
  data() {
    return {
      // includeList: ["CenterPage", "MomentPage", "InfoPage", "MessagePage", "HistoryPage", "StudyPage"],
      // includeList: [],
    };
  },
};
</script>

<style scoped>
.messageIndex {
  z-index: 20000 !important;
}

.personal {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.content {
  flex: 1;
  margin-top: 57px;
}
</style>
