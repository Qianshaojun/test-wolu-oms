import { ApplicationStore } from '@/core/application_store'

export default store => {
    /**
     * v-Auth 按钮权限控制
     */

    return {
        bind(el, binding) {
            // let spanNode = document.createElement('span')
            // setButtonName(el, binding, store, spanNode)
        },
        inserted(el, binding) {
            // 获取绑定的权限值
            const authCode = binding.value
            if (!authCode) {
                return
            }
            let permissions: any = []
            let menuObj = store.state.buttonAuthInfo.find(
                v => v.menu_code === store.state.menuCode
            )

            if (menuObj && menuObj.exists_authority) {
                permissions = menuObj.button_list.map(v => v.button_name)
            }

            let hasPermission = checkAuthority(authCode, permissions)

            if (!hasPermission) {
                if (el.parentNode) {
                    el.parentNode.removeChild(el)
                }
            }
        },
        componentUpdated(el, binding) {
            // let spanNode = document.createElement('span')
            // setButtonName(el, binding, store, spanNode)
        }
    }
}
//校验按钮权限
let checkAuthority = function(permissionCode, permissions) {
    let hasPermission: boolean = true
    if (permissionCode) {
        //区分指令绑定的是单个或多个权限
        if (permissionCode instanceof Array && permissionCode.length > 0) {
            hasPermission = permissions.some(it => permissionCode.includes(it))
        } else {
            hasPermission = permissions.some(item => item === permissionCode)
        }
    }
    return hasPermission
}

//设置按钮名称
let setButtonName = function(el, binding, store, node) {
    let local = ApplicationStore.getStore().state.locale //获取当前语言
    let menuObj = store.state.buttonAuthInfo.find(
        v => v.menu_code === store.state.menuCode
    )
    let hasSetAuthButtonInfo: any = {}
    if (menuObj) {
        if (menuObj.exists_authority) {
            hasSetAuthButtonInfo = menuObj.button_list.find(
                v => v.button_name === binding.value
            )
        }
        if (
            el &&
            hasSetAuthButtonInfo &&
            JSON.stringify(hasSetAuthButtonInfo) != '{}'
        ) {
            let buttonName = `${
                local === 'zh-cn'
                    ? hasSetAuthButtonInfo.button_name_cn
                    : hasSetAuthButtonInfo.button_name_en
            }`
            node.innerText = buttonName
            if (el.children.length) {
                el.replaceChild(node, el.children[0])
            }
        }
    }
}
