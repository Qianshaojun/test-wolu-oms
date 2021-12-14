import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { SellerInstanceController } from '@/config/services/seller-instance.controller'

/**
 * 产品API服务
 */
export class SellerInstanceService {
    /**
     * 产品查询
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.instance_query
    })
    public getInstanceList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 产品查询
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.seller_query
    })
    public getSellerList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 产品保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.seller_save
    })
    public seller_save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 产品保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.instance_save
    })
    public instance_save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.seller_delete
    })
    public seller_delete(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.instance_delete
    })
    public instance_delete(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.responsible_users_query
    })
    public responsible_users_query(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.seller_query_one
    })
    public seller_query_one(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.seller_query_for_selection
    })
    public seller_query_for_selection(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_user_login
    })
    public query_user_login(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.get_instance_list_for_view
    })
    public get_instance_list_for_view(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_seller_name
    })
    public query_seller_name(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.change_seller_status
    })
    public change_seller_status(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除保存
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.change_instance_status
    })
    public change_instance_status(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取店铺下拉列表
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_odoo_seller_list
    })
    public queryOdooSellerList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取店铺实例下拉列表
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_odoo_seller_instance_list
    })
    public queryOdooSellerInstanceList(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 获取实例下拉列表
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_instance_list
    })
    public queryInstanceList(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_seller_name
    })
    public querySellerName(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.save_seller_api
    })
    public saveSellerApi(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 根据店铺id获取实例下拉列表
     * @param requestParams
     */
    @Request({
        server: SellerInstanceController.query_instance_by_seller_code
    })
    public queryInstanceBySellerCode(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
