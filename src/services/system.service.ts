import { Request, RequestParams } from '~/core/http'
import { Observable } from 'rxjs'
import { SystemController } from '@/config/services/system.controller'

/**
 * 权限服务
 */
export class SystemService {
    /**
     * 查询所有系统用户
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_user
    })
    public queryAllUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存系统用户
     * @param requestParams
     */
    @Request({
        server: SystemController.save_user
    })
    public saveUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 禁用系统用户
     * @param requestParams
     */
    @Request({
        server: SystemController.stop_user
    })
    public stopUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改密码
     * @param requestParams
     */
    @Request({
        server: SystemController.change_user_password
    })
    public changeUserPassword(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有系统角色
     * @param requestParams
     */
    @Request({
        server: SystemController.query_system_role
    })
    public queryAllRoles(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有系统角色
     * @param requestParams
     */
    @Request({
        server: SystemController.save_system_role
    })
    public saveRole(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除系统角色
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_system_role
    })
    public deleteRole(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有子系统
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_sub_system
    })
    public queryAllSubSystem(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存子系统
     * @param requestParams
     */
    @Request({
        server: SystemController.save_sub_system
    })
    public saveSubSystem(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除子系统
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_sub_system
    })
    public deleteSubSystem(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有模块
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_system_model
    })
    public queryAllSystemModule(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存模块
     * @param requestParams
     */
    @Request({
        server: SystemController.save_system_model
    })
    public saveModule(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除模块
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_system_model
    })
    public deleteModule(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询所有子模块
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_system_sub_model
    })
    public queryAllSubSystemModule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存子模块
     * @param requestParams
     */
    @Request({
        server: SystemController.save_system_sub_model
    })
    public saveSubModule(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除子模块
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_system_sub_model
    })
    public deleteSubModule(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 给角色添加用户
     * @param requestParams
     */
    @Request({
        server: SystemController.create_role_user_rel
    })
    public addRoleUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询角色对应的用户
     * @param requestParams
     */
    @Request({
        server: SystemController.query_user_by_role_code
    })
    public queryRoleUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 删除系统角色对应的用户
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_role_user_rel
    })
    public deleteRoleUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询角色可以添加的用户
     * @param requestParams
     */
    @Request({
        server: SystemController.query_role_need_add_user
    })
    public queryRoleNeedAddUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询角色已添加的菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.query_menu_by_role_code
    })
    public queryMenuByRole(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除角色中的菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_role_menu_rel
    })
    public deleteRoleMenuRel(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询角色可添加的菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.query_role_need_add_menu
    })
    public queryRoleNeedAddMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *角色添加菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.create_role_menu_rel
    })
    public addRoleMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_system_menu
    })
    public queryAllMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.save_system_menu
    })
    public saveSystemMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除菜单接口
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_system_menu
    })
    public deleteSystemMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *添加用户菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.add_user_menu
    })
    public addUserMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *删除用户菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_user_menu
    })
    public deleteUserMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *根据用户查询菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.query_menu_by_user
    })
    public queryMenuByUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *根据角色用户查询菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.query_menu_by_role_user
    })
    public queryMenuByRoleUser(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存子用户菜单
     * @param requestParams
     */
    @Request({
        server: SystemController.add_sub_account_menu
    })
    public addSubAccountMenu(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *根据客户ID查询公告
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_user_notice
    })
    public queryAllUserNotice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *保存公告
     * @param requestParams
     */
    @Request({
        server: SystemController.save_notice
    })
    public saveNotice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询单个公告
     * @param requestParams
     */
    @Request({
        server: SystemController.query_one_notice
    })
    public queryOneNotice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *废除公告
     * @param requestParams
     */
    @Request({
        server: SystemController.discard_notice
    })
    public discardNotice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *审核公告
     * @param requestParams
     */
    @Request({
        server: SystemController.approve_notice
    })
    public approveNotice(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询某菜单的所有查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.query_search_condition_by_menu_code
    })
    public querySearchConditionByMenuCode(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询某菜单的固定查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.query_fixed_search_condition_by_menu_code
    })
    public queryFixedSearchConditionByMenuCode(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询某菜单的所有查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.batch_create_search_condition
    })
    public batchCreateSearchCondition(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *单删查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.delete_one_search_condition
    })
    public DeleteOneSearchCondition(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *创建单个查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.create_search_condition
    })
    public CreateSearchCondition(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     *查询某菜单的所有查询条件
     * @param requestParams
     */
    @Request({
        server: SystemController.query_user_search_condition
    })
    public queryUserSearchCondition(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改登录者密码
     * @param requestParams
     */
    @Request({
        server: SystemController.change_own_password
    })
    public changeOwnPassword(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询汇率
     * @param requestParams
     */
    @Request({
        server: SystemController.queryCurrencyChange
    })
    public queryCurrencyChange(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 接口列表管理
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_system_api
    })
    public query_all_system_api(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存接口列表
     * @param requestParams
     */
    @Request({
        server: SystemController.save_system_api
    })
    public save_system_api(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改接口列表激活状态
     * @param requestParams
     */
    @Request({
        server: SystemController.active_system_api
    })
    public active_system_api(requestParams: RequestParams): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询行数据访问规则
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_data_access_rule
    })
    public query_all_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存行数据访问规则
     * @param requestParams
     */
    @Request({
        server: SystemController.save_data_access_rule
    })
    public save_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改行数据访问规则状态
     * @param requestParams
     */
    @Request({
        server: SystemController.active_data_access_rule
    })
    public active_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 查询站点数据访问规则
     * @param requestParams
     */
    @Request({
        server: SystemController.query_all_host_data_access_rule
    })
    public query_all_host_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 保存站点数据访问规则
     * @param requestParams
     */
    @Request({
        server: SystemController.save_host_data_access_rule
    })
    public save_host_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 修改站点数据访问规则状态
     * @param requestParams
     */
    @Request({
        server: SystemController.active_host_data_access_rule
    })
    public active_host_data_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 更新角色菜单数据访问规则接口
     * @param requestParams
     */
    @Request({
        server: SystemController.update_role_menu_access_rule
    })
    public update_role_menu_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
    /**
     * 更新用户菜单数据访问规则接口
     * @param requestParams
     */
    @Request({
        server: SystemController.update_user_menu_access_rule
    })
    public update_user_menu_access_rule(
        requestParams: RequestParams
    ): Observable<any> {
        return requestParams.request()
    }
}
