import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'report_sku'

/**
 * API接口配置
 * 订单服务配置
 */
export const SkuSaleController: ControllerConfig = {
    // 获取额度申请列表
    query_sum_all: {
        controller,
        action: 'query_sum_all',
        type: RequestMethod.Post
    },
    query_by_time: {
        controller,
        action: 'query_sales_history_by_time',
        type: RequestMethod.Post
    }
}
