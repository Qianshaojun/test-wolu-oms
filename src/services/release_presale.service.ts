import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { ReleasePreSaleController } from '@/config/services/release_presale.controller'

/**
 * 订单API服务
 */
export class ReleasePreSaleService {
    /**
     * 获取所有预售订单
     * @param requestParams
     */
    @Request({
        server: ReleasePreSaleController.queryAll
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询具体产品
     * @param requestParams
     */
    @Request({
        server: ReleasePreSaleController.queryProduct
    })
    public queryProduct(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 取消
     * @param requestParams
     */
    @Request({
        server: ReleasePreSaleController.cancel
    })
    public cancel(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 完成
     * @param requestParams
     */
    @Request({
        server: ReleasePreSaleController.done
    })
    public done(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * query one
     * @param requestParams
     */
    @Request({
        server: ReleasePreSaleController.query_one
    })
    public query_one(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
