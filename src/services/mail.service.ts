import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { MailController } from '@/config/services/mail.controller'

/**
 * 邮件API服务
 */
export class MailService {
    /**
     * 发送邮件
     * @param requestParams
     */
    @Request({
        server: MailController.create_email
    })
    public createEmail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询邮件模板列表
     * @param requestParams
     */
    @Request({
        server: MailController.query_email_template
    })
    public queryEmailTemplate(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询邮件模板内容
     * @param requestParams
     */
    @Request({
        server: MailController.render_email_template
    })
    public renderEmailTemplate(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询邮件所有违禁词
     * @param requestParams
     */
    @Request({
        server: MailController.query_all_illegal_words
    })
    public queryAllIllegalWords(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 批量删除违禁词
     * @param requestParams
     */
    @Request({
        server: MailController.batch_delete_illegal_words
    })
    public batchDeleteIllegalWords(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存违禁词
     * @param requestParams
     */
    @Request({
        server: MailController.save_illegal_words
    })
    public saveIllegalWords(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询ticket seller name
     * @param requestParams
     */
    @Request({
        server: MailController.query_ticket_seller_name
    })
    public queryTicketSellerName(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询ticket site id
     * @param requestParams
     */
    @Request({
        server: MailController.query_ticket_site_id_by_ticket_seller_name
    })
    public querySiteId(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询ticket类型
     * @param requestParams
     */
    @Request({
        server: MailController.query_ticket_type
    })
    public query_ticket_type(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
