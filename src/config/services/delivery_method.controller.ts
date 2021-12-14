import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'delivery_method'

/**
 * API接口配置
 * 订单服务配置
 */
export const DeliveryMethodController: ControllerConfig = {
    // 获取国家列表
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    }
}
