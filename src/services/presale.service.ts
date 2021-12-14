import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PreSaleController } from '@/config/services/presale.controller'

/**
 * 订单API服务
 */
export class PreSaleService {
    /**
     * 查询所有产品销售趋势数据
     * @param requestParams
     */
    @Request({
        server: PreSaleController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 编辑产品销售趋势数据
     * @param requestParams
     */
    @Request({
        server: PreSaleController.re_calculate_purchase_predict
    })
    public re_calculate_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 保存产品销售趋势数据
     * @param requestParams
     */
    @Request({
        server: PreSaleController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 产看产品前几周销售数据
     * @param requestParams
     */
    @Request({
        server: PreSaleController.query_sku_week_sales
    })
    public query_sku_week_sales(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * active_purchase_predict
     * @param requestParams
     */
    @Request({
        server: PreSaleController.active_purchase_predict
    })
    public active_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * confirm_purchase_predict
     * @param requestParams
     */
    @Request({
        server: PreSaleController.confirm_purchase_predict
    })
    public confirm_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * approve_purchase_predict
     * @param requestParams
     */
    @Request({
        server: PreSaleController.approve_purchase_predict
    })
    public approve_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * renew_purchase_predict
     * @param requestParams
     */
    @Request({
        server: PreSaleController.renew_purchase_predict
    })
    public renew_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * return_purchase_predict
     * @param requestParams
     */
    @Request({
        server: PreSaleController.return_purchase_predict
    })
    public return_purchase_predict(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
