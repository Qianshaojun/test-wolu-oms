import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { SaleTrendController } from '@/config/services/saletrend.controll'

/**
 * 订单API服务
 */
export class SaleTrendService {
    /**
     * 查询所有产品销售趋势数据
     * @param requestParams
     */
    @Request({
        server: SaleTrendController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 保存产品销售趋势数据
     * @param requestParams
     */
    @Request({
        server: SaleTrendController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
