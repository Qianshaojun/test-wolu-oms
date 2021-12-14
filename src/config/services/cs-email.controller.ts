import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'amazon_email'

/**
 * API接口配置
 * 邮件回复配置
 */
export const EmailController: ControllerConfig = {
    // 邮件客户查询
    get_userlist: {
        controller,
        action: 'get_user_list',
        type: RequestMethod.Post
    },
    setNoNeedReplyDone: {
        controller,
        action: 'set_no_need_reply_done',
        type: RequestMethod.Post
    },
    saveTemplate: {
        controller,
        action: 'save_template',
        type: RequestMethod.Post
    },
    starTemplate: {
        controller,
        action: 'star_template',
        type: RequestMethod.Post
    },
    deleteTemplate: {
        controller,
        action: 'delete_template',
        type: RequestMethod.Post
    },
    // 获取当前客户的邮件往来
    get_currentUserMessage: {
        controller,
        action: 'get_content',
        type: RequestMethod.Post
    },

    //发送邮件
    action_send_email: {
        controller,
        action: 'action_send_email',
        type: RequestMethod.Post
    },
    //获取邮件模板
    get_templates: {
        controller,
        action: 'get_templates',
        type: RequestMethod.Post
    },
    //修改订单memo
    action_write_memo: {
        controller,
        action: 'action_write_memo',
        type: RequestMethod.Post
    },
    //创建批注
    action_create_annotation: {
        controller,
        action: 'action_create_annotation',
        type: RequestMethod.Post
    },
    //获取原文
    get_origin_message: {
        controller,
        action: 'get_origin_message',
        type: RequestMethod.Post
    },
    //撤回信息
    revert_message: {
        controller,
        action: 'revert_message',
        type: RequestMethod.Post
    },
    //创建发送发票
    create_send_invoice: {
        controller,
        action: 'create_send_invoice',
        type: RequestMethod.Post
    },
    //设为已回复
    action_set_reply: {
        controller,
        action: 'set_reply',
        type: RequestMethod.Post
    },
    //获取picking list
    queryPickingList: {
        controller,
        action: 'query_picking_list',
        type: RequestMethod.Post
    },
    //修改订单memo
    modifyMemo: {
        controller,
        action: 'modify_memo',
        type: RequestMethod.Post
    },
    queryNoNeedReply: {
        controller,
        action: 'query_no_need_reply',
        type: RequestMethod.Post
    }
}
