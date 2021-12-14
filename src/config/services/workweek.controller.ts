import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'work_week'

/**
 * API接口配置
 * 订单服务配置
 */
export const WorkweekController: ControllerConfig = {
    // 获取列表
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 创建周报
    save_week: {
        controller,
        action: 'save_week',
        type: RequestMethod.Post
    },
    // 查询周报详情
    query_week_detail: {
        controller,
        action: 'query_week_detail',
        type: RequestMethod.Post
    },
    // create_message
    create_message: {
        controller,
        action: 'create_message',
        type: RequestMethod.Post
    },
    // delete_message
    delete_message: {
        controller,
        action: 'delete_message',
        type: RequestMethod.Post
    }
}
