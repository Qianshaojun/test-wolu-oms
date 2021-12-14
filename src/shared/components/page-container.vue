<template>
    <section
        @scroll="onScroll"
        ref="container"
        class="page-container"
        :showHeader="showHeader"
    >
        <PageHeader :title="pageTitle" v-if="showHeader">
            <slot name="header-action" slot="action"></slot>
            <slot name="header-content" slot="content"></slot>
            <template></template>
            <div slot="content" v-if="!$slots['header-content'] && desc">
                <div class="content-desc">{{ desc }}</div>
            </div>
            <slot name="extra" slot="extra"></slot>
        </PageHeader>
        <PageContent>
            <slot></slot>
        </PageContent>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import PageHeader from './page-header.vue'
import PageContent from './page-content.vue'

@Component({
    components: { PageHeader, PageContent }
})
export default class PageContainer extends Vue {
    @Prop()
    private title

    @Prop()
    private desc

    @Prop({
        default: true
    })
    private showHeader

    private scrollTop = 0

    private timer: any = null

    /**
     * 获取页面标题
     */
    private get pageTitle() {
        const name = this.$parent.$options.name
        return this.title || name
    }

    public scrollToBottom() {
        this.$el.scrollTo(0, this.$el.scrollHeight)
    }

    private onScroll({ target }) {
        this.scrollTop = target.scrollTop
    }

    private mounted() {
        this.timer = setTimeout(() => {
            let height: number = 0
            let pageHeaderHeight: number = 0
            //防止页面一开始进入时设置了autoFlex类名的区域计算高度失效
            const dataForm = document.querySelector('.data-form') as HTMLElement //dataForm 区域
            const autoFlex = document.querySelector('.autoFlex') as HTMLElement //设置了autoFlex类名的区域
            const pageHeader = document.querySelector(
                '.page-header'
            ) as HTMLElement //头部标题区域
            const cardTabsDom = document.querySelector(
                '.cardTabs'
            ) as HTMLElement //中间tabs高度
            if (pageHeader) {
                pageHeaderHeight = pageHeader.clientHeight
            }
            if (dataForm && autoFlex) {
                height =
                    document.documentElement.clientHeight -
                    dataForm.clientHeight -
                    pageHeaderHeight -
                    80
                if (cardTabsDom) {
                    height -= 25
                }
                autoFlex.style.height = height + 'px'
            }
        }, 300)
    }

    private destroyed() {
        clearTimeout(this.timer)
    }

    private activated() {
        if (this.scrollTop) {
            const element = this.$refs.container as HTMLElement
            element.scrollTo(0, this.scrollTop)
        }
    }
}
</script>

<style lang="less" scoped>
.page-container {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow: auto;
    padding-bottom: 10px;
}

.content-desc {
    font-size: 14px;
    line-height: 1.5;
    color: rgba(0, 0, 0, 0.65);
}
</style>
