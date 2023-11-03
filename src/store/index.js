import {createStore} from 'vuex'

export default createStore({
    state: {
        auto: localStorage.getItem('auto') === 'true',
        user: JSON.parse(localStorage.getItem('user')),
        searchKeyWord: '',
        cancelToken: [],
    },
    mutations: {
        setUser(state, user) {
            state.user = user;
            localStorage.setItem('user', JSON.stringify(user));
        },
        setAuto(state, auto) {
            state.auto = auto;
            localStorage.setItem('auto', auto);
        },
        logout(state) {
            state.user = null;
            state.auto = false;
            localStorage.setItem('auto', 'false');
            localStorage.removeItem('user');
        },
        setSearchKeyWord(state, searchKeyWord) {
            state.searchKeyWord = searchKeyWord;
        },
        pushToken(state, token) {
            state.cancelToken.push(token);
        },
        clearToken(state) {
            state.cancelToken.forEach((item) => {
                item();
            });
            state.cancelToken = [];
        },
    },
    actions: {
        setUser(context, user) {
            context.commit('setUser', user)
        },
        setAuto(context, auto) {
            context.commit('setAuto', auto)
        },
        logout(context) {
            context.commit('setUser', null);
            context.commit('setAuto', false);
            this.$cookies.remove('token');
        },
        setSearchKeyWord(context, searchKeyWord) {
            context.commit('setSearchKeyWord', searchKeyWord)
        },
        pushToken(context, token) {
            context.commit('pushToken', token)
        },
        clearToken(context) {
            context.commit('clearToken')
        }
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getAuto(state) {
            return state.auto
        },
        getSearchKeyWord(state) {
            return state.searchKeyWord
        }
    }
})

