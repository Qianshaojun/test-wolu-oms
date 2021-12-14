import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PurchaseCalController } from '@/config/services/purchasecal.controller'

/**
 * 订单API服务
 */
export class PurchaseCalService {
    /**
     * 查询所有产品采购预算数据
     * @param requestParams
     */
    @Request({
        server: PurchaseCalController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询单个产品采购预算详情数据
     * @param requestParams
     */
    @Request({
        server: PurchaseCalController.query_detail
    })
    public queryDetail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询单个产品历史销售数据
     * @param requestParams
     */
    @Request({
        server: PurchaseCalController.sales_history
    })
    public salesHistory(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询单个产品采购预算日志
     * @param requestParams
     */
    @Request({
        server: PurchaseCalController.query_detail
    })
    public getLogs(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
