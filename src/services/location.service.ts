import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { LocationController } from '@/config/services/location.controller'

/**
 * 订单API服务
 */
export class LocationService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: LocationController.query_stock_location
    })
    public getLocationList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
