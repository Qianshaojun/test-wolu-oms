import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PartnerController } from '@/config/services/partner.controller'

/**
 * 订单API服务
 */
export class PartnerService {
    /**
     * 查询国家列表/id
     * @param requestParams
     */
    @Request({
        server: PartnerController.query_customer_contact
    })
    public queryCustomerContact(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
