import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { ProductPurchaseController } from '@/config/services/product.purchase.control'

/**
 * 采购排单API服务
 */
export class ProductPurchaseService {
    /**
     * 所有排单计划查询
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.query_all_requirement_schedule
    })
    public query_all_requirement_schedule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 确认排单计划
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.confirm_requirement_schedule
    })
    public confirm_requirement_schedule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 取消排单计划
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.cancel_requirement_schedule
    })
    public cancel_requirement_schedule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改排单计划数量
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.change_requirement_schedule_qty
    })
    public change_requirement_schedule_qty(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 计算环比
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.calculate_category_increase_ratio
    })
    public calculate_category_increase_ratio(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询货柜
     * @param requestParams
     */
    @Request({
        server: ProductPurchaseController.queryRequirementPackage
    })
    public queryRequirementPackage(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
