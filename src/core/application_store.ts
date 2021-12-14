import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import MobileDetect from 'mobile-detect'
import router from '@/router'
import { message } from 'ant-design-vue'

const detect = new MobileDetect(navigator.userAgent)

export enum RedirectMethod {
    Auto = 'auto',
    Redirect = 'redirect',
    Router = 'router'
}

/**
 * 应用内部数据存储
 */
export class ApplicationStore {
    public static getStore() {
        if (!this._store) {
            this._store = this.createStore()
            this._store.commit('updateReady', false)
        }

        return this._store
    }

    private static _store

    private static createStore() {
        return new Vuex.Store({
            plugins: [
                // 持久化存储插件
                createPersistedState({
                    key: 'core-vuex',
                    storage: localStorage
                })
            ],
            state: {
                // 初始化状态
                ready: false,
                // 选项卡标签
                tabs: [],
                currentTab: '',
                // 当前布局
                layout: 'loading',
                // 当前主题
                theme: 'default',
                // 当前语言
                locale: 'zh-cn',
                // 菜单折叠状态
                collapsed: false,
                // 页面全屏标识
                fullscreen: false,
                // 移动端标识
                mobile: !!detect.mobile()
            },
            getters: {
                layout(state) {
                    return `${state.layout.replace(/^\S/, s =>
                        s.toUpperCase()
                    )}Layout`
                }
            },
            mutations: {
                /**
                 * 更新系统准备状态
                 * @param state
                 *
                 */
                updateReady(state, value: boolean) {
                    state.ready = value
                },
                closeTab(
                    state: any,
                    {
                        name,
                        method = RedirectMethod.Auto,
                        redirectName
                    }: {
                        name?: string
                        method: RedirectMethod
                        redirectName?: string
                    }
                ) {
                    if (state.tabs.length === 1) {
                        message.warning('这是最后一页，不能再关闭了')
                        return
                    }
                    if (name === 'workspace') {
                        return
                    }
                    // 获取需要关闭的页面名称
                    name = name || state.currentTab.name
                    // 获取需要关闭的页面Index
                    let index = state.tabs.findIndex(
                        item => item.name === name || item.title === name
                    )

                    // 修改页面tabs
                    const tabs = state.tabs.filter(
                        item =>
                            (!item.title &&
                                item != name &&
                                item.name !== name) ||
                            (item.title && item.title !== name)
                    )

                    switch (method) {
                        case RedirectMethod.Auto:
                            index =
                                index >= tabs.length ? tabs.length - 1 : index
                            state.currentTab = tabs[index]
                            break
                        case RedirectMethod.Router:
                            router.back()
                            break
                        case RedirectMethod.Redirect: {
                            let tab = state.tabs.find(
                                x => x.name === x.redirectName
                            )

                            if (tab) {
                                state.currentTab = tabs[index]
                            } else {
                                router.push({ name: redirectName })
                            }
                            break
                        }

                        default:
                            break
                    }

                    state.tabs = tabs
                },
                /**
                 * 更新Tabs列表
                 * @param state
                 * @param tabs
                 */
                updateTabs(state, tabs) {
                    state.tabs = tabs
                },
                /**
                 * 更新Tabs列表
                 * @param state
                 * @param tabs
                 */
                pushTab(state, tab) {
                    const tabs: any[] = state.tabs

                    if (!tab.name) {
                        return
                    }

                    if (!tabs.find(x => x.name === tab.name)) {
                        tabs.push(tab)
                    }

                    state.currentTab = tab
                },
                /**
                 * 更新激活tab
                 * @param state
                 * @param tab
                 */
                updateCurrentTab(state, tab) {
                    state.currentTab = tab
                },
                /**
                 * 更新当前布局
                 * @param state
                 * @param layout
                 */
                updateLayout(state, layout) {
                    state.layout = layout
                },
                /**
                 * 更新当前主题
                 * @param state
                 * @param theme
                 */
                updateTheme(state, theme) {
                    state.theme = theme
                },
                /**
                 * 更新当前语言
                 * @param state
                 * @param locale
                 */
                updateLocale(state, locale) {
                    state.locale = locale
                },
                /**
                 * 更新菜单折叠状态
                 * @param state
                 */
                updateCollapsed(state) {
                    state.collapsed = !state.collapsed
                },
                /**
                 * 更新菜单全屏状态
                 * @param state
                 *
                 */
                updateFullscreen(state) {
                    state.fullscreen = !state.fullscreen
                }
            }
        })
    }
}
