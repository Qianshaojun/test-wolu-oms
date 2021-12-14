import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { CrmteamController } from '@/config/services/crmteam.controller'

/**
 * 订单API服务
 */
export class CrmteamService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: CrmteamController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
