import { RequestParams } from '@/core/http'
import { LogoutService } from '@/services/logout.service'
import commonPlugin from '@/bootstrap/plugins/common.plugin'

export default {
    namespaced: true,
    state: {
        id: 0,
        username: '',
        menus: [],
        department: {},
        token: '',
        customer_code: '',
        menu_dict: {},
        defaultPrinter: '',
        info: {},
        dataFormHeight: 0 //dataForm组件高度
    },
    mutations: {
        setDataFormHeight(state, data) {
            state.dataFormHeight = data
        },
        login(state, data) {
            state.id = data.id
            state.token = data.token
            state.username = data.username
            state.menus = data.menus
            state.department = data.department
            state.info = data
            state.customer_code = data.customer_code
            state.menu_dict = data.data.menu_dict
        },
        logout(state) {
            state.username = undefined
            state.id = undefined
            state.token = undefined
            state.username = undefined
            state.menus = undefined
            state.department = undefined
            state.info = undefined
            state.menu_list = undefined
            state.customer_code = undefined
            state.token = undefined

            var myDate: any = new Date()
            myDate.setTime(-1000) //设置时间
            var ck = document.cookie
            var ckArray = ck.split('; ')
            for (var i = 0; i < ckArray.length; i++) {
                var varName = ckArray[i].split('=')
                document.cookie =
                    varName[0] + '=""; expires=' + myDate.toGMTString()
            }
        },
        setPrinter(state, data) {
            state.defaultPrinter = data
        }
    },
    actions: {
        logout({ commit }) {
            const logoutService = new LogoutService()
            logoutService
                .logout(
                    new RequestParams(
                        {}
                        // { header: { 'Content-Type': 'text/html' } }
                    )
                )
                .subscribe(
                    data => {
                        commit('logout')
                    },
                    err => {
                        commit('logout')
                    }
                )
        }
    }
}