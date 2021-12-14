import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { OperateLogController } from '@/config/services/operatelog.controller'

/**
 * 操作日子
 */
export class OperateLogService {
    /**
     * 查询批次库存操作日志
     * @param requestParams
     */
    @Request({
        server: OperateLogController.view_user_operate_changed_log
    })
    public viewUserOperateChangedLog(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
