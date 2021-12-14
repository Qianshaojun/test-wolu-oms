import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'general'

/**
 * API接口配置
 * 订单服务配置
 */
export const GeneralController: ControllerConfig = {
    // 根据组名查询所有code, name
    query_picking_need_resend: {
        controller,
        action: 'query_picking_need_resend',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    queryLangList: {
        controller,
        action: 'query_lang_list',
        type: RequestMethod.Post
    },
    // 查询表对应的所有列
    query_table_schema: {
        controller,
        action: 'query_table_schema',
        type: RequestMethod.Post
    },
    // 查询表对应的所有模板
    query_table_schema_export_template: {
        controller,
        action: 'query_table_schema_export_template',
        type: RequestMethod.Post
    },
    // 导出模板对应的列
    query_table_schema_export_template_column: {
        controller,
        action: 'query_table_schema_export_template_column',
        type: RequestMethod.Post
    },
    // 保存导出模板
    save_table_schema_export_template: {
        controller,
        action: 'save_table_schema_export_template',
        type: RequestMethod.Post
    },
    // 删除导出模板
    delete_table_schema_export_template: {
        controller,
        action: 'delete_table_schema_export_template',
        type: RequestMethod.Post
    }
}
