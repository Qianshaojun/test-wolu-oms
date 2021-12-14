import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'account'

/**
 * API接口配置
 * 库存服务配置
 */
export const AccountController: ControllerConfig = {
    // 创建账单
    createInvoice: {
        controller,
        action: 'create_normal_invoice',
        type: RequestMethod.Post
    },
    // 获取账单列表
    getInvoiceList: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 获取账单详情
    getInvoiceDetail: {
        controller,
        action: 'query_invoice_detail',
        type: RequestMethod.Post
    },
    query_invoice_detail_for_edit: {
        controller,
        action: 'query_invoice_detail_for_edit',
        type: RequestMethod.Post
    },
    save_account_invoice: {
        controller,
        action: 'save_account_invoice',
        type: RequestMethod.Post
    },
    delete_account_invoice: {
        controller,
        action: 'delete_account_invoice',
        type: RequestMethod.Post
    },
    modify_invoice_address: {
        controller,
        action: 'modify_invoice_address',
        type: RequestMethod.Post
    },
    change_invoice_state: {
        controller,
        action: 'change_invoice_state',
        type: RequestMethod.Post
    },
    update_refund_time: {
        controller,
        action: 'update_refund_time',
        type: RequestMethod.Post
    }
}
