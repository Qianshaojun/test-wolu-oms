import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { WorkweekController } from '@/config/services/workweek.controller'

/**
 * 订单API服务
 */
export class WorkweekService {
    /**
     * 查询列表/id
     * @param requestParams
     */
    @Request({
        server: WorkweekController.query_all
    })
    public query_all(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 创建周报
     * @param requestParams
     */
    @Request({
        server: WorkweekController.save_week
    })
    public save_week(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询周报详情
     * @param requestParams
     */
    @Request({
        server: WorkweekController.query_week_detail
    })
    public query_week_detail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * create_message
     * @param requestParams
     */
    @Request({
        server: WorkweekController.create_message
    })
    public create_message(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * delete_message
     * @param requestParams
     */
    @Request({
        server: WorkweekController.delete_message
    })
    public delete_message(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
