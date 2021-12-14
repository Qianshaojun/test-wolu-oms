import store from '@/store'
import Application from '@/core/application'

/**
 * 菜单转中文
 * @param date
 */
export default function(name): string {
    // 空数据处理
    if (name === null || name === undefined || name === '') {
        return ''
    }

    let ret = Application.i18n.t('menu.' + name).toString()
    let menuArr: any = []

    if (store.state.userModule.menus) {
        const menus: any[] = store.state.userModule.menus.map(item => {
            if (item.children && item.children.length) {
                menu = item.children.map(x => {
                    let smenu: any[] = []
                    if (x.children && x.children.length) {
                        smenu = x.children.map(y => y)
                    }
                    smenu.push(x)
                    return smenu
                })
            }
            menu.push(item)
            let menuTemp: any = []
            for (let i of menu) {
                if (i && i.id) {
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

    let menu = menuArr.find(x => x.name === name)
    if (menu && menu.name_chn) {
        ret = Application.i18n.locale == 'zh-cn' ? menu.name_chn : menu.name
    }

    return ret
}
