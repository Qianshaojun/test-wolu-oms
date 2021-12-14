import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 订单控制器名称
const controller = 'shipment'

/**
 * API接口配置
 * 物流服务配置
 */
export const ShipmentController: ControllerConfig = {
    // 获取物流列表
    query_all_ship_type: {
        controller,
        action: 'query_all_ship_type',
        type: RequestMethod.Post
    },
    save_ship_type: {
        controller,
        action: 'save_ship_type',
        type: RequestMethod.Post
    },
    getSendData: {
        controller,
        action: 'get_shipment_to_email',
        type: RequestMethod.Post
    },
    done_picking_get_shipping_label: {
        controller,
        action: 'done_picking_get_shipping_label',
        type: RequestMethod.Post
    },
    delete_shipment_order: {
        controller,
        action: 'delete_shipment_order',
        type: RequestMethod.Post
    },
    query_all_shipment: {
        controller,
        action: 'query_all_shipment',
        type: RequestMethod.Post        
    }
}
