import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'seller_instance'

/**
 * API接口配置
 * 产品服务配置
 */
export const SellerInstanceController: ControllerConfig = {
    // 产品查询
    instance_query: {
        controller,
        action: 'query_all_instance',
        type: RequestMethod.Post
    },
    // 产品查询
    seller_query: {
        controller,
        action: 'query_all_seller',
        type: RequestMethod.Post
    },
    // 产品保存
    instance_save: {
        controller,
        action: 'save_instance',
        type: RequestMethod.Post
    },
    // 产品保存
    seller_save: {
        controller,
        action: 'save_seller',
        type: RequestMethod.Post
    },
    // 删除保存
    instance_delete: {
        controller,
        action: 'delete_instance',
        type: RequestMethod.Post
    },
    // 删除保存
    seller_delete: {
        controller,
        action: 'delete_seller',
        type: RequestMethod.Post
    },
    // 删除保存
    responsible_users_query: {
        controller,
        action: 'query_responsible_users',
        type: RequestMethod.Post
    },
    // 删除保存
    seller_query_one: {
        controller,
        action: 'query_one_seller',
        type: RequestMethod.Post
    },
    // 删除保存
    query_user_login: {
        controller,
        action: 'query_user_login',
        type: RequestMethod.Post
    },
    // 删除保存
    get_instance_list_for_view: {
        controller,
        action: 'query_instance_list_for_view',
        type: RequestMethod.Post
    },
    // 删除保存
    query_seller_name: {
        controller,
        action: 'query_seller_list',
        type: RequestMethod.Post
    },
    // 删除保存
    change_seller_status: {
        controller,
        action: 'change_seller_status',
        type: RequestMethod.Post
    },
    // 删除保存
    change_instance_status: {
        controller,
        action: 'change_instance_status',
        type: RequestMethod.Post
    },
    // 店铺下拉列表
    query_odoo_seller_list: {
        controller,
        action: 'query_odoo_seller_list',
        type: RequestMethod.Post
    },
    // 店铺实例下拉列表
    query_odoo_seller_instance_list: {
        controller,
        action: 'query_odoo_seller_instance_list',
        type: RequestMethod.Post
    },
    query_instance_list: {
        controller,
        action: 'query_instance_list',
        type: RequestMethod.Post
    },
    save_seller_api: {
        controller,
        action: 'save_seller_api',
        type: RequestMethod.Post
    },
    query_instance_by_seller_code: {
        controller,
        action: 'query_instance_by_seller_code',
        type: RequestMethod.Post
    }
}
