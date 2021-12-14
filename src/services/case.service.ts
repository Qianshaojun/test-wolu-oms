import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { CaseController } from '@/config/services/case.controller'

/**
 * 日程管理服务
 */
export class CaseService {
    /**
     * 获取所有日程
     * @param requestParams
     */
    @Request({
        server: CaseController.query_all
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取所有日程
     * @param requestParams
     */
    @Request({
        server: CaseController.query_all_calendar
    })
    public queryAllCalendar(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存日程
     * @param requestParams
     */
    @Request({
        server: CaseController.save_case
    })
    public saveCase(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询日程详情
     * @param requestParams
     */
    @Request({
        server: CaseController.query_case_detail
    })
    public queryCaseDetail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 创建消息
     * @param requestParams
     */
    @Request({
        server: CaseController.create_message
    })
    public createMessage(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除消息
     * @param requestParams
     */
    @Request({
        server: CaseController.delete_message
    })
    public deleteMessage(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 状态字典
     * @param requestParams
     */
    @Request({
        server: CaseController.query_case_type
    })
    public queryCaseType(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除case
     * @param requestParams
     */
    @Request({
        server: CaseController.delete_case
    })
    public deleteCase(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改状态
     * @param requestParams
     */
    @Request({
        server: CaseController.change_case_state
    })
    public changeCaseState(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 返回可选择的父日程列表
     * @param requestParams
     */
    @Request({
        server: CaseController.get_parent_case_ids
    })
    public getParentCase(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
