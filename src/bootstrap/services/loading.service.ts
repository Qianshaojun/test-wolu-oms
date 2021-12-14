import { ExtendService, RequestParams } from '~/core/http'
import { AutoWired } from 'typescript-ioc'
import appConfig from '@/config/app.config'
import { Observable, Subscriber } from 'rxjs'

@AutoWired
export class LoadingService extends ExtendService {
    public static status: Observable<{
        state: boolean
        mask: boolean
    }>

    private showMaskTime = 1000 * 3

    public static netTimeout
    public static maskTimeout

    public static subscriber: Subscriber<any>

    constructor() {
        super()
        LoadingService.status = new Observable(
            subscriber => (LoadingService.subscriber = subscriber)
        )
    }

    public static get loadingStatus() {
        if (!LoadingService.status) {
            LoadingService.status = new Observable(
                subscriber => (LoadingService.subscriber = subscriber)
            )
        }

        return LoadingService.status
    }

    /**
     * 请求前置操作
     */
    public before = () => {
        LoadingService.subscriber.next({
            state: true,
            mask: false
        })

        // 清除超时操作
        if (LoadingService.netTimeout || LoadingService.maskTimeout) {
            clearTimeout(LoadingService.netTimeout)
            clearTimeout(LoadingService.maskTimeout)
        }

        // 超时遮罩控制
        LoadingService.maskTimeout = setTimeout(() => {
            LoadingService.subscriber.next({
                state: true,
                mask: true
            })
        }, this.showMaskTime)

        // 超时重置状态
        LoadingService.netTimeout = setTimeout(() => {
            LoadingService.subscriber.next({
                state: false,
                mask: false
            })
        }, appConfig.timeout)
    }

    public static clearTimer() {
        LoadingService.subscriber.next({
            state: false, // 显示loading控制
            mask: false // 显示遮罩控制
        })

        if (LoadingService.netTimeout || LoadingService.maskTimeout) {
            clearTimeout(LoadingService.netTimeout)
            clearTimeout(LoadingService.maskTimeout)
        }
    }

    /**
     * 请求后置操作
     */
    public after = () => {
        LoadingService.subscriber.next({
            state: false, // 显示loading控制
            mask: false // 显示遮罩控制
        })

        if (LoadingService.netTimeout || LoadingService.maskTimeout) {
            clearTimeout(LoadingService.netTimeout)
            clearTimeout(LoadingService.maskTimeout)
        }
    }
}
