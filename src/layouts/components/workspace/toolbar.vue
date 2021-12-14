<template>
    <section
        class="layout-component toolbar full-absolute flex-row flex-nowrap justify-content-end align-items-center padding-x"
    >
        <a-icon
            :type="fullscreen ? 'fullscreen-exit' : 'fullscreen'"
            @click="onUpdateFullscreen"
        />
        <a-popover tar placement="bottom" trigger="click">
            <template v-slot:content>
                <div class="flex-row theme-panel">
                    <div
                        class="theme-item margin-right"
                        v-for="theme of themeList"
                        :key="theme.name"
                        :style="{ 'background-color': theme.color }"
                        @click="onUpdateTheme(theme.name)"
                    >
                        <a-icon
                            v-if="$app.state.theme === theme.name"
                            type="check"
                        />
                    </div>
                </div>
            </template>
            <a-icon type="bg-colors" style="cursor:pointer;" />
        </a-popover>

        <a-dropdown :trigger="['click']">
            <a class="ant-dropdown-link">
                {{ $t('lang') }}
                <a-icon type="down" />
            </a>
            <template v-slot:overlay>
                <a-menu
                    v-model="locale"
                    selectable
                    @select="onSelectLangage($event)"
                >
                    <a-menu-item key="zh-cn">
                        <a>中文</a>
                    </a-menu-item>
                    <a-menu-item key="en-us">
                        <a>English</a>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>

        <!-- <router-link :to="{ name: 'change-log' }">
            <a-tooltip placement="bottom">
                <template slot="title">
                    <span>{{ $t('change-log') }}</span>
                </template>
                <a-icon type="info-circle"></a-icon>
            </a-tooltip>
        </router-link>

        <a href="http://47.244.150.247:38069/api_doc" target="_blank">
            <a-tooltip placement="bottom">
                <template slot="title">
                    <span>{{ $t('docs') }}</span>
                </template>
                <a-icon type="book"></a-icon>
            </a-tooltip>
        </a> -->

        <div style="cursor: pointer">
            <a-dropdown>
                <div>
                    <a-avatar icon="user" :size="20"></a-avatar>
                    <span class="padding-left">{{ username }}</span>
                </div>
                <template #overlay>
                    <a-menu>
                        <a-menu-item style="text-align: center">
                            {{ $t('user-info') }}
                        </a-menu-item>
                        <a-menu-item
                            @click="onChangePassword"
                            style="text-align: center"
                        >
                            {{ $t('change-password') }}
                        </a-menu-item>
                        <a-menu-divider />
                        <a-menu-item
                            @click="onLogout"
                            style="text-align: center;color: red"
                        >
                            {{ $t('logout') }}
                        </a-menu-item>
                    </a-menu>
                </template>
            </a-dropdown>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { Mutation, namespace } from 'vuex-class'
import ChangeOwnPassword from './change-own-password.vue'

const userModule = namespace('userModule')
@Component({
    components: {
        ChangeOwnPassword
    }
})
export default class Toolbar extends Vue {
    @userModule.State
    private username

    @userModule.State
    private id

    @userModule.Mutation
    logout

    private locale

    private themeList = [
        {
            name: 'default',
            color: '#3a5899'
        },
        {
            name: 'light',
            color: '#6db89b'
        },
        {
            name: 'purpule',
            color: '#807fa9'
        }
    ]

    created() {
        this.locale = [this.$app.state.locale]
    }

    private get location() {
        return window.location
    }

    private get fullscreen() {
        return this.$app.state.fullscreen
    }

    // private onUpdateFullscreen() {
    //     this.$app.store.commit('updateFullscreen')
    // }

    private onUpdateFullscreen() {
        let _this = this
        let el = document.documentElement
        if (document.fullscreenElement === null) {
            _this.openFullscreen(el)
        } else {
            _this.quitFullscreen()
        }
    }

    private openFullscreen(element) {
        if (element.requestFullscreen) {
            element.requestFullscreen()
        } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen()
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen()
        } else if (element.msRequestFullscreen) {
            // IE11
            element.msRequestFullscreen()
        }
    }

    private quitFullscreen() {
        let document: any = window.document
        if (document.exitFullscreen) {
            document.exitFullscreen()
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen()
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen()
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen()
        }
    }

    private onSelectLangage({ key }) {
        this.$app.store.commit('updateLocale', key)
    }

    private onUpdateTheme(theme) {
        this.$app.store.commit('updateTheme', theme)
    }

    /**
     * 用户注销
     */
    private onLogout() {
        this.logout()
        this.$router.push({
            name: 'login'
        })
    }

    private onChangePassword() {
        let data: any = {
            user_id: this.id
        }
        this.$modal
            .open(
                ChangeOwnPassword,
                {
                    user: data
                },
                {
                    title: this.$t('modify_password_wizard')
                }
            )
            .subscribe(data => {
                this.$message.success('操作成功')
            })
    }
}
</script>

<style lang="less">
.theme-panel {
    min-width: 100px;

    .theme-item {
        width: 20px;
        height: 20px;
        line-height: 20px;
        border-radius: 4px;
        color: white;
        text-align: center;
        font-size: 12px;
        cursor: pointer;
    }
}
</style>
<style lang="less" scoped>
.icon-user {
    font-size: 12px !important;
}

.layout-component.toolbar {
    white-space: nowrap;

    & > * {
        padding: 0 10px;
    }

    i {
        font-size: 18px;
        color: #ffffff;
    }
}
</style>

<i18n>
{
    "en-us": {
        "lang": "语言",
        "change-log": "Change Log",
        "docs": "Document",
        "user-info": "User Info",
        "logout": "Logout",
        "change-password": "Change PWD",
        "modify_password_wizard": "Modify Password",
        "success": "Success"
    },
    "zh-cn": {
        "lang": "Language",
        "change-log": "更新日志",
        "docs": "文档",
        "user-info": "用户信息",
        "logout": "注销",
        "change-password": "修改密码",
        "modify_password_wizard": "修改密码",
        "success": "操作成功"
    }
}
</i18n>
