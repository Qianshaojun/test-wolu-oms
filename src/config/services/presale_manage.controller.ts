import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'pre_sale_management'

/**
 * API接口配置
 * 订单服务配置
 */
export const PresaleManageController: ControllerConfig = {
    // 保存编辑
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    // 生成释放报告
    release: {
        controller,
        action: 'release',
        type: RequestMethod.Post
    },
    //  获取货柜及产品信息
    getInfo: {
        controller,
        action: 'get_info',
        type: RequestMethod.Post
    },
    //  获取货柜及产品信息
    queryAll: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    }
}
