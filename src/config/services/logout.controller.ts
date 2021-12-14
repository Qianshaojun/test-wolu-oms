import { RequestMethod } from '../../core/http'

import { ControllerConfig } from '~/config/type.config'

// 控制器名称
const controller = 'wms'

/**
 * API接口配置
 */
export const LogoutController: ControllerConfig = {
    // 退出登录
    logout: {
        controller,
        action: 'session/logout',
        type: RequestMethod.Post
    }
}
