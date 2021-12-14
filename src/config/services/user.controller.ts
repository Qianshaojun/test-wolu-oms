import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'user'

/**
 * API接口配置
 * 客户服务配置
 */
export const UserController: ControllerConfig = {
    // 查询系统用户
    all: {
        controller,
        action: 'all',
        type: RequestMethod.Post
    },
    // 查询销售代表
    availableSales: {
        controller,
        action: 'sales_user',
        type: RequestMethod.Post
    },
    // 查询客服代表
    customerServiceUser: {
        controller,
        action: 'customer_service_user',
        type: RequestMethod.Post
    },
    // 查询配货员
    pack_man: {
        controller,
        action: 'pack_man',
        type: RequestMethod.Post
    },
    // 仓库人员查询
    warehouse_user: {
        controller,
        action: 'warehouse_user',
        type: RequestMethod.Post
    }
}
