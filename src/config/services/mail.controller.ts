import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'email'

/**
 * API接口配置
 * 订单服务配置
 */
export const MailController: ControllerConfig = {
    // 获取国家列表
    create_email: {
        controller,
        action: 'create_email',
        type: RequestMethod.Post
    },
    query_email_template: {
        controller,
        action: 'query_email_template',
        type: RequestMethod.Post
    },
    render_email_template: {
        controller,
        action: 'render_email_template',
        type: RequestMethod.Post
    },
    query_all_illegal_words: {
        controller,
        action: 'query_all_illegal_words',
        type: RequestMethod.Post
    },
    batch_delete_illegal_words: {
        controller,
        action: 'batch_delete_illegal_words',
        type: RequestMethod.Post
    },
    save_illegal_words: {
        controller,
        action: 'save_illegal_words',
        type: RequestMethod.Post
    },
    query_ticket_seller_name: {
        controller,
        action: 'query_ticket_seller_name',
        type: RequestMethod.Post
    },
    query_ticket_site_id_by_ticket_seller_name: {
        controller,
        action: 'query_ticket_site_id_by_ticket_seller_name',
        type: RequestMethod.Post
    },
    query_ticket_type: {
        controller,
        action: 'query_ticket_type',
        type: RequestMethod.Post
    }
}
