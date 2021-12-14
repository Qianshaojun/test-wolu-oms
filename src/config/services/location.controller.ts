import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'stock_location'

/**
 * API接口配置
 * 订单服务配置
 */
export const LocationController: ControllerConfig = {
    // 获取库位列表
    query_stock_location: {
        controller,
        action: 'query_stock_location',
        type: RequestMethod.Post
    }
}
