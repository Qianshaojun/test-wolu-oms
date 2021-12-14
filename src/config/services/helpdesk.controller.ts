import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'helpdesk'

/**
 * API接口配置
 * 库存服务配置
 */
export const HelpdeskController: ControllerConfig = {
    //
    query_all_ticket: {
        controller,
        action: 'query_all_ticket',
        type: RequestMethod.Post
    },
    //
    query_ticket: {
        controller,
        action: 'query_ticket  ',
        type: RequestMethod.Post
    },
    //
    query_helpdesk_ticket_body: {
        controller,
        action: 'query_helpdesk_ticket_body',
        type: RequestMethod.Post
    },
    set_picking_cancelled_confirm: {
        controller,
        action: 'set_picking_cancelled_confirm',
        type: RequestMethod.Post
    },
    assign_ticket_user: {
        controller,
        action: 'assign_ticket_user',
        type: RequestMethod.Post
    },
    cancel_ticket_user: {
        controller,
        action: 'cancel_ticket_user',
        type: RequestMethod.Post
    },
    query_ticket_reply_content: {
        controller,
        action: 'query_ticket_reply_content',
        type: RequestMethod.Post
    },
    query_ticket_changed_log: {
        controller,
        action: 'query_ticket_changed_log',
        type: RequestMethod.Post
    },
    query_all_email_group: {
        controller,
        action: 'query_all_email_group',
        type: RequestMethod.Post
    },
    save_email_group: {
        controller,
        action: 'save_email_group',
        type: RequestMethod.Post
    },
    cancel_email_group_status: {
        controller,
        action: 'cancel_email_group_status',
        type: RequestMethod.Post
    },
    active_email_group_status: {
        controller,
        action: 'active_email_group_status',
        type: RequestMethod.Post
    },
    save_user_allot_ratio: {
        controller,
        action: 'save_user_allot_ratio',
        type: RequestMethod.Post
    },
    active_user_allot_ratio: {
        controller,
        action: 'active_user_allot_ratio',
        type: RequestMethod.Post
    },
    cancel_user_allot_ratio: {
        controller,
        action: 'cancel_user_allot_ratio',
        type: RequestMethod.Post
    },
    query_all_allot_user: {
        controller,
        action: 'query_all_allot_user',
        type: RequestMethod.Post
    },
    change_allot_user: {
        controller,
        action: 'change_allot_user',
        type: RequestMethod.Post
    },
    query_user_allot_ratio: {
        controller,
        action: 'query_user_allot_ratio',
        type: RequestMethod.Post
    },
    auto_allot_email: {
        controller,
        action: 'auto_allot_email',
        type: RequestMethod.Post
    },
    // 设置自动回复时间
    set_up_send_mail_time: {
        controller,
        action: 'set_up_send_mail_time',
        type: RequestMethod.Post
    },
    query_all_send_email_time: {
        controller,
        action: 'query_all_send_email_time',
        type: RequestMethod.Post
    },
    // 设置自动回复时间
    set_up_send_mail_time_customer: {
        controller,
        action: 'set_up_send_mail_time_customer',
        type: RequestMethod.Post
    },
    query_send_customer_email_time: {
        controller,
        action: 'query_send_customer_email_time',
        type: RequestMethod.Post
    }
}
