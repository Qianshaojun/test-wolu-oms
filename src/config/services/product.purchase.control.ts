import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'product_purchase'

/**
 * API接口配置
 * 产品采购服务配置
 */
export const ProductPurchaseController: ControllerConfig = {
    // 所有排单计划查询
    query_all_requirement_schedule: {
        controller,
        action: 'query_all_requirement_schedule',
        type: RequestMethod.Post
    },
    // 确认排单计划
    confirm_requirement_schedule: {
        controller,
        action: 'confirm_requirement_schedule',
        type: RequestMethod.Post
    },
    // 取消排单计划
    cancel_requirement_schedule: {
        controller,
        action: 'cancel_requirement_schedule',
        type: RequestMethod.Post
    },
    // 修改排单计划数量
    change_requirement_schedule_qty: {
        controller,
        action: 'change_requirement_schedule_qty',
        type: RequestMethod.Post
    },
    // 计算环比
    calculate_category_increase_ratio: {
        controller,
        action: 'calculate_category_increase_ratio',
        type: RequestMethod.Post
    },
    // 查询货柜
    queryRequirementPackage: {
        controller,
        action: 'query_requirement_package',
        type: RequestMethod.Post
    }
}
