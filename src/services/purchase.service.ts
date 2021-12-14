import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PurchaseController } from '@/config/services/purchase.controller'

/**
 * 订单API服务
 */
export class PurchaseService {
    /**
     * 生成采购预算数据
     * @param requestParams
     */
    @Request({
        server: PurchaseController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询船运费接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_boat_shipping_fee
    })
    public query_all_boat_shipping_fee(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * save船运费接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.save_boat_shipping_fee
    })
    public save_boat_shipping_fee(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * delete船运费接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.delete_boat_shipping_fee
    })
    public delete_boat_shipping_fee(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询船费预警接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_boat_shipping_fee_monitor
    })
    public query_all_boat_shipping_fee_monitor(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询采购金额用接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_purchase_price_report
    })
    public query_all_purchase_price_report(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询采购交期用接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_purchase_give_date_report
    })
    public query_all_purchase_give_date_report(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询采购降本费用接口
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_purchase_reduce_costs_report
    })
    public query_all_purchase_reduce_costs_report(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询SKU库存
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_purchase_prod_qty_info
    })
    public query_all_purchase_prod_qty_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询采购产品质量合格率
     * @param requestParams
     */
    @Request({
        server: PurchaseController.query_all_quality_pass_ratio_report
    })
    public query_all_quality_pass_ratio_report(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
