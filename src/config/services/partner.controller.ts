import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'partner'

/**
 * API接口配置
 * 订单服务配置
 */
export const PartnerController: ControllerConfig = {
    // 获取国家列表
    query_customer_contact: {
        controller,
        action: 'query_customer_contact',
        type: RequestMethod.Post
    }
}
