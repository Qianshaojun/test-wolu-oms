import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'case_management'

/**
 * API接口配置
 */
export const CaseController: ControllerConfig = {
    // 获取所有日程
    query_all: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 获取所有日程
    query_all_calendar: {
        controller,
        action: 'query_all_calendar',
        type: RequestMethod.Post
    },
    // 保存日程
    save_case: {
        controller,
        action: 'save_case',
        type: RequestMethod.Post
    },
    // 查询日程详情
    query_case_detail: {
        controller,
        action: 'query_case_detail',
        type: RequestMethod.Post
    },
    // 创建消息
    create_message: {
        controller,
        action: 'create_message',
        type: RequestMethod.Post
    },
    // 删除消息
    delete_message: {
        controller,
        action: 'delete_message',
        type: RequestMethod.Post
    },
    // 状态字典
    query_case_type: {
        controller,
        action: 'query_case_type',
        type: RequestMethod.Post
    },
    // 删除日程
    delete_case: {
        controller,
        action: 'delete_case',
        type: RequestMethod.Post
    },
    // 修改状态
    change_case_state: {
        controller,
        action: 'change_case_state',
        type: RequestMethod.Post
    },
    // 返回可选择的父日程列表
    get_parent_case_ids: {
        controller,
        action: 'get_parent_case_ids',
        type: RequestMethod.Post
    }
}
