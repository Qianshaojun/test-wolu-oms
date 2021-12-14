import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { LogoutController } from '@/config/services/logout.controller'

/**
 * 系统用户服务
 */
export class LogoutService {
    /**
     * 可用销售代表查询
     * @param requestParams
     */
    @Request({
        server: LogoutController.logout
    })
    public logout(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
