import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'product_pre_sale'

/**
 * API接口配置
 * 订单服务配置
 */
export const PreSaleController: ControllerConfig = {
    // 获取预售数据
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    re_calculate_purchase_predict: {
        controller,
        action: 're_calculate_purchase_predict',
        type: RequestMethod.Post
    },
    query_sku_week_sales: {
        controller,
        action: 'query_sku_week_sales',
        type: RequestMethod.Post
    },
    active_purchase_predict: {
        controller,
        action: 'active_purchase_predict',
        type: RequestMethod.Post
    },
    confirm_purchase_predict: {
        controller,
        action: 'confirm_purchase_predict',
        type: RequestMethod.Post
    },
    approve_purchase_predict: {
        controller,
        action: 'approve_purchase_predict',
        type: RequestMethod.Post
    },
    renew_purchase_predict: {
        controller,
        action: 'renew_purchase_predict',
        type: RequestMethod.Post
    },
    return_purchase_predict: {
        controller,
        action: 'return_purchase_predict',
        type: RequestMethod.Post
    }
}
