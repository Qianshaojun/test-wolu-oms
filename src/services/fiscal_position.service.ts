import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { FiscalPositionController } from '@/config/services/fiscal_position.controller'

/**
 * 订单API服务
 */
export class FiscalPositionService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: FiscalPositionController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
