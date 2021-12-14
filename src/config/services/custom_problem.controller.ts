import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'custom_problem'

/**
 * API接口配置
 * 库存服务配置
 */
export const CustomProblemController: ControllerConfig = {
    //
    query: {
        controller,
        action: 'query_all',
        type: RequestMethod.Post
    },
    query_product_drop_list: {
        controller,
        action: 'query_product_drop_list',
        type: RequestMethod.Post
    },
    query_template_product_drop_list: {
        controller,
        action: 'query_template_product_drop_list',
        type: RequestMethod.Post
    },
    save_custom_problem_by_cs: {
        controller,
        action: 'save_custom_problem_by_cs',
        type: RequestMethod.Post
    },
    save_custom_problem_by_rt: {
        controller,
        action: 'save_custom_problem_by_rt',
        type: RequestMethod.Post
    },
    query_cp_reason_enum: {
        controller,
        action: 'query_cp_reason_enum',
        type: RequestMethod.Post
    },
    query_by_order_list: {
        controller,
        action: 'query_by_order_list',
        type: RequestMethod.Post
    },
    batch_in_return_wh: {
        controller,
        action: 'batch_in_return_wh',
        type: RequestMethod.Post
    },
    delete_cp: {
        controller,
        action: 'delete_cp',
        type: RequestMethod.Post
    },
    get_inital_cp: {
        controller,
        action: 'get_inital_cp',
        type: RequestMethod.Post
    },
    create_cp_pic: {
        controller,
        action: 'create_customer_problem_pic',
        type: RequestMethod.Post
    },
    query_all_pic: {
        controller,
        action: 'query_all_pic',
        type: RequestMethod.Post
    },
    query_customer_problem_product: {
        controller,
        action: 'query_customer_problem_product',
        type: RequestMethod.Post
    }
}
