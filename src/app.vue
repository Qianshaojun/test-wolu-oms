<template>
    <a-config-provider :getPopupContainer="getPopupContainer" :locale="locale">
        <main class="full-absolute" ref="main">
            <slot></slot>
        </main>
    </a-config-provider>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { antdLocale } from '~/assets/locale'
import { Mutation, namespace, State } from 'vuex-class'
import { CommonService } from '@/shared/utils/common.service'
import { RequestParams } from '@/core/http'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'
import { LoadingService } from '@/bootstrap/services/loading.service'

const userModule = namespace('userModule')
@Component({
    components: {}
})
export default class App extends Vue {
    @userModule.State
    private dataFormHeight

    @userModule.State
    private menus
    @Mutation('updateMenuCode')
    private updateMenuCode

    private getPopupContainer(el, dialogContext) {
        if (dialogContext) {
            return dialogContext
        } else {
            return document.querySelector('.layout.layout-container')
        }
    }

    private screenHeight: number = document.documentElement.clientHeight
    private timer: boolean = false
    private _timer: number = 0

    private get locale() {
        return antdLocale[this.$app.state.locale].antd
    }

    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private loadingService = new LoadingService()

    private flatMenuList: any = []

    private created() {
        this.getFlatMenuList() //获取展开的菜单
    }

    private getFlatMenuList() {
        if (this.menus) {
            const menus: any[] = this.menus.map(item => {
                let menu: any[] = []
                if (item.children && item.children.length) {
                    menu = item.children.map(x => {
                        let smenu: any[] = []
                        if (x.children && x.children.length) {
                            smenu = x.children.map(y => ({
                                name: y.name,
                                id: y.id
                            }))
                        }
                        smenu.push(x)
                        return smenu
                    })
                }
                menu.push({ name: item.name, id: item.id })

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
            this.flatMenuList = menus.flat(Infinity)
        }
    }

    private getMenuId(to) {
        let code = ''
        let path: any = to.path
        let index = path.lastIndexOf('/')
        path = path.substring(index + 1, path.length)
        let finds = this.flatMenuList.find(x => x.name === path)
        if (finds) {
            code = finds.id
        }
        return code
    }

    private mounted() {
        let _this = this
        this.$nextTick(() => {
            this._timer = setTimeout(() => {
                this.autoCalcHeight()
            })
        })

        window.addEventListener('resize', function() {
            _this.screenHeight = document.documentElement.clientHeight
        })
    }

    private destroyed() {
        window.removeEventListener('resize', this.autoCalcHeight)
        clearTimeout(this._timer)
    }

    // @Mutation('updateActionButtonPromise')
    // updateActionButtonPromise
    // @Mutation('updateButtonAuthInfo')
    // updateButtonAuthInfo

    // private getButtonAuthInfo(menuId) {
    //     let p = new Promise((resolve, reject) => {
    //         //获取按钮权限
    //         this.innerAction.setActionAPI(
    //             'common/query_user_button_authority',
    //             CommonService.getMenuCode('menu-manage')
    //         )
    //         this.publicService
    //             .query(
    //                 new RequestParams(
    //                     { menu_id: menuId },
    //                     {
    //                         loading: this.loadingService,
    //                         innerAction: this.innerAction
    //                     }
    //                 )
    //             )
    //             .subscribe(
    //                 data => {
    //                     resolve(data)
    //                     // this.updateButtonAuthInfo(data)
    //                 },
    //                 err => {
    //                     // reject(err)
    //                     this.$message.error(err.message)
    //                 }
    //             )
    //     })
    //     console.log('ppp', p)
    //     // this.updateButtonAuthInfo(p)
    //     // p.then(res => {
    //     //     console.log('111res', res)
    //     //
    //     // })
    //     this.updateActionButtonPromise(p)
    // }

    private autoCalcHeight() {
        const pageHeader = document.querySelector('.page-header') as HTMLElement //头部标题区域
        const dataForm = document.querySelector('.data-form') as HTMLElement //dataForm 区域
        const autoFlex = document.querySelector('.autoFlex') as HTMLElement //设置了autoFlex类名的区域
        const autoFlexDetail = document.querySelector(
            '.autoFlexDetail'
        ) as HTMLElement //设置了autoFlex类名的区域
        const tableDom = document.querySelector(
            '.ant-table-body'
        ) as HTMLElement //设置了autoFlex类名的区域内的表格

        const fixedTableDom = document.querySelector(
            '.autoFlex .ant-table-body-inner'
        ) as HTMLElement //固定列表格的dom

        const cardTabsDom = document.querySelector('.cardTabs') as HTMLElement //中间tabs高度
        let dataFormHeight: number = 0
        let pageHeaderHeight: number = 0
        if (dataForm) {
            dataFormHeight = dataForm.clientHeight
        }
        if (pageHeader) {
            pageHeaderHeight = pageHeader.clientHeight
        }
        let height = this.screenHeight - dataFormHeight - pageHeaderHeight - 80
        if (autoFlex) {
            if (!autoFlexDetail) {
                if (cardTabsDom) {
                    height -= 25
                }
                autoFlex.style.height = height + 'px'
                if (tableDom) {
                    tableDom.style.maxHeight = height - 120 + 'px' //设置了autoFlex类名的区域内的表格高度
                }
                if (fixedTableDom) {
                    fixedTableDom.style.maxHeight = height - 111 + 'px'
                }
            } else {
                // let detailHeight: any = Math.max(200, Math.ceil(height * 0.3))
                let autoHeight: any = height - 150
                // autoFlexDetail.style.height = detailHeight + 'px'
                autoFlex.style.height = autoHeight + 'px'
                tableDom.style.maxHeight = autoHeight - 120 + 'px'
            }
        }
    }

    @Watch('screenHeight')
    handler(val) {
        if (!this.timer) {
            // 一旦监听到的screenWidth值改变，就将其重新赋给data里的screenHeight
            this.autoCalcHeight()
            this.timer = true
            let that = this
            this._timer = setTimeout(function() {
                that.timer = false
            }, 100)
        }
    }

    @Watch('dataFormHeight')
    heightHandler(val) {
        this.autoCalcHeight()
    }

    @Watch('$route')
    handleRoute(newVal) {
        this.getFlatMenuList()
        let menuId = this.getMenuId(newVal)
        this.updateMenuCode(menuId)
    }
}
</script>

<style>
/*设置全局字体样式*/
* {
    font-size: 13px !important;
}
</style>
