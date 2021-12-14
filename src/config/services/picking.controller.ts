import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'stock_picking'

/**
 * API接口配置
 * 产品服务配置
 */
export const PickingController: ControllerConfig = {
    // 产品查询
    query: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    //详情查询
    query_one_picking: {
        controller,
        action: 'query_one_picking',
        type: RequestMethod.Post
    },
    //多个详情查询
    query_more_picking: {
        controller,
        action: 'query_more_picking',
        type: RequestMethod.Post
    },
    //stock_operation 查询
    query_stock_operation: {
        controller,
        action: 'query_stock_operation',
        type: RequestMethod.Post
    },
    //stock_move 查询
    query_stock_move: {
        controller,
        action: 'query_stock_move',
        type: RequestMethod.Post
    },
    query_stock_move_for_return: {
        controller,
        action: 'query_stock_move_for_return',
        type: RequestMethod.Post
    },
    query_stock_move_for_resend: {
        controller,
        action: 'query_stock_move_for_resend',
        type: RequestMethod.Post
    },
    //stock_move 查询
    query_shipments: {
        controller,
        action: 'query_shipments',
        type: RequestMethod.Post
    },
    //return info 查询
    query_customer_problem_return_info: {
        controller,
        action: 'query_customer_problem_return_info',
        type: RequestMethod.Post
    },
    //根据picking_id查询要校验地址的信息
    query_picking_for_validate_shipment: {
        controller,
        action: 'query_picking_for_validate_shipment',
        type: RequestMethod.Post
    },
    //提交地址修改并返回校验
    validate_picking_shipping_address: {
        controller,
        action: 'validate_picking_shipping_address',
        type: RequestMethod.Post
    },
    //取消stock_picking
    cancel_stock_picking: {
        controller,
        action: 'cancel_stock_picking',
        type: RequestMethod.Post
    },
    //批量保存stock_picking地址
    save_picking_address: {
        controller,
        action: 'save_picking_address',
        type: RequestMethod.Post
    },
    //Picking设置为草稿
    setAsDraft: {
        controller,
        action: 'set_as_draft',
        type: RequestMethod.Post
    },
    //设置picking为presale
    setPresale: {
        controller,
        action: 'set_presale',
        type: RequestMethod.Post
    },
    //Picking设置为取消presale
    cancelPresale: {
        controller,
        action: 'cancel_presale',
        type: RequestMethod.Post
    },
    //设置picking为卖超
    markSoldOut: {
        controller,
        action: 'mark_sold_out',
        type: RequestMethod.Post
    },
    //设置picking不是卖超
    cancelSoldOut: {
        controller,
        action: 'cancel_sold_out',
        type: RequestMethod.Post
    },
    //Check shipments
    checkShipments: {
        controller,
        action: 'check_shipments',
        type: RequestMethod.Post
    },
    //设置取消shipments
    cancelCheckShipments: {
        controller,
        action: 'cancel_check_shipments',
        type: RequestMethod.Post
    },
    //标记service process
    serviceProcess: {
        controller,
        action: 'service_process',
        type: RequestMethod.Post
    },
    //标记return process
    returnProcess: {
        controller,
        action: 'return_process',
        type: RequestMethod.Post
    },
    //标记customer_service_stop_plz
    customer_service_stop_plz: {
        controller,
        action: 'customer_service_stop_plz',
        type: RequestMethod.Post
    },
    //标记cancel_stock_picking_for_order_refund
    cancel_stock_picking_for_order_refund: {
        controller,
        action: 'cancel_stock_picking_for_order_refund',
        type: RequestMethod.Post
    },
    //保存picking
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    //保存picking operations
    save_stock_pack_operation: {
        controller,
        action: 'save_stock_pack_operation',
        type: RequestMethod.Post
    },
    //保存picking move
    save_stock_move: {
        controller,
        action: 'save_stock_move',
        type: RequestMethod.Post
    },
    //保存picking move
    save_customer_problem: {
        controller,
        action: 'save_customer_problem',
        type: RequestMethod.Post
    },
    //保存picking shipments
    save_shipment_info: {
        controller,
        action: 'save_shipment_info',
        type: RequestMethod.Post
    },
    reserve: {
        controller,
        action: 'reserve',
        type: RequestMethod.Post
    },
    create_shipments_lines: {
        controller,
        action: 'create_shipments_lines',
        type: RequestMethod.Post
    },
    ReturnShipment: {
        controller,
        action: 'create_return_shipment',
        type: RequestMethod.Post
    },
    cancel_picking_and_send_email: {
        controller,
        action: 'cancel_picking_and_send_email',
        type: RequestMethod.Post
    },
    query_picking_log: {
        controller,
        action: 'query_picking_log',
        type: RequestMethod.Post
    },
    delete_dhl_shipment: {
        controller,
        action: 'delete_shipment_line',
        type: RequestMethod.Post
    },
    confirm_product_parts: {
        controller,
        action: 'confirm_product_parts',
        type: RequestMethod.Post
    },
    query_product_part: {
        controller,
        action: 'query_product_part',
        type: RequestMethod.Post
    },
    fake_shipments: {
        controller,
        action: 'fake_shipments',
        type: RequestMethod.Post
    },
    upload_shipment: {
        controller,
        action: 'upload_shipment',
        type: RequestMethod.Post
    },
    upload_fake_shipment: {
        controller,
        action: 'upload_fake_shipment',
        type: RequestMethod.Post
    },
    assign_to_user: {
        controller,
        action: 'assign_to_user',
        type: RequestMethod.Post
    },
    create_shipment_lines_by_ship_type: {
        controller,
        action: 'create_shipment_lines_by_ship_type',
        type: RequestMethod.Post
    },
    force_available: {
        controller,
        action: 'force_available',
        type: RequestMethod.Post
    },
    force_pass_validate_shipping_address: {
        controller,
        action: 'force_pass_validate_shipping_address',
        type: RequestMethod.Post
    },
    save_customer_problem_by_order_id: {
        controller,
        action: 'save_customer_problem_by_order_id',
        type: RequestMethod.Post
    },
    delete_cancel_picking: {
        controller,
        action: 'delete_cancel_picking',
        type: RequestMethod.Post
    },
    query_stock_move_base_product: {
        controller,
        action: 'query_stock_move_base_product',
        type: RequestMethod.Post
    },
    create_product_tmpl_part_sku: {
        controller,
        action: 'save_product_tmpl_part_sku',
        type: RequestMethod.Post
    },
    query_all_picking_resend_detail: {
        controller,
        action: 'query_all_picking_resend_detail',
        type: RequestMethod.Post
    },
    create_dhl_dpd_gift: {
        controller,
        action: 'create_dhl_dpd_gift',
        type: RequestMethod.Post
    }    
}
