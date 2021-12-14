<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <div v-if="compontentName == 'ProductPriceCheckHistoryEdit'">
                    <ProductPriceCheckHistoryEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'ProductPriceCheckHistoryEdit'
                        "
                        :key="_id"
                        :info="commonPageInfo.find(x => x.index == _id).info"
                    />
                </div>
            </a-card>
        </section>
    </page-container>
</template>
<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import { Page } from '@/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { namespace } from 'vuex-class'
import router from '../../router'
import ProductPriceCheckHistoryEdit from '@/components/product/product-price-check-history-edit.vue'

const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'swap-wrapper'
})
@Component({
    components: {
        ProductPriceCheckHistoryEdit
    }
})
export default class SwapWrapper extends Vue {
    @Prop()
    public id

    public idList: any[] = []

    private data: any[] = []

    private compontentName: any = ''

    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()

    @pageParamsModule.State
    private commonPageInfo

    @Watch('id')
    private onPropChange(id: string) {
        let item = this.commonPageInfo.find(x => x.index == id)
        if (!item) {
            this.$message.error('找不到对应的页面，请联系管理员')
        }
        if (!this.idList.find(x => x === id)) {
            this.idList.push(id)
        }

        this.compontentName = item.component
    }

    private created() {
        this.onPropChange(this.id)
    }

    private mounted() {}

    /**
     * 主题渲染函数
     */
    // public render(h) {
    //     return (
    //         <div
    //             class="page-container"
    //             style="width:100%;height:100%;display:inline-block;overflow-y:scroll;"
    //         >
    //             {this.renderCompontent(h)}
    //             <div style="clear:both;"></div>
    //         </div>
    //     )
    // }

    // private renderCompontent(h) {
    //     return this.$createElement(this.compontentName, {
    //         props: {
    //             info: this.data
    //         }
    //     })
    // }
}
</script>

<i18n>
{
  "en-us":{
    "sku":"SKU"
  },
  "zh-cn":{
    "sku":"SKU"
  }
}
</i18n>
