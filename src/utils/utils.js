export default {
    formatDateToYYMMDDHHMMSS(date) {
        const year = date.getFullYear().toString().slice(-4); // 获取年份的最后两位
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份并补零
        const day = ('0' + date.getDate()).slice(-2); // 获取日期并补零
        const hours = ('0' + date.getHours()).slice(-2); // 获取小时并补零
        const minutes = ('0' + date.getMinutes()).slice(-2); // 获取分钟并补零
        const seconds = ('0' + date.getSeconds()).slice(-2); // 获取秒数并补零

        return year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;
    }
}