import { ExtendService, RequestParams } from '~/core/http'
import store from '~/store'
import { WmsController } from '@/config/services/wms.controller'
import moment from 'moment'

const whitelist = [WmsController.login]

export class TokenService extends ExtendService {
    public before = params => {
        const { userModule } = store.state as any

        if (!userModule.token) {
            return
        }

        params.options.header = params.options.header || {}
        params.options.header['csrf_token'] = userModule.token

        if(localStorage.getItem('session_expires')){
            const session_expires = localStorage.getItem(
                'session_expires'
            ) as any
            const now = moment().format()
            if (now>session_expires){
                params.options.header['is_expires'] = true
                localStorage.removeItem('session_expires')
            }else{
                params.options.header['is_expires'] = false
            }
        }else{
            params.options.header['is_expires'] = false
        }
        if (localStorage.getItem('session_id')) {
            params.options.header['customer_key'] = localStorage.getItem(
                'session_id'
            )
        }

        params.options.query = Object.assign(params.options.query || {}, {
            csrf_token: userModule.token,
            customer_key: localStorage.getItem('session_id')
        })
    }

    private getCookies() {
        var ca = document.cookie.split(';')

        var name = 'session_id='
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i]
            while (c.charAt(0) == ' ') c = c.substring(1)
            if (c.indexOf(name) != -1) {
                let r = c.split('=')[1]
                return r
            }
        }
        return false
    }
}
