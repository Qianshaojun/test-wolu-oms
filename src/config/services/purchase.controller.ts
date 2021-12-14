import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'purchase_requirement'

/**
 * API接口配置
 * 订单服务配置
 */
export const PurchaseController: ControllerConfig = {
    // 生成库存预算数据
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    // save船运费接口
    save_boat_shipping_fee: {
        controller,
        action: 'save_boat_shipping_fee',
        type: RequestMethod.Post
    },
    // delete船运费接口
    delete_boat_shipping_fee: {
        controller,
        action: 'delete_boat_shipping_fee',
        type: RequestMethod.Post
    },
    // 查询船费预警接口
    query_all_boat_shipping_fee_monitor: {
        controller,
        action: 'query_all_boat_shipping_fee_monitor',
        type: RequestMethod.Post
    },
    // 查询船运费接口
    query_all_boat_shipping_fee: {
        controller,
        action: 'query_all_boat_shipping_fee',
        type: RequestMethod.Post
    },
    // 查询采购金额接口
    query_all_purchase_price_report: {
        controller,
        action: 'query_all_purchase_price_report',
        type: RequestMethod.Post
    },
    // 查询采购交期接口
    query_all_purchase_give_date_report: {
        controller,
        action: 'query_all_purchase_give_date_report',
        type: RequestMethod.Post
    },
    // 查询采购降本费用接口
    query_all_purchase_reduce_costs_report: {
        controller,
        action: 'query_all_purchase_reduce_costs_report',
        type: RequestMethod.Post
    },
    // 查询SKU库存
    query_all_purchase_prod_qty_info: {
        controller,
        action: 'query_all_purchase_prod_qty_info',
        type: RequestMethod.Post
    },
    // 查询采购产品质量合格率
    query_all_quality_pass_ratio_report: {
        controller,
        action: 'query_all_quality_pass_ratio_report',
        type: RequestMethod.Post
    }
}
