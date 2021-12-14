import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'operate_log'

/**
 * API接口配置
 * 订单服务配置
 */
export const OperateLogController: ControllerConfig = {
    // 查看批次库存操作日志
    view_user_operate_changed_log: {
        controller,
        action: 'view_user_operate_changed_log',
        type: RequestMethod.Post
    }
}
