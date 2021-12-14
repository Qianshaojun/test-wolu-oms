import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'system_api'

/**
 * API接口配置
 * 订单服务配置
 */
export const PublicController: ControllerConfig = {
    queryPagination: {
        controller,
        action: 'query_pagination',
        type: RequestMethod.Post
    },
    query: {
        controller,
        action: 'query',
        type: RequestMethod.Post
    },
    modify: {
        controller,
        action: 'modify',
        type: RequestMethod.Post
    },
    queryExportPagination: {
        controller,
        action: 'query_export',
        type: RequestMethod.Post
    }
}
