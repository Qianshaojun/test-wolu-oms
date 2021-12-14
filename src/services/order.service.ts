import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { OrderController } from '@/config/services/order.controller'

/**
 * 订单API服务
 */
export class OrderService {
    /**
     * 查询订单列表
     * @param requestParams
     */
    @Request({
        server: OrderController.getOrderList
    })
    public queryAll(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询订单详情
     * @param requestParams
     */
    @Request({
        server: OrderController.getOrderDetail
    })
    public getDetail(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询订单拣货列表
     * @param requestParams
     */
    @Request({
        server: OrderController.getPickList
    })
    public getPickList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询订单拣货列表
     * @param requestParams
     */
    @Request({
        server: OrderController.getInvoiceList
    })
    public getInvoiceList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询客户问题列表
     * @param requestParams
     */
    @Request({
        server: OrderController.getCustomerList
    })
    public getCustomerList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取日志
     * @param requestParams
     */
    @Request({
        server: OrderController.getLogList
    })
    public getLogList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存订单
     * @param requestParams
     */
    @Request({
        server: OrderController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单生成账单
     * @param requestParams
     */
    @Request({
        server: OrderController.createAccountInvoice
    })
    public createAccountInvoice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 取消订单
     * @param requestParams
     */
    @Request({
        server: OrderController.cancelOrder
    })
    public cancelOrder(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 取消状态订单变成草稿状态
     * @param requestParams
     */
    @Request({
        server: OrderController.setAsDraft
    })
    public setAsDraft(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单生成RT面单
     * @param requestParams
     */
    @Request({
        server: OrderController.return
    })
    public return(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 标识ebay订单已付款
     * @param requestParams
     */
    @Request({
        server: OrderController.markEbayOrderAsPaid
    })
    public markEbayOrderAsPaid(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单部分退款/全额退款
     * @param requestParams
     */
    @Request({
        server: OrderController.refund
    })
    public refund(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单补发
     * @param requestParams
     */
    @Request({
        server: OrderController.deliverMore
    })
    public deliverMore(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取订单AMA/Ebay DZ数据接口
     * @param requestParams
     */
    @Request({
        server: OrderController.queryAmaEbayDz
    })
    public queryAmaEbayDz(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单生成picking
     * @param requestParams
     */
    @Request({
        server: OrderController.confirm
    })
    public confirm(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单自动生成picking
     * @param requestParams
     */
    @Request({
        server: OrderController.autoConfirm
    })
    public autoConfirm(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 订单自动生成picking
     * @param requestParams
     */
    @Request({
        server: OrderController.query_order_info
    })
    public queryOrderInfo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 变为草稿状态
     * @param requestParams
     */
    @Request({
        server: OrderController.set_to_draft
    })
    public setToDraft(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
}
