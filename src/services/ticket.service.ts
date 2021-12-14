import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { TicketController } from '@/config/services/ticket.controller'

/**
 * 仓库API服务
 */
export class TicketService {
    /**
     * 查询系统所有收件箱
     * @param requestParams
     */
    @Request({
        server: TicketController.query_fetch_email_server
    })
    public query_fetch_email_server(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
