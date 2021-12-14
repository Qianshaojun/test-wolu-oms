import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'product_sale_trend'

/**
 * API接口配置
 * 订单服务配置
 */
export const SaleTrendController: ControllerConfig = {
    // 获取额度申请列表
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // approve: {
    //     controller,
    //     action: 'approve',
    //     type: RequestMethod.Post
    // },
    // delete: {
    //     controller,
    //     action: 'delete',
    //     type: RequestMethod.Post
    // },
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    }
}
