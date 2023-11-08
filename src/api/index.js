import axios from 'axios';
import store from '../store';
// import {setupCache} from 'axios-cache-adapter';
//
// // axios缓存配置
// const cache = setupCache({
//     // 30秒缓存
//     maxAge: 30 * 1000,
//     store: {
//         getItem: key => {
//             const item = localStorage.getItem(key);
//             return item ? JSON.parse(item) : null;
//         },
//         setItem: (key, value) => {
//             localStorage.setItem(key, JSON.stringify(value));
//         },
//         removeItem: key => {
//             localStorage.removeItem(key);
//         },
//         clear: () => {
//             localStorage.clear();
//         }
//     },
//     // 只缓存get和post请求
//     exclude: {
//         methods: ['put', 'patch', 'delete']
//     }
// });

const request = axios.create({
    // adapter: cache.adapter,
    timeout: 4000,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=utf-8',
        // 'Cache-Control': 'max-age=30',
    },
    retry: 3, // 最大重试次数
    retryDelay: 1000, // 重试延迟时间（毫秒）
})

// 添加一个响应拦截器，用于处理请求失败时的重试
request.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config;

    // 如果配置不存在或者retry选项未设置，拒绝promise
    if (!config || !config.retry) {
        return Promise.reject(err);
    }

    // 设置重试次数，默认为3
    config.__retryCount = config.__retryCount || 0;

    // 检查是否达到了最大重试次数
    if (config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }

    // 增加重试次数
    config.__retryCount += 1;

    // 创建一个新的Promise，以延迟重试
    let backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // 返回一个延迟后重试请求
    return backoff.then(function () {
        return request(config);
    });
});

// 非资源型请求不必取消（因为token无法登录bug作此处理）
// 原因：topbar发送token请求时路由路径尚为'/'，导致后续变为相应路径时触发取消操作
request.interceptors.request.use(config => {
    //发起请求时保存页面所有请求
    config.cancelToken = new axios.CancelToken(cancel => {
        store.commit('pushToken', cancel);
    });
    return config
});

const fileRequest = axios.create({
    timeout: 8000,
    withCredentials: true,
    headers: {'Content-Type': 'application/json;charset=utf-8'},
    retry: 3, // 最大重试次数
    retryDelay: 1000, // 重试延迟时间（毫秒）
})

fileRequest.interceptors.request.use(config => {
    //发起请求时保存页面所有请求
    config.cancelToken = new axios.CancelToken(cancel => {
        store.commit('pushToken', cancel);
    });
    return config
});

// 响应拦截器中设置缓存并配置超时重试
fileRequest.interceptors.response.use(undefined, function axiosRetryInterceptor(err) {
    let config = err.config;

    // 如果配置不存在或者retry选项未设置，拒绝promise
    if (!config || !config.retry) {
        return Promise.reject(err);
    }

    // 设置重试次数，默认为3
    config.__retryCount = config.__retryCount || 0;

    // 检查是否达到了最大重试次数
    if (config.__retryCount >= config.retry) {
        return Promise.reject(err);
    }

    // 增加重试次数
    config.__retryCount += 1;

    // 创建一个新的Promise，以延迟重试
    let backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // 返回一个延迟后重试请求
    return backoff.then(function () {
        return request(config);
    });
});

export default request
export {fileRequest}
