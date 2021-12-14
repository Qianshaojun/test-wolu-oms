import { RequestMethod } from '../../core/http'
import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'vendor'

/**
 * API接口配置
 * 客户服务配置
 */
export const VendorController: ControllerConfig = {
    // 查询活动的供应商简称
    get_vendor_ref_list: {
        controller,
        action: 'get_vendor_ref_list',
        type: RequestMethod.Post
    },
    save_vendor: {
        controller,
        action: 'save_vendor',
        type: RequestMethod.Post
    }
}
