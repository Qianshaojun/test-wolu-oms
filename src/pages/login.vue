<template>
    <section
        class="page login full-absolute flex-row justify-content-end align-items-center"
    >
        <a-card class="login-form" :title="$t('title')">
            <template #extra>
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
            </template>
            <a-form
                :form="form"
                @submit="onSumbit"
                :label-col="{ span: 7 }"
                :wrapper-col="{ span: 16, offset: 1 }"
            >
                <a-form-item :label="$t('form.username')">
                    <a-input
                        v-decorator="[
                            'username',
                            {
                                initialValue: '',
                                rules: rules.username
                            }
                        ]"
                    />
                </a-form-item>
                <a-form-item :label="$t('form.password')">
                    <a-input
                        type="password"
                        v-decorator="[
                            'password',
                            {
                                rules: rules.password
                            }
                        ]"
                    />
                </a-form-item>
                <a-form-item
                    :label-col="{ span: 0 }"
                    :wrapper-col="{ span: 24 }"
                >
                    <a-button
                        class="full-width"
                        type="primary"
                        html-type="submit"
                        :loading="loading"
                    >
                        {{ $t('form.login') }}
                    </a-button>
                </a-form-item>
            </a-form>
            <div class="form-tips">{{ login_info }}</div>
        </a-card>
    </section>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { namespace, Mutation } from 'vuex-class'
import { WmsService } from '../services/wms.service'
import { RequestParams } from '../core/http'
import Application from '@/core/application'

const userModule = namespace('userModule')
const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    name: 'login',
    layout: 'empty'
})
@Component({
    components: {}
})
export default class Login extends Vue {
    private locale
    private form
    private wmsService = new WmsService()

    @userModule.Mutation('login')
    private login

    @Mutation('updateUserMenu')
    private updateUserMenu

    @Mutation('updateMenuActive')
    private updateMenuActive

    @datasModule.Mutation('resetParams')
    private resetParams

    @pageParamsModule.Mutation('resetPageParams')
    private resetPageParams

    @datasModule.State
    private titleSuffix

    @datasModule.Action
    private getTitleSuffix

    @Mutation('updateButtonAuthInfo')
    private updateButtonAuthInfo

    private login_info: any = ''

    private loading: boolean = false

    public created() {
        this.getTitleSuffix()
        let docu: any = document
        docu.title = this.titleSuffix

        this.form = this.$form.createForm(this)
        this.locale = [this.$app.state.locale]
    }

    private get rules() {
        return {
            username: [
                { required: true, message: this.$t('rules.username_require') }
            ],
            password: [
                { required: true, message: this.$t('rules.password_require') }
            ]
        }
    }

    private onSelectLangage({ key }) {
        this.$app.store.commit('updateLocale', key)
    }

    private onSumbit(e) {
        e.preventDefault()
        this.form.validateFields((error, values) => {
            if (error) {
                return
            }

            this.loading = true
            this.login_info = this.$t('before_login')

            this.wmsService
                .login(
                    new RequestParams({
                        login: values.username,
                        password: values.password
                    })
                )
                .subscribe(
                    ({ user_login_info: data }) => {
                        this.loading = false
                        if (!data) {
                            this.$message.error('用户名密码错误')
                            return
                        }

                        this.login_info = this.$t('login_success_initial_data')

                        let url = window.location.host
                        let username = data.login
                        if (url.includes('47.254.148.130:58180')) {
                            let arr = username.split('@')
                            if (typeof arr == 'object' && arr.length == 2) {
                                username = arr[0]
                            }
                        }

                        this.login({
                            id: data.uid,
                            token: data.csrf_token,
                            username: username,
                            menus: data.user_menu_list,
                            department: data.department_info,
                            data: data,
                            customer_code: data.customer_code,
                            session_id: data.session_id
                        })

                        this.updateUserMenu(data.user_menu_list)
                        this.updateMenuActive({})

                        this.updateButtonAuthInfo(data.button_list)

                        this.resetParams()
                        this.resetPageParams()

                        this.$router.replace({ path: '/' })
                    },
                    err => {
                        this.login_info = ''
                        this.loading = false
                        this.$message.error(err.message)
                    }
                )
        })
    }
}
</script>

<style lang="less" scoped>
.login {
    background-image: url('~@/assets/images/login-bg.jpg');
    background-size: cover;
    background-position: 50%;
}

.login-form {
    margin-right: 120px;
    min-width: 330px;
    border-radius: 5px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}

.form-tips {
    text-align: center;
    margin-left: 30px;
    font-size: 18px !important;
    color: rgb(243, 7, 7);
}
</style>

<i18n>
{
    "en-us": {
        "lang": "语言",
        "tips": "you can input any username and password",
        "title": "User Login",
        "login_failure": "user or password error.",
        "before_login": "Logining...",
        "login_success_initial_data": "Login Success and initial data...",
        "form": {
            "username": "Username",
            "password": "Password",
            "login": "Login"
        },
        "rules": {
            "username_require": "please input username",
            "password_require": "please input username"
        }
    },
    "zh-cn": {
        "lang": "Language",
        "tips": "输入任意用户名密码即可",
        "title": "用户登录",
        "login_failure": "用户名密码错误",
        "before_login": "正在登录...",
        "login_success_initial_data": "登录成功，正在初始化...",
        "form": {
            "username": "用户名",
            "password": "密码",
            "login": "登录"
        },
        "rules": {
            "username_require": "请输入用户名",
            "password_require": "请输入密码"
        }
    }
}
</i18n>
