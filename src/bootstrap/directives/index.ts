import Auth from './auth'
import Focus from './focus'

export default (store: any) => {
    return {
        /**
         * 资源认证
         */
        auth: Auth(store),
        focus: Focus(store)
    }
}
