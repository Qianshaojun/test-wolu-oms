import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { AliexpressController } from '@/config/services/aliexpress.controller'

/**
 * 订单API服务
 */
export class AliexpressService {
    /**
     * 导入订单
     * @param requestParams
     */
    @Request({
        server: AliexpressController.importOrders
    })
    public importOrders(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 结单
     * @param requestParams
     */
    @Request({
        server: AliexpressController.fulfilOrders
    })
    public fulfilOrders(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 库存管理接口
     * @param requestParams
     */
    @Request({
        server: AliexpressController.query_all
    })
    public query_all(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * listing_save
     * @param requestParams
     */
    @Request({
        server: AliexpressController.listing_save
    })
    public listing_save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 库存管理merge user
     * @param requestParams
     */
    @Request({
        server: AliexpressController.mergeUser
    })
    public mergeUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 库存管理merge auto
     * @param requestParams
     */
    @Request({
        server: AliexpressController.mergeAuto
    })
    public mergeAuto(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 库存管理cancelAuto
     * @param requestParams
     */
    @Request({
        server: AliexpressController.cancelAuto
    })
    public cancelAuto(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
