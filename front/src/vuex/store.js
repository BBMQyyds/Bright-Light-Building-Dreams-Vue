import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate';
Vue.use(Vuex)

export default new Vuex.Store({
  plugins: [createPersistedState({
    key: 'vuex',
    paths: ['commonsModule']
  })
  ],
  //数据，相当于data
  state: {},
  getters: {},
  //里面定义方法，操作state方发
  mutations: {},
  // 操作异步操作mutation
  actions: {},
  modules: {


    commonsModule: {
      namespaced: true, // 启用命名空间
      state: {
        User: {
          username: '',
          birthday: '',
        },
        RequestBody: {
          ip: '',
          data: '',
          identity: '',
          extra: '',
        },
      },
      getters: {
        // 可以在这里定义 getters
      },
      mutations: {
        // 可以在这里定义 mutations
      },
      actions: {
        // 可以在这里定义 actions
      },
    }


  }
})
