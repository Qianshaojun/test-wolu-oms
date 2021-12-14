import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'pricelist'

/**
 * API接口配置
 * 订单服务配置
 */
export const PricelistController: ControllerConfig = {
    // 获取国家列表
    getList: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    }
}
