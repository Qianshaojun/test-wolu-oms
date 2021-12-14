import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'company'

/**
 * API接口配置
 * 订单服务配置
 */
export const CompanyController: ControllerConfig = {
    // 获取公司列表
    query_list: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    }
}
