import {ElMessage} from 'element-plus' //引入message弹出框

let messageDom = null
const resetMessage = (options) => {
    if (messageDom) messageDom.close() // 判断弹窗是否已存在,若存在则关闭
    messageDom = ElMessage({
        ...options,
        offset: 75,
        duration: 500,
    })
    return messageDom
}
const typeArr = ['success', 'error', 'warning', 'info']
typeArr.forEach(type => {
    resetMessage[type] = options => {
        if (typeof options === 'string') {
            options = {
                message: options,
                offset: 75,
                duration: 500,
            }
        }
        options.type = type
        return resetMessage(options)
    }
})
export const message = resetMessage
 