<template>
    <section
        ref="layout"
        class="layout layout-container full-absolute"
        :class="layoutClass"
    >
        <div class="logo-wrap wrap">
            <Logo></Logo>
        </div>
        <div class="header-wrap wrap">
            <Header></Header>
        </div>
        <div class="side-wrap wrap">
            <SideMenu></SideMenu>
        </div>
        <div class="tabs-wrap wrap">
            <Tabs></Tabs>
        </div>
        <div class="content-wrap wrap">
            <Content></Content>
        </div>
        <!--        <div class="loading-top" v-if="loadingState && !loadingMask">-->
        <!--            <a-spin tip="Loading...">-->
        <!--                <div class="spin-content"></div>-->
        <!--            </a-spin>-->
        <!--        </div>-->
        <div class="loading-wrap" v-if="loadingMask">
            <a-spin tip="Loading...">
                <div class="spin-content"></div>
            </a-spin>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { State } from 'vuex-class'
import fullscreen from 'fullscreen'
import Logo from './components/workspace/logo.vue'
import Header from './components/workspace/header.vue'
import SideMenu from './components/workspace/side-menu.vue'
import Tabs from './components/workspace/tabs.vue'
import Content from './components/workspace/content.vue'
import { LoadingService } from '../bootstrap/services/loading.service'
import { Layout } from '@/core/decorators/layout.decorator'

@Layout({
    name: 'WorkspaceLayout'
})
@Component({
    components: { Header, SideMenu, Logo, Tabs, Content }
})
export default class WorkspaceLayout extends Vue {
    private get fullscreen() {
        return this.$app.state.fullscreen
    }

    private get layoutClass() {
        return {
            collapsed: this.$app.state.collapsed
        }
    }

    private loadingState = false
    private loadingMask = false

    @Watch('fullscreen')
    onChildChanged(value: string) {
        const layout = fullscreen(this.$refs['layout'])
        const updateFullscreen = value ? layout.request : layout.release
        // 更新全屏状态
        updateFullscreen && updateFullscreen()
    }

    private get handleLoadingState() {
        return this.loadingState && !this.loadingMask
    }

    @Watch('handleLoadingState')
    handleLoading(val) {
        if (val) {
            const h = this.$createElement
            this.$message.loading({
                content: 'Loading...',
                duration: 0,
                icon: () => h('a-spin')
            })
        } else {
            this.$message.destroy()
        }
    }

    mounted() {
        LoadingService.loadingStatus.subscribe(({ state, mask }) => {
            this.loadingState = state
            this.loadingMask = mask
        })
    }
}
</script>

<style lang="less" scoped>
.layout-container {
    display: grid;
    grid-template-columns: 200px auto;
    grid-template-rows: 32px 33px auto;
    grid-template-areas:
        'logo header header'
        'side tabs tabs'
        'side content content';
}

.layout-container.collapsed {
    grid-template-columns: 80px auto;
}

.wrap {
    position: relative;
}

.logo-wrap {
    grid-area: logo;
}

.header-wrap {
    grid-area: header;
}

.side-wrap {
    grid-area: side;
}

.tabs-wrap {
    grid-area: tabs;
}

.content-wrap {
    grid-area: content;
}

.loading-wrap {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 9999 !important;
}

.loading-top {
    position: absolute;
    left: 50%;
    top: 28px;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(133, 138, 184, 0.6);
    z-index: 9999 !important;
}

.loading-top .spin-content {
    border: 1px solid #91d5ff;
    background-color: #e6f7ff;
    padding: 30px;
}
</style>

<style lang="less">
.loading-wrap {
    .ant-spin-nested-loading
        > div
        > .ant-spin.ant-spin-show-text
        .ant-spin-dot {
        margin-left: 15px;
    }
}

.ant-spin-dot {
    font-size: 20px !important;
}
</style>
