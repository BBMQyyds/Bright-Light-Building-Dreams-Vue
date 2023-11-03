export default {
    numfix(num) {
        return num / 100000000 > 1 ? (num / 100000000).toFixed(1) + '亿'
            : num / 10000 > 1 ? (num / 10000).toFixed(1) + '万' : num;
    },
    getFormatTime(timeStamp) {
        const dateTime = new Date(timeStamp);
        const no1new = dateTime.valueOf();
        const year = dateTime.getFullYear();
        const month = dateTime.getMonth() + 1;
        const day = dateTime.getDate();
        // const hour = dateTime.getHours();
        // const minute = dateTime.getMinutes();
        // const second = dateTime.getSeconds();
        const now = new Date();
        const now_new = now.valueOf();
        let milliseconds = 0;
        let timeSpanStr = '';

        milliseconds = now_new - no1new;

        if (milliseconds <= 1000 * 60) {
            timeSpanStr = '刚刚';
        } else if (1000 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60) {
            timeSpanStr = Math.round((milliseconds / (1000 * 60))) + '分钟前';
        } else if (1000 * 60 * 60 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60)) + '小时前';
        } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 15) {
            timeSpanStr = Math.round(milliseconds / (1000 * 60 * 60 * 24)) + '天前';
        } else if (milliseconds > 1000 * 60 * 60 * 24 * 15 && year === now.getFullYear()) {
            // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            timeSpanStr = year + '-' + month + '-' + day
        } else {
            // timeSpanStr = year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
            timeSpanStr = year + '-' + month + '-' + day
        }
        return timeSpanStr;
    },
    getTimeRange(timeStamp) {
        const dateTime = new Date(timeStamp);
        const no1new = dateTime.valueOf();
        const now = new Date();
        const now_new = now.valueOf();
        let milliseconds = 0;
        let timeSpanStr = '';

        milliseconds = now_new - no1new;
        //分为今天、昨天、前天、近一周、近一月、近一年、一年前
        if (milliseconds <= 1000 * 60 * 60 * 24) {
            timeSpanStr = '今 天';
        } else if (1000 * 60 * 60 * 24 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 2) {
            timeSpanStr = '昨 天';
        } else if (1000 * 60 * 60 * 24 * 2 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 3) {
            timeSpanStr = '前 天';
        } else if (1000 * 60 * 60 * 24 * 3 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 7) {
            timeSpanStr = '近 一 周';
        } else if (1000 * 60 * 60 * 24 * 7 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 30) {
            timeSpanStr = '近 一 月';
        } else if (1000 * 60 * 60 * 24 * 30 < milliseconds && milliseconds <= 1000 * 60 * 60 * 24 * 365) {
            timeSpanStr = '近 一 年';
        } else {
            timeSpanStr = '一 年 前';
        }
        return timeSpanStr;
    },
    checkEmail(email) {
        const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
        return reg.test(email)
    },
    checkPhone(phone) {
        const reg = /^1[3456789]\d{9}$/
        return reg.test(phone)
    },
    checkQQ(qq) {
        const reg = /^[1-9][0-9]{4,10}$/
        return reg.test(qq)
    },
    checkWechat(wechat) {
        const reg = /^[a-zA-Z]([-_a-zA-Z0-9]{5,19})+$/
        return reg.test(wechat)
    },
    //共9级
    level(exp) {
        if (exp < 100) {
            return 1
        } else if (exp < 200) {
            return 2
        } else if (exp < 500) {
            return 3
        } else if (exp < 1000) {
            return 4
        } else if (exp < 2000) {
            return 5
        } else if (exp < 5000) {
            return 6
        } else if (exp < 10000) {
            return 7
        } else if (exp < 20000) {
            return 8
        } else {
            return 9
        }
    },
    nextLevel(exp) {
        if (exp < 100) {
            return 100
        } else if (exp < 200) {
            return 200
        } else if (exp < 500) {
            return 500
        } else if (exp < 1000) {
            return 1000
        } else if (exp < 2000) {
            return 2000
        } else if (exp < 5000) {
            return 5000
        } else if (exp < 10000) {
            return 10000
        } else if (exp < 20000) {
            return 20000
        } else {
            return 0
        }
    },
}