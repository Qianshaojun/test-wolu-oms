export default store => ({
    $hasButtonAuth: function(value) {
        let permissions: any = []
        let menuObj = store.state.buttonAuthInfo.find(
            v => v.menu_code === store.state.menuCode
        )

        if (menuObj && menuObj.exists_authority) {
            permissions = menuObj.button_list.map(v => v.button_name)
        }
        return checkAuthority(value, permissions)
    }
})
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
