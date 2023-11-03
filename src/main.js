import {createApp} from 'vue';
import App from './App.vue';
import router from '@/router';
import ElementPlus from 'element-plus';
import VueCookies from 'vue-cookies';
import 'element-plus/dist/index.css';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/style/common.css';
import VueWechatTitle from 'vue-wechat-title';
import store from "@/store";
import AES from './utils/AES';
import {message} from './utils/resetMessage';
import resource from "@/utils/resource";
import utils from "@/utils/utils";
import 'highlight.js/styles/androidstudio.css';
import 'highlight.js/lib/common';
import hljsVuePlugin from '@highlightjs/vue-plugin';


let app = createApp(App);

const debounce = (fn, delay) => {
    let timer = null;
    return function () {
        let context = this;
        let args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
};

const _ResizeObserver = window.ResizeObserver;
window.ResizeObserver = class ResizeObserver extends _ResizeObserver {
    constructor(callback) {
        callback = debounce(callback, 16);
        super(callback);
    }
};

app.config.globalProperties.$aes = AES;
app.config.globalProperties.$msg = message;
app.config.globalProperties.$resource = resource;
app.config.globalProperties.$utils = utils;

app.use(hljsVuePlugin).use(store).use(router).use(ElementPlus).use(VueCookies).use(VueWechatTitle).mount('#app');

export default app;