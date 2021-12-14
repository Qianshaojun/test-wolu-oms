import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'report'

/**
 * API接口配置
 * 订单服务配置
 */
export const ReportController: ControllerConfig = {
    // 获取额度申请列表
    query_order_date_list: {
        controller,
        action: 'query_order_date_list',
        type: RequestMethod.Post
    },
    query_country_list: {
        controller,
        action: 'query_country_list',
        type: RequestMethod.Post
    },
    query_category_list: {
        controller,
        action: 'query_category_list',
        type: RequestMethod.Post
    },
    query_sub_category_list: {
        controller,
        action: 'query_sub_category_list',
        type: RequestMethod.Post
    },
    query_category_dict: {
        controller,
        action: 'query_category_dict',
        type: RequestMethod.Post
    },
    query_category_profit_data: {
        controller,
        action: 'query_category_profit_data',
        type: RequestMethod.Post
    },
    query_sku_profit_data: {
        controller,
        action: 'query_sku_profit_data',
        type: RequestMethod.Post
    },
    query_all_profit_data: {
        controller,
        action: 'query_all_profit_data',
        type: RequestMethod.Post
    }
}
