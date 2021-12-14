import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { TaxesController } from '@/config/services/taxes.controller'

/**
 * 订单API服务
 */
export class TaxesService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: TaxesController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
