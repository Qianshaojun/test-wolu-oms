import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PricelistController } from '@/config/services/pricelist.controller'

/**
 * 订单API服务
 */
export class PricelistService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: PricelistController.getList
    })
    public getList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
