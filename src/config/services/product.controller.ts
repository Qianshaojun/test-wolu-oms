import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'product'

/**
 * API接口配置
 * 产品服务配置
 */
export const ProductController: ControllerConfig = {
    // 关联sku查询
    query_product_pack_by_sku: {
        controller,
        action: 'query_product_pack_by_sku',
        type: RequestMethod.Post
    },
    // 关联sku
    query_all_for_stock_move: {
        controller,
        action: 'query_all_for_stock_move',
        type: RequestMethod.Post
    },
    // 关联sku
    query_async_product_info: {
        controller,
        action: 'query_async_product_info',
        type: RequestMethod.Post
    },
    // 查询通用货号
    query_all_common_sku: {
        controller,
        action: 'query_all_common_sku',
        type: RequestMethod.Post
    },
    // 查询基础货号
    query_all_basic_sku: {
        controller,
        action: 'query_all_basic_sku',
        type: RequestMethod.Post
    },
    // 查询组合货号
    query_all_bp_pack: {
        controller,
        action: 'query_all_bp_pack',
        type: RequestMethod.Post
    },
    // 查询产品详情
    query_product_basic_info: {
        controller,
        action: 'query_product_basic_info',
        type: RequestMethod.Post
    },
    // 查询产品extra info
    query_product_extra_value: {
        controller,
        action: 'query_product_extra_value',
        type: RequestMethod.Post
    },
    // 查询产品shipment info
    query_de_best_logistic_info: {
        controller,
        action: 'query_de_best_logistic_info',
        type: RequestMethod.Post
    },
    // 查询产品shipment info
    query_uk_best_logistic_info: {
        controller,
        action: 'query_uk_best_logistic_info',
        type: RequestMethod.Post
    },
    // 查询产品instock info
    query_product_stock_info: {
        controller,
        action: 'query_product_stock_info',
        type: RequestMethod.Post
    },
    // 查询产品instock info
    query_location_stock_detail: {
        controller,
        action: 'query_location_stock_detail',
        type: RequestMethod.Post
    },
    // 查询产品instock info
    query_factory_product_detail: {
        controller,
        action: 'query_factory_product_detail',
        type: RequestMethod.Post
    },
    // 查询产品instock info
    query_shipping_product_detail: {
        controller,
        action: 'query_shipping_product_detail',
        type: RequestMethod.Post
    },
    // 查询产品instock info
    query_amazon_listing_detail: {
        controller,
        action: 'query_amazon_listing_detail',
        type: RequestMethod.Post
    },
    // 保存产品基础信息
    save: {
        controller,
        action: 'save',
        type: RequestMethod.Post
    },
    // 保存产品额外信息
    save_product_extra_value: {
        controller,
        action: 'save_product_extra_value',
        type: RequestMethod.Post
    },
    // 删除产品额外信息
    delete_extra_value: {
        controller,
        action: 'delete_extra_value',
        type: RequestMethod.Post
    },
    // 商品出入库记录
    query_product_stock_operation: {
        controller,
        action: 'query_product_stock_operation',
        type: RequestMethod.Post
    },
    // 查询所有货号
    query_all_type_sku: {
        controller,
        action: 'query_all_type_sku',
        type: RequestMethod.Post
    },
    // 查询log
    query_product_log: {
        controller,
        action: 'query_product_log',
        type: RequestMethod.Post
    },
    // 查询说明书版本
    query_manual_version: {
        controller,
        action: 'query_manual_version',
        type: RequestMethod.Post
    },
    // 查询说明书
    query_all_product_manual: {
        controller,
        action: 'query_all_product_manual',
        type: RequestMethod.Post
    },
    // 查询配件/B品
    query_all_basic_product_info: {
        controller,
        action: 'query_all_basic_product_info',
        type: RequestMethod.Post
    },
    // 产品常用查询
    query_all_product_template: {
        controller,
        action: 'query_all_product_template',
        type: RequestMethod.Post
    },
    // 工艺单查询
    query_all_product_specification: {
        controller,
        action: 'query_all_product_specification',
        type: RequestMethod.Post
    },
    // 工艺单版本用查询
    query_specification_version: {
        controller,
        action: 'query_specification_version',
        type: RequestMethod.Post
    },
    // 编辑说明书
    save_prod_manual_info: {
        controller,
        action: 'save_prod_manual_info',
        type: RequestMethod.Post
    },
    // 编辑工艺单
    save_prod_specification_info: {
        controller,
        action: 'save_prod_specification_info',
        type: RequestMethod.Post
    },
    // 删除说明书
    delete_prod_manual_info: {
        controller,
        action: 'delete_prod_manual_info',
        type: RequestMethod.Post
    },
    // 删除说明书
    reset_prod_manual_info: {
        controller,
        action: 'reset_prod_manual_info',
        type: RequestMethod.Post
    },
    // 删除工艺单
    delete_prod_specification_info: {
        controller,
        action: 'delete_prod_specification_info',
        type: RequestMethod.Post
    },
    // 根据条件查询产品出入库记录
    query_all_product_in_out_warehouse: {
        controller,
        action: 'query_all_product_in_out_warehouse',
        type: RequestMethod.Post
    },
    // 标记归档
    merge_inactive: {
        controller,
        action: 'merge_inactive',
        type: RequestMethod.Post
    },
    // 还原归档
    merge_active: {
        controller,
        action: 'merge_active',
        type: RequestMethod.Post
    },
    // 同步通用货号信息
    synCommonSkuInfo: {
        controller,
        action: 'syn_common_sku_info',
        type: RequestMethod.Post
    },
    // 同步通用货号额外属性
    synCommonSkuExtraAttributes: {
        controller,
        action: 'syn_common_sku_extra_attributes',
        type: RequestMethod.Post
    },
    // 同步组合产品分类数据
    updatePackProductCategory: {
        controller,
        action: 'update_pack_product_category',
        type: RequestMethod.Post
    },
    // 查询产品历史库存
    queryProductHistoryStock: {
        controller,
        action: 'query_all_product_history_stock',
        type: RequestMethod.Post
    },
    // 查询中文子类
    query_all_sub_category_attributes: {
        controller,
        action: 'query_all_sub_category_attributes',
        type: RequestMethod.Post
    },
    // 保存中文子类属性列表
    save_sub_category_attributes: {
        controller,
        action: 'save_sub_category_attributes',
        type: RequestMethod.Post
    },
    // query_all_cs_tmp_product_part
    query_all_cs_tmp_product_part: {
        controller,
        action: 'query_all_cs_tmp_product_part',
        type: RequestMethod.Post
    },
    // save_cs_tmp_product_part
    save_cs_tmp_product_part: {
        controller,
        action: 'save_cs_tmp_product_part',
        type: RequestMethod.Post
    },
    // save_cs_tmp_product_part
    query_all_for_stock_pack_operation: {
        controller,
        action: 'query_all_for_stock_pack_operation',
        type: RequestMethod.Post
    }
}
