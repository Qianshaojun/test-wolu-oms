import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'sale_order'

/**
 * API接口配置
 * 订单服务配置
 */
export const OrderController: ControllerConfig = {
    // 获取订单列表
    getOrderList: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    // 获取订单详情
    getOrderDetail: {
        controller,
        action: 'query_order_detail',
        type: RequestMethod.Post
    },
    // 获取订单拣货列表
    getPickList: {
        controller,
        action: 'query_picking_list',
        type: RequestMethod.Post
    },
    // 获取發票信息
    getInvoiceList: {
        controller,
        action: 'query_account_invoice',
        type: RequestMethod.Post
    },
    // 获取客户问题信息
    getCustomerList: {
        controller,
        action: 'query_customer_problem',
        type: RequestMethod.Post
    },
    // 获取日志
    getLogList: {
        controller,
        action: 'query_order_log',
        type: RequestMethod.Post
    },
    // 保存订单
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    // 订单生成账单
    createAccountInvoice: {
        controller,
        action: 'create_account_invoice',
        type: RequestMethod.Post
    },
    // 取消订单
    cancelOrder: {
        controller,
        action: 'cancel_sale_order',
        type: RequestMethod.Post
    },
    // 取消状态订单变成草稿状态
    setAsDraft: {
        controller,
        action: 'set_as_draft',
        type: RequestMethod.Post
    },
    // 订单生成RT面单
    return: {
        controller,
        action: 'return',
        type: RequestMethod.Post
    },
    // 标识ebay订单已付款
    markEbayOrderAsPaid: {
        controller,
        action: 'mark_ebay_order_as_paid',
        type: RequestMethod.Post
    },
    // 订单部分退款/全额退款
    refund: {
        controller,
        action: 'refund',
        type: RequestMethod.Post
    },
    // 订单补发
    deliverMore: {
        controller,
        action: 'deliver_more',
        type: RequestMethod.Post
    },
    // 获取订单AMA/Ebay DZ数据接口
    queryAmaEbayDz: {
        controller,
        action: 'query_ama_ebay_dz',
        type: RequestMethod.Post
    },
    // 订单生成picking
    confirm: {
        controller,
        action: 'confirm',
        type: RequestMethod.Post
    },
    // 订单自动生成picking
    autoConfirm: {
        controller,
        action: 'auto_confirm',
        type: RequestMethod.Post
    },
    // 查询订单信息
    query_order_info: {
        controller,
        action: 'query_order_info',
        type: RequestMethod.Post
    },
    // 订单变为草稿状态
    set_to_draft: {
        controller,
        action: 'set_to_draft',
        type: RequestMethod.Post
    }
}
