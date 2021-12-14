import { RequestService } from '~/core/http'
import appConfig from '~/config/app.config'
import store from '~/store'
import { TokenService } from '../services/token.service'
// import { TokenService } from '~/extension/services/token.service'
import { message } from 'ant-design-vue'
import { LoadingService } from '../services/loading.service'
import router from '../../router'
export default function() {
    // 配置服务端信息
    RequestService.setConfig({
        server: appConfig.server,
        timeout: appConfig.timeout
    })

    // 添加状态拦截器
    RequestService.interceptors.status.use(respone => {
        const result = respone.data.result
        return result.code === 0
    })

    // 添加成功拦截器
    RequestService.interceptors.success.use(respone => {
        const result = respone.data.result

        if (result.length !== undefined) {
            return result.results
        } else {
            return result
        }
    })

    // 添加失败拦截器
    RequestService.interceptors.error.use(respone => {
        LoadingService.clearTimer()
        if (typeof respone.data.result.message === 'object') {
            let msg = JSON.stringify(respone.data.result.message)
                .replace('{', '')
                .replace('}', '')
            respone.data.result.message = msg
        }
        // if (respone.data.result.message == 'Odoo Session Expired') {
        //     setTimeout(function() {
        //         router.push({ name: 'login' })
        //     }, 1000)
        // }
        return respone.data.result
    })

    // 网络异常处理
    RequestService.requestCatchHandle = respone => {
        LoadingService.clearTimer()
        const defaultError = 'Connect Server Failed, Please try again!'
        const messages = {
            400: '请求参数错误',
            405: '请求服务方法错误',
            500: '服务器内部错误',
            403: '没有权限，请重新登陆'
        }
        if (respone) {
            const errMsg = (respone.data || {}).message
            if (respone.status === 403) {
                setTimeout(() => {
                    store.dispatch('clearUserLoginData').catch()
                }, 2000)
            }
            if (
                respone.data &&
                respone.data.error &&
                respone.data.error.message === 'Odoo Session Expired'
            ) {
                message.error('登录Session过期，请重新登录')
                // setTimeout(function() {
                //     router.push({ name: 'login' })
                // }, 1000)
            } else {
                message.error(
                    errMsg || messages[respone.status] || defaultError
                )
            }
        } else {
            // message.error(defaultError)
            // setTimeout(function() {
            //     router.push({ name: 'login' })
            // }, 1000)
        }
    }

    // 安装全局服务扩展
    RequestService.installExtendService(new TokenService())
}
