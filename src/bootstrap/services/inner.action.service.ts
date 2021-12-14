import { ExtendService, RequestParams } from '~/core/http'

export class InnerActionService extends ExtendService {
    private inner_action: String = 'model.function'
    private menu_code: String = 'menu_code'

    constructor(data?: any) {
        super()

        if (data) this.inner_action = data
    }

    public before = params => {
        params.data = {
            ...params.data,
            inner_action: this.inner_action,
            menu_code: this.menu_code
        }
    }

    public after = (data: any, params) => {
        this.inner_action = ''
        this.menu_code = ''
    }

    /**
     * 重置响应接口数据
     */
    public reset() {
        this.inner_action = ''
        this.menu_code = ''
    }

    public setActionAPI(inner_action: String, menu_code: String) {
        this.inner_action = inner_action
        this.menu_code = menu_code
    }
}
