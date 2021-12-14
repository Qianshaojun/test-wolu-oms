import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'helpdesk_ticket'

/**
 * API接口配置
 * 客户服务配置
 */
export const TicketController: ControllerConfig = {
    // 查询系统所有收件箱
    query_fetch_email_server: {
        controller,
        action: 'query_fetch_email_server',
        type: RequestMethod.Post
    }
}
