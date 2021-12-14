import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { GeneralCodeController } from '@/config/services/general_code.controller'

/**
 * 订单API服务
 */
export class GeneralCodeService {
    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GeneralCodeController.queryShipType
    })
    public queryShipType(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 根据组类别查询generalcode
     * @param requestParams
     */
    @Request({
        server: GeneralCodeController.queryMvShipType
    })
    public queryMvShipType(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
