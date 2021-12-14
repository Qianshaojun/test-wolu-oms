import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 权限控制器名称
const controller = 'system'

/**
 * API接口配置
 * 权限服务配置
 */
export const SystemController: ControllerConfig = {
    // 获取用户列表
    query_all_user: {
        controller,
        action: 'query_all_user',
        type: RequestMethod.Post
    },
    // 保存用户
    save_user: {
        controller,
        action: 'save_user',
        type: RequestMethod.Post
    },
    // 禁用用户
    stop_user: {
        controller,
        action: 'stop_user',
        type: RequestMethod.Post
    },
    // 修改用户密码
    change_user_password: {
        controller,
        action: 'change_user_password',
        type: RequestMethod.Post
    },
    // 获取所有角色
    query_system_role: {
        controller,
        action: 'query_system_role',
        type: RequestMethod.Post
    },
    // 保存角色
    save_system_role: {
        controller,
        action: 'save_system_role',
        type: RequestMethod.Post
    },
    // 删除角色
    delete_system_role: {
        controller,
        action: 'delete_system_role',
        type: RequestMethod.Post
    },
    // 子系统查询
    query_all_sub_system: {
        controller,
        action: 'query_all_sub_system',
        type: RequestMethod.Post
    },
    // 保存子系统
    save_sub_system: {
        controller,
        action: 'save_sub_system',
        type: RequestMethod.Post
    },
    // 删除子系统
    delete_sub_system: {
        controller,
        action: 'delete_sub_system',
        type: RequestMethod.Post
    },
    // 查询所有模块
    query_all_system_model: {
        controller,
        action: 'query_all_system_model',
        type: RequestMethod.Post
    },
    // 保存模块
    save_system_model: {
        controller,
        action: 'save_system_model',
        type: RequestMethod.Post
    },
    // 删除模块
    delete_system_model: {
        controller,
        action: 'delete_system_model',
        type: RequestMethod.Post
    },
    // 查询所有子模块
    query_all_system_sub_model: {
        controller,
        action: 'query_all_system_sub_model',
        type: RequestMethod.Post
    },
    // 保存子模块
    save_system_sub_model: {
        controller,
        action: 'save_system_sub_model',
        type: RequestMethod.Post
    },
    // 保存子模块
    delete_system_sub_model: {
        controller,
        action: 'delete_system_sub_model',
        type: RequestMethod.Post
    },
    // 给角色添加用户
    create_role_user_rel: {
        controller,
        action: 'create_role_user_rel',
        type: RequestMethod.Post
    },
    // 查询角色对应的用户
    query_user_by_role_code: {
        controller,
        action: 'query_user_by_role_code',
        type: RequestMethod.Post
    },
    // 删除系统角色对应的用户
    delete_role_user_rel: {
        controller,
        action: 'delete_role_user_rel',
        type: RequestMethod.Post
    },
    // 查询角色可以添加的用户
    query_role_need_add_user: {
        controller,
        action: 'query_role_need_add_user',
        type: RequestMethod.Post
    },
    // 查询角色已添加的菜单
    query_menu_by_role_code: {
        controller,
        action: 'query_menu_by_role_code',
        type: RequestMethod.Post
    },
    // 删除角色中的菜单接口
    delete_role_menu_rel: {
        controller,
        action: 'delete_role_menu_rel',
        type: RequestMethod.Post
    },
    // 查询角色可添加的菜单接口
    query_role_need_add_menu: {
        controller,
        action: 'query_role_need_add_menu',
        type: RequestMethod.Post
    },
    // 角色添加菜单接口
    create_role_menu_rel: {
        controller,
        action: 'create_role_menu_rel',
        type: RequestMethod.Post
    },
    // 查询菜单接口
    query_all_system_menu: {
        controller,
        action: 'query_all_system_menu',
        type: RequestMethod.Post
    },
    // 保存菜单接口
    save_system_menu: {
        controller,
        action: 'save_system_menu',
        type: RequestMethod.Post
    },
    // 删除菜单接口
    delete_system_menu: {
        controller,
        action: 'delete_system_menu',
        type: RequestMethod.Post
    },
    // 添加用户菜单
    add_user_menu: {
        controller,
        action: 'add_user_menu',
        type: RequestMethod.Post
    },
    // 删除用户菜单
    delete_user_menu: {
        controller,
        action: 'delete_user_menu',
        type: RequestMethod.Post
    },
    // 查询用户菜单
    query_menu_by_user: {
        controller,
        action: 'query_menu_by_user',
        type: RequestMethod.Post
    },
    // 查询角色用户菜单
    query_menu_by_role_user: {
        controller,
        action: 'query_menu_by_role_user',
        type: RequestMethod.Post
    },
    // 保存子用户菜单
    add_sub_account_menu: {
        controller,
        action: 'add_sub_account_menu',
        type: RequestMethod.Post
    },
    // 根据客户ID查询公告
    query_all_user_notice: {
        controller,
        action: 'query_all_user_notice',
        type: RequestMethod.Post
    },
    // 保存公告
    save_notice: {
        controller,
        action: 'save_notice',
        type: RequestMethod.Post
    },
    // 查询单个公告
    query_one_notice: {
        controller,
        action: 'query_one_notice',
        type: RequestMethod.Post
    },
    // 废除公告
    discard_notice: {
        controller,
        action: 'discard_notice',
        type: RequestMethod.Post
    },
    // 审核公告
    approve_notice: {
        controller,
        action: 'approve_notice',
        type: RequestMethod.Post
    },
    // 查询某菜单的固定查询条件
    query_fixed_search_condition_by_menu_code: {
        controller,
        action: 'query_fixed_search_condition_by_menu_code',
        type: RequestMethod.Post
    },
    // 查询某菜单的所有查询条件
    query_search_condition_by_menu_code: {
        controller,
        action: 'query_search_condition_by_menu_code',
        type: RequestMethod.Post
    },
    // 保存某菜单的所有查询条件
    batch_create_search_condition: {
        controller,
        action: 'batch_create_search_condition',
        type: RequestMethod.Post
    },
    // 单删查询条件
    delete_one_search_condition: {
        controller,
        action: 'delete_one_search_condition',
        type: RequestMethod.Post
    },
    // 创建单个查询条件
    create_search_condition: {
        controller,
        action: 'create_search_condition',
        type: RequestMethod.Post
    },
    // 查询某菜单下用户查询条件接口
    query_user_search_condition: {
        controller,
        action: 'query_user_search_condition',
        type: RequestMethod.Post
    },
    // 修改登录者密码
    change_own_password: {
        controller,
        action: 'change_owner_password',
        type: RequestMethod.Post
    },
    // 查询汇率
    queryCurrencyChange: {
        controller,
        action: 'query_all_currency_exchange',
        type: RequestMethod.Post
    },
    // 接口列表管理
    query_all_system_api: {
        controller,
        action: 'query_all_system_api',
        type: RequestMethod.Post
    },
    // 保存接口列表
    save_system_api: {
        controller,
        action: 'save_system_api',
        type: RequestMethod.Post
    },
    // 修改接口列表激活状态
    active_system_api: {
        controller,
        action: 'active_system_api',
        type: RequestMethod.Post
    },
    // 查询行数据访问规则
    query_all_data_access_rule: {
        controller,
        action: 'query_all_data_access_rule',
        type: RequestMethod.Post
    },
    // 保存行数据访问规则
    save_data_access_rule: {
        controller,
        action: 'save_data_access_rule',
        type: RequestMethod.Post
    },
    // 修改行数据访问规则状态
    active_data_access_rule: {
        controller,
        action: 'active_data_access_rule',
        type: RequestMethod.Post
    },
    // 查询站点数据访问规则
    query_all_host_data_access_rule: {
        controller,
        action: 'query_all_host_data_access_rule',
        type: RequestMethod.Post
    },
    // 保存站点数据访问规则
    save_host_data_access_rule: {
        controller,
        action: 'save_host_data_access_rule',
        type: RequestMethod.Post
    },
    // 修改站点数据访问规则状态
    active_host_data_access_rule: {
        controller,
        action: 'active_host_data_access_rule',
        type: RequestMethod.Post
    },
    // 更新角色菜单数据访问规则接口
    update_role_menu_access_rule: {
        controller,
        action: 'update_role_menu_access_rule',
        type: RequestMethod.Post
    },
    // 更新用户菜单数据访问规则接口
    update_user_menu_access_rule: {
        controller,
        action: 'update_user_menu_access_rule',
        type: RequestMethod.Post
    }
}
