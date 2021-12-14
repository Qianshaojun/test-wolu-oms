<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <DePoDetail
                    v-for="_id in idList"
                    v-show="_id == id"
                    :key="_id"
                    :detail="data.find(x => x.id == _id)"
                    :id="_id"
                    :systemUsers="systemUsers"
                />
            </a-card>
        </section>
    </page-container>
</template>

<style>
.btn-area .ant-btn {
    margin: 3px 5px;
}
</style>

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
import DePoDetail from '~/components/purchase/depo-detail.vue'
import { namespace } from 'vuex-class'
import router from '../../router'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-wrapper'
})
@Component({
    components: {
        DePoDetail
    }
})
export default class ProductWrapper extends Vue {
    @Prop()
    public id

    public idList: any[] = []

    private data: any[] = []

    private columns: any[] = []

    private detailInfo: any = {}

    // 分页服务
    private pageService = new PageService()

    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @Watch('id')
    private onPropChange(id: string) {
        if (!this.data.find(x => x.id == id)) {
            this.getProductInfo()
        }

        this.$nextTick(() => {
            if (!this.idList.find(x => x == id)) {
                this.idList.push(id)
            }
        })
    }

    private created() {
        this.getSystemuser()
        this.onPropChange(this.id)
    }

    private mounted() {}

    private getProductInfo() {
        this.innerAction.setActionAPI(
            'purchase_management/query_de_purchase_order_detail_by_id',
            CommonService.getMenuCode('purchase-de-po-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { de_po_id: parseInt(this.id) },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = parseInt(this.id)
                    this.detailInfo = data[0]
                    this.data.push(this.detailInfo)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
  "en-us":{
    "sku":"SKU",
    "product_name":"Product Name",
    "order_qty":"Order Qty",
    "unit_price":"Unit_Price",
    "available_qty":"Available Qty",
    "taxes":"Taxes",
    "fullfilment_center":"Fullfilment Center",
    "Create Return Shipment":"Create Return Shipment"
  },
  "zh-cn":{
    "sku":"SKU",
    "product_name":"产品名称",
    "order_qty":"订单数量",
    "unit_price":"单价",
    "available_qty":"可用数量",
    "taxes":"税额",
    "fullfilment_center":"履行中心",
    "Create Return Shipment":"创建回程单"
  }
}
</i18n>
