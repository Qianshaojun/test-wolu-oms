import menuResource from '~/assets/json/menu.json'

export default {
    /**
     * 更新用户菜单资源
     * @param state
     * @param rescource
     */
    updateUserMenuResource(state, rescource) {
        state.menuResource = rescource
    },
    updateMenuActive(state, menu) {
        state.menuActive = menu
    },
    updateUserMenu(state, menu_list) {
        const menu = menuResource

        // const action = item => {
        //     if (item.children) {
        //         item.children = item.children.filter(action)
        //     }

        //     //TODO
        //     if (item.role) {
        //         return item.role.includes(role)
        //     } else {
        //         return item
        //     }
        // }

        // state.menuResource = menu.filter(action)
        state.menuResource = menu_list
    },
    updateButtonAuthInfo(state, value) {
        state.buttonAuthInfo = value
    },
    updateMenuCode(state, value) {
        state.menuCode = value
    }
}
