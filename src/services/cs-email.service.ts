import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { EmailController } from '@/config/services/cs-email.controller'

/**
 * 邮件API服务
 */
export class EmailService {
    /**
     * 邮件客户列表
     * @param requestParams
     */
    @Request({
        server: EmailController.get_userlist
    })
    public getEmailUserList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 当前客户邮件往来记录
     * @param requestParams
     */
    @Request({
        server: EmailController.get_currentUserMessage
    })
    public getCurrentUserMessage(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 发送邮件
     * @param requestParams
     */
    @Request({
        server: EmailController.action_send_email
    })
    public actionSendEmail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 设置已回复
     * @param requestParams
     */
    @Request({
        server: EmailController.action_set_reply
    })
    public actionSetReply(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 获取模板接口
     * @param requestParams
     */
    @Request({
        server: EmailController.get_templates
    })
    public getTemplates(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 获取模板接口
     * @param requestParams
     */
    @Request({
        server: EmailController.saveTemplate
    })
    public saveTemplate(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 关注模板接口
     * @param requestParams
     */
    @Request({
        server: EmailController.starTemplate
    })
    public starTemplate(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 关注模板接口
     * @param requestParams
     */
    @Request({
        server: EmailController.deleteTemplate
    })
    public deleteTemplate(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改memo接口
     * @param requestParams
     */
    @Request({
        server: EmailController.action_write_memo
    })
    public actionWriteMemo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 创建批注接口
     * @param requestParams
     */
    @Request({
        server: EmailController.action_create_annotation
    })
    public actionCreateAnnotation(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }

    /**
     * 获取邮件原文接口
     * @param requestParams
     */
    @Request({
        server: EmailController.get_origin_message
    })
    public getOriginMessage(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 撤销未实际发送的信息
     * @param requestParams
     */
    @Request({
        server: EmailController.revert_message
    })
    public revertMessage(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     *
     * @param requestParams
     */
    @Request({
        server: EmailController.queryPickingList
    })
    public queryPickingList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     *
     * @param requestParams
     */
    @Request({
        server: EmailController.modifyMemo
    })
    public modifyMemo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     *
     * @param requestParams
     */
    @Request({
        server: EmailController.queryNoNeedReply
    })
    public queryNoNeedReply(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     *
     * @param requestParams
     */
    @Request({
        server: EmailController.setNoNeedReplyDone
    })
    public setNoNeedReplyDone(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
