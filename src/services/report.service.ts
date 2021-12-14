import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { ReportController } from '@/config/services/report.controller'

/**
 * 订单API服务
 */
export class ReportService {
    /**
     * 查询订单日期下拉
     * @param requestParams
     */
    @Request({
        server: ReportController.query_order_date_list
    })
    public query_order_date_list(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询国家下拉
     * @param requestParams
     */
    @Request({
        server: ReportController.query_country_list
    })
    public query_country_list(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取分类列表
     * @param requestParams
     */
    @Request({
        server: ReportController.query_category_list
    })
    public query_category_list(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取子类列表
     * @param requestParams
     */
    @Request({
        server: ReportController.query_sub_category_list
    })
    public query_sub_category_list(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取分类子类字典
     * @param requestParams
     */
    @Request({
        server: ReportController.query_category_dict
    })
    public query_category_dict(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取品类毛利数据
     * @param requestParams
     */
    @Request({
        server: ReportController.query_category_profit_data
    })
    public query_category_profit_data(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * SKU毛利数据
     * @param requestParams
     */
    @Request({
        server: ReportController.query_sku_profit_data
    })
    public query_sku_profit_data(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有毛利数据
     * @param requestParams
     */
    @Request({
        server: ReportController.query_all_profit_data
    })
    public query_all_profit_data(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
