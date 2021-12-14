import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { UserController } from '@/config/services/user.controller'

/**
 * 仓库API服务
 */
export class UserService {
    /**
     * 可用销售代表查询
     * @param requestParams
     */
    @Request({
        server: UserController.all
    })
    public all(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 可用销售代表查询
     * @param requestParams
     */
    @Request({
        server: UserController.availableSales
    })
    public querySalesUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 可用销售代表查询
     * @param requestParams
     */
    @Request({
        server: UserController.customerServiceUser
    })
    public customerServiceUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
