<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <div v-if="compontentName == 'ReplenishmentEdit'">
                    <ReplenishmentEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id && compontentName == 'ReplenishmentEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'PurchaseShipOrderEdit'">
                    <PurchaseShipOrderEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'PurchaseShipOrderEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'PurchaseContractEdit'">
                    <PurchaseContractEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'PurchaseContractEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'PurchasePackageEdit'">
                    <PurchasePackageEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id && compontentName == 'PurchasePackageEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'deFinalShip'">
                    <FinalShipManage
                        v-for="_id in idList"
                        v-show="_id == id && compontentName == 'deFinalShip'"
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'ukFinalShip'">
                    <UkFinalShipManage
                        v-for="_id in idList"
                        v-show="_id == id && compontentName == 'ukFinalShip'"
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'LogisticsProvidersEdit'">
                    <LogisticsProvidersEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'LogisticsProvidersEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'ProductPriceCheckEdit'">
                    <ProductPriceCheckEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'ProductPriceCheckEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
                    />
                </div>
                <div v-if="compontentName == 'ProductPriceCheckHistoryEdit'">
                    <ProductPriceCheckHistoryEdit
                        v-for="_id in idList"
                        v-show="
                            _id == id &&
                                compontentName == 'ProductPriceCheckHistoryEdit'
                        "
                        :key="_id"
                        :info="
                            commonPageInfo.find(x => x.index == _id) &&
                                commonPageInfo.find(x => x.index == _id).info
                        "
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
import ReplenishmentEdit from '~/components/purchase/replenishment-edit.vue'
import PurchaseShipOrderEdit from '~/components/purchase/purchase-ship-order-edit.vue'
import PurchaseContractEdit from '~/components/purchase/purchase-contract-edit.vue'
import PurchasePackageEdit from '~/components/purchase/purchase-package-edit.vue'
import FinalShipManage from '@/components/shipment/final-ship-manage.vue'
import UkFinalShipManage from '@/components/shipment/uk-final-ship-manage.vue'
import LogisticsProvidersEdit from '@/components/purchase/logistics-providers-edit.vue'
import ProductPriceCheckEdit from '@/components/product/product-price-check-edit.vue'
import ProductPriceCheckHistoryEdit from '@/components/product/product-price-check-history-edit.vue'

const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'page-wrapper'
})
@Component({
    components: {
        ReplenishmentEdit,
        PurchaseShipOrderEdit,
        PurchaseContractEdit,
        PurchasePackageEdit,
        FinalShipManage,
        UkFinalShipManage,
        LogisticsProvidersEdit,
        ProductPriceCheckEdit,
        ProductPriceCheckHistoryEdit
    }
})
export default class PageWrapper extends Vue {
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
    "en-us": {
        "sku": "SKU"
    },
    "zh-cn": {
        "sku": "SKU"
    }
}
</i18n>
