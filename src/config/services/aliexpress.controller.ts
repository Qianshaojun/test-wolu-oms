import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'aliexpress'

/**
 * API接口配置
 * 服务配置
 */
export const AliexpressController: ControllerConfig = {
    // 手动导入速卖通订单
    importOrders: {
        controller,
        action: 'manually_import_orders',
        type: RequestMethod.Post
    },
    // 速卖通结单
    fulfilOrders: {
        controller,
        action: 'order_fulfil',
        type: RequestMethod.Post
    },
    // 库存管理
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // listing_save
    listing_save: {
        controller,
        action: 'listing_save',
        type: RequestMethod.Post
    },
    // mergeUser
    mergeUser: {
        controller,
        action: 'listing_merge_user',
        type: RequestMethod.Post
    },
    // mergeAuto
    mergeAuto: {
        controller,
        action: 'listing_merge_auto',
        type: RequestMethod.Post
    },
    // cancelAuto
    cancelAuto: {
        controller,
        action: 'listing_cancel_auto',
        type: RequestMethod.Post
    }
}
