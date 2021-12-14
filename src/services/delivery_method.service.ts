import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { DeliveryMethodController } from '@/config/services/delivery_method.controller'

/**
 * 订单API服务
 */
export class DeliveryMethodService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: DeliveryMethodController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
