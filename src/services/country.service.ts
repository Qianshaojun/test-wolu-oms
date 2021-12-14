import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { CountryController } from '@/config/services/country.controller'

/**
 * 订单API服务
 */
export class CountryService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: CountryController.getList
    })
    public getList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询国家列表/code
     * @param requestParams
     */
    @Request({
        server: CountryController.getListByISOCode2
    })
    public getListCode(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
