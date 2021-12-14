import { ApplicationRouter } from '@/core/application_router'
import MobileDetect from 'mobile-detect'

// 认证白名单
const authWhiteList = ['login', 'login-mobile']

// 认证状态检测
const authCheck = (store, toname) => {
    let menuArr: any = []

    if (store.state.userModule.menus) {
        const menus: any[] = store.state.userModule.menus.map(item => {
            let menu: any[] = []

            if (item.children && item.children.length) {
                menu = item.children.map(x => {
                    let smenu: any[] = []
                    if (x.children && x.children.length) {
                        smenu = x.children.map(y => y.name)
                    }
                    smenu.push(x.name)
                    return smenu
                })
            }
            menu.push(item.name)
            let menuTemp: any = []
            for (let i of menu) {
                if (typeof i == 'string') {
                    menuTemp.push(i)
                } else {
                    for (let k of i) {
                        menuTemp.push(k)
                    }
                }
            }

            return menuTemp
        })
        menuArr = [].concat.apply([], menus)
    }

    // menuArr.push('user-order')
    // menuArr.push('picking-detail')
    // menuArr.push('product-detail')
    // menuArr.push('presale-detail')
    // menuArr.push('vendor-detail-multi')
    // // menuArr.push('purchase-contract-edit')
    // // menuArr.push('purchase-package-edit')
    // menuArr.push('common-page')
    // menuArr.push('swap-page')
    // menuArr.push('list-page')
    // menuArr.push('sent-email-detail')
    // menuArr.push('depo-detail')
    let detailRouteName: string[] = [
        'user-order',
        'picking-detail',
        'product-detail',
        'presale-detail',
        'vendor-detail-multi',
        'common-page',
        'swap-page',
        'list-page',
        'sent-email-detail',
        'depo-detail'
    ]
    menuArr.push(...detailRouteName)
    return (
        !!store.state.userModule.username &&
        (toname === 'workspace' || menuArr.includes(toname))
    )
}

/**
 * 安装认证守卫
 */
function installAuthGuard() {
    ApplicationRouter.registerGuard(({ store, router }, { to, from, next }) => {
        // 认证白名单
        if (authWhiteList.includes(to.name)) {
            return true
        }

        // 认证检测
        if (!authCheck(store, to.name)) {
            const detect = new MobileDetect(navigator.userAgent)
            const isMobile = !!detect.mobile()
            return {
                name: isMobile ? 'login-mobile' : 'login'
            }
        }
    })
}

export default function() {
    // 安装认证守卫
    installAuthGuard()
}
