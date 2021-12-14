import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { SkuSaleController } from '@/config/services/skusale.controller'

/**
 * 订单API服务
 */
export class SkuSaleService {
    /**
     * 查询所有sku销售数据
     * @param requestParams
     */
    @Request({
        server: SkuSaleController.query_sum_all
    })
    public query_sum_all(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询具体sku销售数据
     * @param requestParams
     */
    @Request({
        server: SkuSaleController.query_by_time
    })
    public query_by_time(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
