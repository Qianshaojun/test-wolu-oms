import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PublicController } from '@/config/services/public.controller'

/**
 * 订单API服务
 */
export class PublicService {
    /**
     * 数据分页查询
     * @param requestParams
     */
    @Request({
        server: PublicController.queryPagination
    })
    public queryPagination(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 数据查询
     * @param requestParams
     */
    @Request({
        server: PublicController.query,
        force: true
    })
    public query(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 数据更新
     * @param requestParams
     */
    @Request({
        server: PublicController.modify
    })
    public modify(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 倒出数据分页查询
     * @param requestParams
     */
    @Request({
        server: PublicController.queryExportPagination
    })
    public queryExportPagination(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
