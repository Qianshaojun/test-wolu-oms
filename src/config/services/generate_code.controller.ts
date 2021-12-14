import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'code_generate'

/**
 * API接口配置
 * 订单服务配置
 */
export const GenerateCodeController: ControllerConfig = {
    // 根据组名查询所有code, name
    query_all_code_list: {
        controller,
        action: 'query_all_code_list',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    query_select_code: {
        controller,
        action: 'query_select_code',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    create_product_generate_code: {
        controller,
        action: 'create_product_generate_code',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    create_mix_product_generate_code: {
        controller,
        action: 'create_mix_product_generate_code',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    import_create_generate_code: {
        controller,
        action: 'import_create_generate_code',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    query_category_list: {
        controller,
        action: 'query_category_list',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    query_color_list: {
        controller,
        action: 'query_color_list',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    delete_code: {
        controller,
        action: 'delete_code',
        type: RequestMethod.Post
    }
}
