import CryptoJS from "crypto-js";

const KEY = CryptoJS.enc.Utf8.parse('1234567890abcdef');
const IV = CryptoJS.enc.Utf8.parse('1234567890abcdef');

export default {
    encrypt(word, keyStr, ivStr) {
        let key = KEY;
        let iv = IV;

        if (keyStr) {
            key = CryptoJS.enc.Utf8.parse(keyStr);
            iv = CryptoJS.enc.Utf8.parse(ivStr);
        }

        let srcs = CryptoJS.enc.Utf8.parse(word);
        let encrypted = CryptoJS.AES.encrypt(srcs, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        return CryptoJS.enc.Base64.stringify(encrypted.ciphertext);
    },

    decrypt(word, keyStr, ivStr) {
        let key = KEY;
        let iv = IV;

        if (keyStr) {
            key = CryptoJS.enc.Utf8.parse(keyStr);
            iv = CryptoJS.enc.Utf8.parse(ivStr);
        }

        let base64 = CryptoJS.enc.Base64.parse(word);
        let src = CryptoJS.enc.Base64.stringify(base64);

        let decrypt = CryptoJS.AES.decrypt(src, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
        });

        let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
        return decryptedStr.toString();
    }
};
