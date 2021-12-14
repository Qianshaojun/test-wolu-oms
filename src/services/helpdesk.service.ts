import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { HelpdeskController } from '@/config/services/helpdesk.controller'

/**
 * 订单API服务
 */
export class HelpdeskService {
    /**
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_all_ticket
    })
    public queryAllTicket(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有Invoice Query All
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_ticket
    })
    public queryTicket(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询账单明细
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_helpdesk_ticket_body
    })
    public queryHelpdeskTicketBody(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *确认拣货单取消
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.set_picking_cancelled_confirm
    })
    public setPickingCancelledConfirm(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *分配用户
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.assign_ticket_user
    })
    public assignTicketUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *取消分配用户
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.cancel_ticket_user
    })
    public cancelTicketUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查看邮件回复情况
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_ticket_reply_content
    })
    public queryTicketReplyContent(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查看邮件回复日志
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_ticket_changed_log
    })
    public query_ticket_changed_log(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查看所有邮件分组
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_all_email_group
    })
    public query_all_email_group(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存邮件分组
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.save_email_group
    })
    public save_email_group(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *停用邮件分组
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.cancel_email_group_status
    })
    public cancel_email_group_status(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *启用邮件分组
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.active_email_group_status
    })
    public active_email_group_status(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询客服分配比例
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_user_allot_ratio
    })
    public query_user_allot_ratio(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存客服分配比例
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.save_user_allot_ratio
    })
    public save_user_allot_ratio(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *启用客服分配比例
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.active_user_allot_ratio
    })
    public active_user_allot_ratio(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *停用客服分配比例
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.cancel_user_allot_ratio
    })
    public cancel_user_allot_ratio(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询所有客服分配记录
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_all_allot_user
    })
    public query_all_allot_user(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *批量修改客服
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.change_allot_user
    })
    public change_allot_user(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *自动分配用户
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.auto_allot_email
    })
    public auto_allot_email(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *获取自动回复设置列表
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_all_send_email_time
    })
    public query_all_send_email_time(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *设置自动回复
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.set_up_send_mail_time
    })
    public set_up_send_mail_time(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *获取自动回复设置列表
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.query_send_customer_email_time
    })
    public query_send_customer_email_time(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *设置自动回复
     * @param requestParams
     */
    @Request({
        server: HelpdeskController.set_up_send_mail_time_customer
    })
    public set_up_send_mail_time_customer(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }    
}
