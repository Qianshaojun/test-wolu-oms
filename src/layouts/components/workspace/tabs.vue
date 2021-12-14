<template>
    <section class="layout-component tabs full-absolute">
        <a-tabs
            :active-key="activeKey"
            :hide-add="true"
            type="editable-card"
            @change="changePage"
            @edit="editPage"
        >
            <a-tab-pane
                :id="page.name"
                :key="page.name"
                v-for="page in pageList"
                :closable="page.name !== 'workspace'"
            >
                <template v-slot:tab>
                    <span :pagekey="page.name">
                        <span v-if="page.params && page.params.id">
                            {{ page.title }}
                        </span>
                        <span v-else>
                            {{ page.name | menutochn }}
                        </span>
                    </span>
                </template>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { namespace } from 'vuex-class'
import store from '@/store'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Component({
    components: {}
})
export default class Tabs extends Vue {
    // 页面列表
    private pageList: any[] = []
    // // 当前页面
    private activeKey: any = ''

    @datasModule.State
    private pickingNeedSave

    @datasModule.Mutation
    private setPickingSaveStatus

    @datasModule.State
    private titleSuffix

    @datasModule.Action
    private getTitleSuffix

    @pageParamsModule.State
    private commonPageInfo

    @pageParamsModule.Mutation
    private resetCommonPageInfo

    private created() {
        this.getTitleSuffix()
        this.setPickingSaveStatus('')
        if (this.$route && this.$route.name) {
            this.pageList.push(this.$route)
            this.$app.store.commit('pushTab', {
                title: this.$route.name,
                name: this.$route.name,
                path: this.$route.path,
                params: this.$route.params,
                query: this.$route.query
            })
        }
    }

    private mounted() {
        this.activeKey = this.currentTab.title
    }

    private get tabs() {
        return this.$app.store.state.tabs
    }

    private get currentTab() {
        return this.$app.store.state.currentTab
    }

    /**
     * 更新tabs列表
     */
    @Watch('pageList')
    private onPageListChange(list) {
        if (!list.find(i => i.name === 'workspace')) {
            list.unshift({
                name: 'workspace'
            })
        }
        this.$app.store.commit(
            'updateTabs',
            list.map(x => x.name)
        )
    }

    /**
     * 监听路由改变
     */
    @Watch('$route')
    onRouteChange(newRoute, oldRoute) {
        let name = newRoute.name
        let title = newRoute.name
        if (newRoute.params && newRoute.params.id) {
            name = name + newRoute.params.id
            title = newRoute.params.name
                ? newRoute.params.name
                : newRoute.query.name
                ? newRoute.query.name
                : this.$t(`menu.${title}`) + newRoute.params.id
        }

        let newItem = {
            title: title,
            name: name,
            path: newRoute.path,
            params: newRoute.params,
            query: newRoute.query
        }

        this.$app.store.commit('pushTab', newItem)

        // let useChange = 0

        const page = this.pageList.find(x => x.name === name)
        if (!page) {
            this.pageList.push(newItem)
            // useChange = 1
        }

        // if (name.indexOf('picking-detail') === 0 && useChange) {
        //     if (
        //         this.tabs.find(
        //             x => x.name == 'picking-manage' || x == 'picking-manage'
        //         )
        //     ) {
        //         this.$router.push({
        //             name: 'picking-manage'
        //         })
        //     } else {
        //         this.activeKey = name
        //     }
        // } else {
        this.activeKey = name
        // }

        this.setDocTitle()
    }

    private setDocTitle() {
        let path: any = this.$route.path
        let name: any = this.$route.params.name
        let index = path.lastIndexOf('/')
        let name_eng = path.substring(index + 1, path.length)
        let reg = /^[0-9]*$/
        if (reg.test(name_eng)) {
            let tmpl_path = path.substring(0, index)
            index = tmpl_path.lastIndexOf('/', index)
            name_eng = path.substring(index + 1, path.length)
        }
        let name_chn: any = ''
        if (store.state.userModule.menus && !name) {
            store.state.userModule.menus.map(item => {
                if (item.children && item.children.length) {
                    item.children.map(x => {
                        if (x.children && x.children.length) {
                            let exist = x.children.find(y => y.name == name_eng)
                            if (exist) {
                                name_chn = exist.name_chn
                            }
                        } else {
                            if (x.name == name_eng) {
                                name_chn = x.name_chn
                            }
                        }
                    })
                } else {
                    if (item.name == name_eng) {
                        name_chn = item.name_chn
                    }
                }
            })
        } else {
            name_chn = name
            name_eng = 'Detail'
        }
        let docu: any = document
        name_chn = name_chn ? name_chn : name_eng
        if (name_chn === 'workspace') {
            name_chn = '工作区'
            name_eng = 'workspace'
        }
        let title = this.$app.state.locale == 'zh-cn' ? name_chn : name_eng
        if (title == '') {
            docu.title = this.titleSuffix
        } else {
            docu.title = title + ' - ' + this.titleSuffix
        }
    }

    /**
     * 监听激活页面改变
     */
    // @Watch('currentTab')
    // onCurrentTabChange(newTab, oldTab) {
    //     // const name = newTab.query.$name || newTab.name
    //     let name = newTab.name
    //     if (newTab.params.id) {
    //         name = name + newTab.params.id
    //     }
    //     if (this.$route.name !== newTab.name) {
    //         this.$router.push({
    //             path: newTab.path,
    //             params: newTab.params
    //         })
    //     }
    // }

    /**
     * 监听激活页面改变
     */
    @Watch('activeKey')
    async onActiveKeyChange(newName, oldName) {
        let dft: any = ''
        if (
            oldName.indexOf('picking-detail') === 0 &&
            newName.indexOf('picking-detail') === -1 &&
            this.pickingNeedSave !== ''
        ) {
            const result = await new Promise((reslove, reject) => {
                this.$confirm({
                    parentContext: dft,
                    title: '切换页面后表单中未保存的内容将丢失，确定要切换吗？',
                    onOk: () => reslove(true),
                    onCancel: () => reslove(false)
                })
            })
            if (!result) {
                this.activeKey = oldName
                return
            } else {
                this.setPickingSaveStatus('')
            }
        }
        if (
            oldName.indexOf('common-page') === 0 &&
            newName.indexOf('common-page') === -1
        ) {
            let pageId = oldName.substr(11)
            let pageInfo = this.commonPageInfo.find(x => x.index == pageId)
            if (pageInfo && pageInfo.edit) {
                const result = await new Promise((reslove, reject) => {
                    this.$confirm({
                        parentContext: dft,
                        title:
                            '切换页面后表单中未保存的内容将丢失，确定要切换吗？',
                        onOk: () => reslove(true),
                        onCancel: () => reslove(false)
                    })
                })
                if (!result) {
                    this.activeKey = oldName
                    return
                }
            }
        }
        if (newName && this.$route.name !== newName) {
            const page = this.pageList.find(x => x.name === newName)
            if (page) {
                if (page.params) {
                    this.$router.push({
                        path: page.path + '?name=' + page.params.name,
                        params: page.params
                    })
                } else {
                    this.$router.push({
                        name: newName
                    })
                }
            }
        }
    }

    /**
     * 页面改变
     */
    private changePage(key) {
        this.activeKey = key
    }

    /**
     * 页面操作
     */
    private editPage(key, action) {
        this[action](key)
    }

    /**
     * 关闭标签页
     */
    private async remove(name) {
        //关闭时需要提醒的页面
        let pageArr = [
            'customer-edit',
            'order-edit',
            'transfer-edit',
            'product-edit'
        ]
        let dft: any = ''
        if (pageArr.includes(name)) {
            const result = await new Promise((reslove, reject) => {
                this.$confirm({
                    parentContext: dft,
                    title: '确定要关闭吗？',
                    onOk: () => reslove(true),
                    onCancel: () => reslove(false)
                })
            })
            if (!result) {
                return
            }
        }

        if (name.substr(0, 11) == 'common-page') {
            let id = name.substr(11)
            let newParams = this.commonPageInfo.filter(x => x.index != id)
            this.resetCommonPageInfo(newParams)
        }

        if (
            name.indexOf('picking-detail') === 0 &&
            this.pickingNeedSave !== '' &&
            this.pickingNeedSave.indexOf(
                'p-' + name.replace('picking-detail', '')
            ) >= 0
        ) {
            const result = await new Promise((reslove, reject) => {
                this.$confirm({
                    parentContext: dft,
                    title: '关闭页面后表单中未保存的内容将丢失，确定要关闭吗？',
                    onOk: () => reslove(true),
                    onCancel: () => reslove(false)
                })
            })
            if (!result) {
                return
            } else {
                this.setPickingSaveStatus(
                    this.pickingNeedSave.replace(
                        'p-' + name.replace('picking-detail', ''),
                        ''
                    )
                )
            }
        }

        this.$app.store.commit('closeTab', {
            name
        })

        let index = this.pageList.findIndex(item => item.name === name)
        this.pageList = this.pageList.filter(item => item.name !== name)

        index = index >= this.pageList.length ? this.pageList.length - 1 : index
        this.activeKey = this.pageList[index].name
    }
}
</script>
<style lang="less" scoped>
.layout-component.tabs {
    padding: 3px 2px 0;
    margin: 0 7px;
}
</style>