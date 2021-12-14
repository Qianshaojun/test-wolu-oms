import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { AccountController } from '@/config/services/account.controller'

/**
 * 订单API服务
 */
export class AccountService {
    /**
     * 创建Invoice
     * @param requestParams
     */
    @Request({
        server: AccountController.createInvoice
    })
    public createInvoice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有Invoice Query All
     * @param requestParams
     */
    @Request({
        server: AccountController.getInvoiceList
    })
    public getInvoiceList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询账单明细
     * @param requestParams
     */
    @Request({
        server: AccountController.getInvoiceDetail
    })
    public getInvoiceDetail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 编辑时查详情
     * @param requestParams
     */
    @Request({
        server: AccountController.query_invoice_detail_for_edit
    })
    public queryInvoiceDetailForEdit(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存发票信息
     * @param requestParams
     */
    @Request({
        server: AccountController.save_account_invoice
    })
    public saveAccountInvoice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除发票信息
     * @param requestParams
     */
    @Request({
        server: AccountController.delete_account_invoice
    })
    public deleteAccountInvoice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除发票信息
     * @param requestParams
     */
    @Request({
        server: AccountController.modify_invoice_address
    })
    public modifyInvoiceAddress(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改发票状态
     * @param requestParams
     */
    @Request({
        server: AccountController.change_invoice_state
    })
    public changeInvoiceState(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标识账单已退款
     * @param requestParams
     */
    @Request({
        server: AccountController.update_refund_time
    })
    public updateRefundTime(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
