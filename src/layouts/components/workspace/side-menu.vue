<template>
    <section
        class="layout-component side-menu full-absolute"
        style="overflow-y:auto;overflow-x:hidden;"
    >
        <a-menu
            mode="inline"
            :inlineCollapsed="collapsed"
            :defaultSelectedKeys="current"
            :selectedKeys="current"
            :openKeys="openKeys"
            @openChange="onOpenChange"
            @click="onMenuSelect($event)"
        >
            <template v-for="(item, index) in menuResource">
                <a-sub-menu
                    v-if="item.children"
                    :key="index"
                    style="margin:0 !important;padding-left:0 !important;"
                >
                    <span slot="title">
                        <span :class="['anticon', item.sub_model_icon]"></span>
                        <span>{{
                            locale == 'zh-cn' ? item.name_chn : item.name
                        }}</span>
                    </span>
                    <a-menu-item
                        :key="sub_item.name"
                        v-for="sub_item of item.children"
                        style="overflow:visible;height:auto;padding-left:50px !important;"
                        :title="$t('right-memu-tip')"
                        @contextmenu.prevent.native="
                            openRightMenu($event, sub_item.name)
                        "
                    >
                        <div>
                            <template v-if="sub_item.icon">
                                <span
                                    :class="['anticon', sub_item.icon]"
                                ></span>
                            </template>
                            <template
                                v-if="
                                    transferLan(sub_item) &&
                                        transferLan(sub_item).length >
                                            controlNumber
                                "
                            >
                                <a-tooltip placement="right">
                                    <template slot="title">
                                        <span>{{ transferLan(sub_item) }}</span>
                                    </template>
                                    <span>{{
                                        transferLan(sub_item) | textHandle
                                    }}</span>
                                </a-tooltip>
                            </template>
                            <template v-else>
                                <span>{{ transferLan(sub_item) }}</span>
                            </template>
                        </div>
                    </a-menu-item>
                </a-sub-menu>
                <a-menu-item
                    :key="item.name"
                    v-else
                    style="overflow:visible;height:auto;"
                >
                    <div
                        class="flex-row justify-content-start align-items-center"
                    >
                        <template v-if="item.icon">
                            <span :class="['anticon', item.icon]"></span>
                        </template>
                        <span>{{
                            locale == 'zh-cn' ? item.name_chn : item.name
                        }}</span>
                    </div>
                </a-menu-item>
            </template>
        </a-menu>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { Mutation, State } from 'vuex-class'

let that //定义全局this变量
@Component({
    components: {},
    filters: {
        textHandle: function(val) {
            let textNew = val
            if (val.length > that.controlNumber) {
                textNew = val.slice(0, that.controlNumber) + '...'
            }
            return textNew
        }
    }
})
export default class SideMenu extends Vue {
    private beforeCreate() {
        that = this //获取vue this以便在filter中使用
    }

    @Mutation('updateMenuActive')
    private updateMenuActive

    @State('menuActive')
    private menuActive

    private current: any[] = []

    private locale: any = ''

    private rightMenu: any = false

    private controlNumber: number = 9 //控制显示不同语言显示的字符

    private openKeys: any = [0]

    created() {
        this.locale = this.$app.state.locale
        if (this.$route && this.$route.name) {
            this.current = [this.$route.name]
        }
    }

    private mounted() {}

    private controlOpenMenu() {
        // if (this.menuResource && this.menuResource.length) {
        //     for (let i: number = 0; i < this.menuResource.length; i++) {
        //         if (this.menuResource[i].children) {
        //             for (
        //                 let y = 0;
        //                 y < this.menuResource[i].children.length;
        //                 y++
        //             ) {
        //                 if (
        //                     this.menuResource[i].children[y].name ===
        //                     this.$route.name
        //                 ) {
        //                     this.openKeys = [i]
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    private onOpenChange(openKeys) {
        this.openKeys = openKeys
        // if (openKeys.length !== 0) {
        //     this.openKeys = [openKeys[1]]
        // } else {
        //     this.openKeys = ['']
        // }
    }

    private get collapsed() {
        return this.$app.state.collapsed
    }

    private get menuResource() {
        if (this.menuActive) {
            let mn: any = this.menuActive.children
                ? JSON.parse(JSON.stringify(this.menuActive.children))
                : []
            let retMn: any = []
            for (let i in mn) {
                if (mn[i].children) {
                    mn[i].children = mn[i].children.filter(
                        x => x.navigate_menu === true
                    )
                    if (mn[i].children && mn[i].children.length) {
                        retMn.push(mn[i])
                    }
                }
            }

            //切换顶部菜单时有选中则选中没有则默认展开第一个
            this.openKeys = [0]
            // if (retMn && retMn.length) {
            //     for (let i: number = 0; i < retMn.length; i++) {
            //         if (retMn[i].children) {
            //             for (let y = 0; y < retMn[i].children.length; y++) {
            //                 if (
            //                     retMn[i].children[y].name === this.$route.name
            //                 ) {
            //                     this.openKeys = [i]
            //                 }
            //             }
            //         }
            //     }
            // }
            return retMn
        } else {
            return []
        }
    }

    //转换语言
    private get transferLan() {
        const that = this
        return function(sub_item) {
            if (that.locale == 'zh-cn') {
                that.controlNumber = 9
                return sub_item.name_chn
            } else {
                that.controlNumber = 18
                return sub_item.name
            }
        }
    }

    @Watch('$app.state.locale')
    private onLocaleChange() {
        this.locale = this.$app.state.locale
    }

    @Watch('$route')
    onRouteChange(newRoute, oldRoute) {
        this.current = [newRoute.name]
        this.controlOpenMenu()
    }

    // @Watch('rightMenu')
    // onRightMenuChange(value) {
    //     if (value) {
    //         document.body.addEventListener('click', this.closeRightMenu)
    //     } else {
    //         document.body.removeEventListener('click', this.closeRightMenu)
    //     }
    // }

    private onMenuSelect({ key }) {
        if (key === 'chat-box') {
            let url = this.$router.resolve({
                name: 'chat-box'
            })
            window.open(url.href, '_blank')
        } else if (key.indexOf('list-page') !== -1) {
            let id = key.substring(10)
            this.$router.push({
                name: 'list-page',
                path: `/list-page/${id}`,
                params: {
                    id: id,
                    name: id
                }
            })
        } else {
            if (!this.current.includes(key)) {
                this.$router.push({
                    name: key
                })
            }
        }
    }

    private openRightMenu(e, key) {
        // this.rightMenu = true
        let url = this.$router.resolve({
            name: key
        })
        window.open(url.href, '_blank')
    }

    // private closeRightMenu() {
    //     this.rightMenu = false
    // }
}
</script>

<style lang="less">
.anticon {
    font-size: 18px !important;
}

.textEllipsis {
    width: 100%;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
}

.layout-component.side-menu {
    box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 10;

    .ant-menu {
        background: transparent;
        border-right: none;

        .ant-menu-item {
            i {
                font-size: 21px;
            }
        }
    }
}
</style>
<i18n>
{
    "en-us": {
        "right-memu-tip": "Right Click, You can open the page in new tab"
    },
    "zh-cn": {
        "right-memu-tip": "右击可在新选项卡中打开页面"
    }
}
</i18n>
