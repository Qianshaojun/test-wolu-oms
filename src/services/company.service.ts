import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { CompanyController } from '@/config/services/company.controller'

/**
 * 订单API服务
 */
export class CompanyService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: CompanyController.query_list
    })
    public getList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
