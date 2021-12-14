import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'general_code'

/**
 * API接口配置
 * 订单服务配置
 */
export const GeneralCodeController: ControllerConfig = {
    // 根据组名查询所有code, name
    queryShipType: {
        controller,
        action: 'query_ship_type',
        type: RequestMethod.Post
    },
    // 根据组名查询所有code, name
    queryMvShipType: {
        controller,
        action: 'query_mv_ship_type',
        type: RequestMethod.Post
    }
}
