import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 国家分区控制器名称
const controller = 'release_pre_sale'

/**
 * API接口配置
 * 订单服务配置
 */
export const ReleasePreSaleController: ControllerConfig = {
    // 获取所有预售订单
    queryAll: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 查询具体产品
    queryProduct: {
        controller,
        action: 'query_product',
        type: RequestMethod.Post
    },
    // 取消
    cancel: {
        controller,
        action: 'cancel',
        type: RequestMethod.Post
    },
    // 完成
    done: {
        controller,
        action: 'done',
        type: RequestMethod.Post
    },
    // query_one
    query_one: {
        controller,
        action: 'query_one',
        type: RequestMethod.Post
    }
}
