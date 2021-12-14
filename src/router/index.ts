import Router from 'vue-router'
import MobileDetect from 'mobile-detect'
// import OrderWrapper from '@/pages/orders/order-wrapper.vue'
// import PickingWrapper from '@/pages/picking/picking-wrapper.vue'
// import ProductWrapper from '@/pages/product/product-wrapper.vue'
// import PresaleWrapper from '@/pages/presale/presale-wrapper.vue'
// import VendorWrapper from '@/pages/purchase/vendor-wrapper.vue'
// import CommonWrapper from '@/pages/common/page-wrapper.vue'
// import ListPageWrapper from '@/pages/common/list-page-wrapper.vue'
// import SwapWrapper from '@/pages/common/swap-wrapper.vue'

// 首页入口
const home = {
    mobile: '/mobile/dashboard',
    pc: '/dashboard/workspace'
}

const originalPush: any = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
}

export default new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect: () => {
                const detect = new MobileDetect(navigator.userAgent)
                const device = detect.mobile() ? 'mobile' : 'pc'
                return home[device]
            }
        },
        {
            name: 'user-order',
            path: '/order/user-order/:id/:name',
            component: resolve =>
                require(['@/pages/orders/order-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'picking-detail',
            path: '/picking/picking-detail/:id/:name',
            component: resolve =>
                require(['@/pages/picking/picking-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'product-detail',
            path: '/product/product-detail/:id/:name',
            component: resolve =>
                require(['@/pages/product/product-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'vendor-detail-multi',
            path: '/purchase/vendor-detail-multi/:id/:name',
            component: resolve =>
                require(['@/pages/purchase/vendor-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'presale-detail',
            path: '/presale/presale-detail/:id/:name',
            component: resolve =>
                require(['@/pages/presale/presale-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'common-page',
            path: '/common/common-page/:id/:name',
            component: resolve =>
                require(['@/pages/common/page-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'swap-page',
            path: '/common/swap-page/:id/:name',
            component: resolve =>
                require(['@/pages/common/swap-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'list-page',
            path: '/common/list-page/:id/:name',
            component: resolve =>
                require(['@/pages/common/list-page-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'sent-email-detail',
            path: '/common/sent-email-detail/:id/:name',
            component: resolve =>
                require(['@/pages/common/sent-email-wrapper.vue'], resolve),
            props: true
        },
        {
            name: 'depo-detail',
            path: '/purchase/depo-detail/:id/:name',
            component: resolve =>
                require(['@/pages/purchase/depo-wrapper.vue'], resolve),
            props: true
        },
        {
            path: '*',
            redirect: '/exception/404'
        }
    ]
})
