import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PickingController } from '@/config/services/picking.controller'

/**
 * 产品API服务
 */
export class PickingService {
    /**
     * 发货列表查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 发货详情查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_one_picking
    })
    public queryDetail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 多个发货详情查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_more_picking
    })
    public queryDetailList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * stock_operation 查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_stock_operation
    })
    public queryStockOperation(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * stock_move 查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_stock_move
    })
    public queryStockMove(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * stock_move 查询(回程单)
     * @param requestParams
     */
    @Request({
        server: PickingController.query_stock_move_for_return
    })
    public queryStockMoveForReturn(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * resend product
     * @param requestParams
     */
    @Request({
        server: PickingController.query_stock_move_for_resend
    })
    public queryStockMoveForResend(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 物流信息查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_shipments
    })
    public queryShipment(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 退款信息查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_customer_problem_return_info
    })
    public queryReturnInfo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 发货地址校验查询
     * @param requestParams
     */
    @Request({
        server: PickingController.query_picking_for_validate_shipment
    })
    public queryValidateShipment(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 提交地址修改并返回校验
     * @param requestParams
     */
    @Request({
        server: PickingController.validate_picking_shipping_address
    })
    public validateAddress(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 取消stock_picking
     * @param requestParams
     */
    @Request({
        server: PickingController.cancel_stock_picking
    })
    public cancelPicking(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 批量保存stock_picking地址
     * @param requestParams
     */
    @Request({
        server: PickingController.save_picking_address
    })
    public saveAddress(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Picking设置为草稿
     * @param requestParams
     */
    @Request({
        server: PickingController.setAsDraft
    })
    public setAsDraft(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 设置picking为presale
     * @param requestParams
     */
    @Request({
        server: PickingController.setPresale
    })
    public setPresale(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Picking设置为取消presale
     * @param requestParams
     */
    @Request({
        server: PickingController.cancelPresale
    })
    public cancelPresale(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 设置picking为卖超
     * @param requestParams
     */
    @Request({
        server: PickingController.markSoldOut
    })
    public markSoldOut(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 设置picking不是卖超
     * @param requestParams
     */
    @Request({
        server: PickingController.cancelSoldOut
    })
    public cancelSoldOut(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * Check shipments
     * @param requestParams
     */
    @Request({
        server: PickingController.checkShipments
    })
    public checkShipments(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 设置取消shipments
     * @param requestParams
     */
    @Request({
        server: PickingController.cancelCheckShipments
    })
    public cancelCheckShipments(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标记service process
     * @param requestParams
     */
    @Request({
        server: PickingController.serviceProcess
    })
    public serviceProcess(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标记return process
     * @param requestParams
     */
    @Request({
        server: PickingController.returnProcess
    })
    public returnProcess(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标记customer_service_stop_plz
     * @param requestParams
     */
    @Request({
        server: PickingController.customer_service_stop_plz
    })
    public customer_service_stop_plz(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标记return process
     * @param requestParams
     */
    @Request({
        server: PickingController.cancel_stock_picking_for_order_refund
    })
    public cancel_stock_picking_for_order_refund(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存picking
     * @param requestParams
     */
    @Request({
        server: PickingController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存picking operations
     * @param requestParams
     */
    @Request({
        server: PickingController.save_stock_pack_operation
    })
    public saveOperations(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存picking Move
     * @param requestParams
     */
    @Request({
        server: PickingController.save_stock_move
    })
    public saveMove(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存customer problem
     * @param requestParams
     */
    @Request({
        server: PickingController.save_customer_problem
    })
    public saveCustomerProblem(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存picking shipments
     * @param requestParams
     */
    @Request({
        server: PickingController.save_shipment_info
    })
    public saveShipmentInfo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 预留
     * @param requestParams
     */
    @Request({
        server: PickingController.reserve
    })
    public reserve(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * create_shipments_lines
     * @param requestParams
     */
    @Request({
        server: PickingController.create_shipments_lines
    })
    public createShipmentsLines(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    } /**
    /**
     * 保存ReturnShipment
     * @param requestParams
     */
    @Request({
        server: PickingController.ReturnShipment
    })
    public returnShipment(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 发送邮件cancel_picking_and_send_email
     * @param requestParams
     */
    @Request({
        server: PickingController.cancel_picking_and_send_email
    })
    public SendEmail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取picking日志
     * @param requestParams
     */
    @Request({
        server: PickingController.query_picking_log
    })
    public queryPickingLog(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除物流面单
     * @param requestParams
     */
    @Request({
        server: PickingController.delete_dhl_shipment
    })
    public deleteDhlShiDpment(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 确认产品零部件
     * @param requestParams
     */
    @Request({
        server: PickingController.confirm_product_parts
    })
    public confirmProductParts(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品零部件query_product_part
     * @param requestParams
     */
    @Request({
        server: PickingController.query_product_part
    })
    public query_product_part(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 假单号
     * @param requestParams
     */
    @Request({
        server: PickingController.fake_shipments
    })
    public fake_shipments(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 上传单号
     * @param requestParams
     */
    @Request({
        server: PickingController.upload_shipment
    })
    public upload_shipment(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 上传假单号
     * @param requestParams
     */
    @Request({
        server: PickingController.upload_fake_shipment
    })
    public upload_fake_shipment(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * assign_to_user
     * @param requestParams
     */
    @Request({
        server: PickingController.assign_to_user
    })
    public assign_to_user(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 创建运单 不同类型同个接口
     * @param requestParams
     */
    @Request({
        server: PickingController.create_shipment_lines_by_ship_type
    })
    public create_shipment_lines_by_ship_type(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 创建运单 不同类型同个接口
     * @param requestParams
     */
    @Request({
        server: PickingController.create_dhl_dpd_gift
    })
    public create_dhl_dpd_gift(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }    
    /**
     * force_available
     * @param requestParams
     */
    @Request({
        server: PickingController.force_available
    })
    public force_available(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * force_pass_validate_shipping_address
     * @param requestParams
     */
    @Request({
        server: PickingController.force_pass_validate_shipping_address
    })
    public forceVerifyAddress(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * save_customer_problem_by_order_id
     * @param requestParams
     */
    @Request({
        server: PickingController.save_customer_problem_by_order_id
    })
    public saveCustomerProblemByOrderId(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * delete_cancel_picking
     * @param requestParams
     */
    @Request({
        server: PickingController.delete_cancel_picking
    })
    public deleteCancelPicking(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * query_stock_move_base_product
     * @param requestParams
     */
    @Request({
        server: PickingController.query_stock_move_base_product
    })
    public query_stock_move_base_product(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * create_product_tmpl_part_sku
     * @param requestParams
     */
    @Request({
        server: PickingController.create_product_tmpl_part_sku
    })
    public create_product_tmpl_part_sku(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * create_product_tmpl_part_sku
     * @param requestParams
     */
    @Request({
        server: PickingController.query_all_picking_resend_detail
    })
    public query_all_picking_resend_detail(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
