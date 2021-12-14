import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'product_purchase_predict'

/**
 * API接口配置
 * 订单服务配置
 */
export const PurchaseCalController: ControllerConfig = {
    // 获取所有产品采购预算
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 获取单个产品采购预算
    query_detail: {
        controller,
        action: 'query_detail',
        type: RequestMethod.Post
    },
    sales_history: {
        controller,
        action: 'query_half_year_sales_history',
        type: RequestMethod.Post
    },
    getLogs: {
        controller,
        action: 'getLogs',
        type: RequestMethod.Post
    }
}
