import {fileRequest} from "@/api";
import aes from './AES';

export default {
    // 判断图片是否加载完成
    isLoaded(src) {
        if (src === null || src === undefined) {
            return false;
        }
        let img = new Image();
        img.src = src;
        return img.complete;
    },
    getAvatar(item) {
        fileRequest.post('/download', JSON.stringify({
            apiType: aes.encrypt('downloadUserAvatar'),
            data: aes.encrypt(item.avatar),
        }), {
            responseType: 'arraybuffer', // 指定响应类型为字节数组
        }).then(response => {
            // 将字节数组转换为Blob对象
            const blob = new Blob([response.data], {type: 'application/octet-stream'});
            // 将Blob对象转换为DataURL
            // 在界面中显示图像
            item.img = URL.createObjectURL(blob);
        }).catch((err => {
            console.log(err);
        }));
    },

    getInterface(item) {
        fileRequest.post('/download', JSON.stringify({
            apiType: aes.encrypt('downloadTaleInterface'),
            data: aes.encrypt(item.face),
        }), {
            responseType: 'arraybuffer', // 指定响应类型为字节数组
        }).then(response => {
            // 将字节数组转换为Blob对象
            const blob = new Blob([response.data], {type: 'application/octet-stream'});
            // 将Blob对象转换为DataURL
            // 在界面中显示图像
            item.img = URL.createObjectURL(blob);
        }).catch((err => {
            console.log(err);
        }));
    },
}