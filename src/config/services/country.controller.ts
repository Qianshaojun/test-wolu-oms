import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'country'

/**
 * API接口配置
 * 订单服务配置
 */
export const CountryController: ControllerConfig = {
    // 获取国家列表
    getList: {
        controller,
        action: 'id_all',
        type: RequestMethod.Post
    },
    getListByISOCode2: {
        controller,
        action: 'iso_code_2_all',
        type: RequestMethod.Post
    }
}
