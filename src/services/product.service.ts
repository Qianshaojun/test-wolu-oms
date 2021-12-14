import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { ProductController } from '@/config/services/product.controller'
import { RequestMethod } from '../core/http'

/**
 * 订单API服务
 */
export class ProductService {
    /**
     * 查询关联sku
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_pack_by_sku
    })
    public queryProductPack(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }

    /**
     * 查询sku
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_for_stock_move
    })
    public queryProducForStockMove(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询sku new
     * @param requestParams
     */
    @Request({
        server: ProductController.query_async_product_info
    })
    public queryAsyncProductInfo(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询通用货号
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_common_sku
    })
    public query_all_common_sku(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询基础货号
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_basic_sku
    })
    public query_all_basic_sku(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询组合货号
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_bp_pack
    })
    public query_all_bp_pack(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品详情
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_basic_info
    })
    public query_product_basic_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品extra info
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_extra_value
    })
    public query_product_extra_value(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品物流信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_de_best_logistic_info
    })
    public query_de_best_logistic_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品物流信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_uk_best_logistic_info
    })
    public query_uk_best_logistic_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品库存信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_stock_info
    })
    public query_product_stock_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品库存信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_location_stock_detail
    })
    public query_location_stock_detail(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品库存信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_factory_product_detail
    })
    public query_factory_product_detail(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品库存信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_shipping_product_detail
    })
    public query_shipping_product_detail(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询产品库存信息
     * @param requestParams
     */
    @Request({
        server: ProductController.query_amazon_listing_detail
    })
    public query_amazon_listing_detail(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存产品基础信息
     * @param requestParams
     */
    @Request({
        server: ProductController.save
    })
    public save(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存产品额外信息
     * @param requestParams
     */
    @Request({
        server: ProductController.save_product_extra_value
    })
    public save_product_extra_value(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除产品额外信息
     * @param requestParams
     */
    @Request({
        server: ProductController.delete_extra_value
    })
    public delete_extra_value(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 商品出入库记录
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_stock_operation
    })
    public query_product_stock_operation(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有货号
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_type_sku
    })
    public query_all_type_sku(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询日志
     * @param requestParams
     */
    @Request({
        server: ProductController.query_product_log
    })
    public query_product_log(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询说明书版本
     * @param requestParams
     */
    @Request({
        server: ProductController.query_manual_version
    })
    public query_manual_version(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询说明书
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_product_manual
    })
    public query_all_product_manual(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询配件/B品
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_basic_product_info
    })
    public query_all_basic_product_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *产品常用查询
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_product_template
    })
    public query_all_product_template(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *工艺单查询
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_product_specification
    })
    public query_all_product_specification(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *工艺单版本查询
     * @param requestParams
     */
    @Request({
        server: ProductController.query_specification_version
    })
    public query_specification_version(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *编辑说明书
     * @param requestParams
     */
    @Request({
        server: ProductController.save_prod_manual_info
    })
    public save_prod_manual_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *编辑工艺单
     * @param requestParams
     */
    @Request({
        server: ProductController.save_prod_specification_info
    })
    public save_prod_specification_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除说明书
     * @param requestParams
     */
    @Request({
        server: ProductController.delete_prod_manual_info
    })
    public delete_prod_manual_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除说明书
     * @param requestParams
     */
    @Request({
        server: ProductController.reset_prod_manual_info
    })
    public reset_prod_manual_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除工艺单
     * @param requestParams
     */
    @Request({
        server: ProductController.delete_prod_specification_info
    })
    public delete_prod_specification_info(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *根据条件查询产品出入库记录
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_product_in_out_warehouse
    })
    public query_all_product_in_out_warehouse(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *标记归档
     * @param requestParams
     */
    @Request({
        server: ProductController.merge_inactive
    })
    public mergeInactive(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *还原归档
     * @param requestParams
     */
    @Request({
        server: ProductController.merge_active
    })
    public mergeActive(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *同步通用货号信息
     * @param requestParams
     */
    @Request({
        server: ProductController.synCommonSkuInfo
    })
    public synCommonSkuInfo(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *同步通用货号额外属性
     * @param requestParams
     */
    @Request({
        server: ProductController.synCommonSkuExtraAttributes
    })
    public synCommonSkuExtraAttributes(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *同步组合产品分类数据
     * @param requestParams
     */
    @Request({
        server: ProductController.updatePackProductCategory
    })
    public updatePackProductCategory(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *同步组合产品分类数据
     * @param requestParams
     */
    @Request({
        server: ProductController.queryProductHistoryStock
    })
    public queryProductHistoryStock(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询中文子类
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_sub_category_attributes
    })
    public query_all_sub_category_attributes(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存中文子类属性列表
     * @param requestParams
     */
    @Request({
        server: ProductController.save_sub_category_attributes
    })
    public save_sub_category_attributes(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *query_all_cs_tmp_product_part
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_cs_tmp_product_part
    })
    public query_all_cs_tmp_product_part(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *save_cs_tmp_product_part
     * @param requestParams
     */
    @Request({
        server: ProductController.save_cs_tmp_product_part
    })
    public save_cs_tmp_product_part(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *save_cs_tmp_product_part
     * @param requestParams
     */
    @Request({
        server: ProductController.query_all_for_stock_pack_operation
    })
    public query_all_for_stock_pack_operation(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
