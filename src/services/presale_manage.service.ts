import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { PresaleManageController } from '@/config/services/presale_manage.controller'

/**
 * 订单API服务
 */
export class PresaleManageService {
    /**
     * 保存编辑
     * @param requestParams
     */
    @Request({
        server: PresaleManageController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 生成释放报告
     * @param requestParams
     */
    @Request({
        server: PresaleManageController.release
    })
    public release(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 生成释放报告
     * @param requestParams
     */
    @Request({
        server: PresaleManageController.getInfo
    })
    public getInfo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取货柜及产品信息
     * @param requestParams
     */
    @Request({
        server: PresaleManageController.queryAll
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
