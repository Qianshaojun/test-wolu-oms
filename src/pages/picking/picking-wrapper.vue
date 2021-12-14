<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <PickingDetailMulti
                    v-for="_id in idList"
                    v-show="_id == id"
                    :key="_id"
                    :detail="data.find(x => x.id == _id)"
                    :id="_id"
                    :countryList="countryList"
                    :systemUsers="systemUsers"
                />
            </a-card>
        </section>
    </page-container>
</template>

<style>
.btn-area .ant-btn {
    margin: 3px 2px;
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
import PickingDetail from '~/components/picking/picking-detail.vue'
import PickingDetailMulti from '~/components/picking/picking-detail-multi.vue'
import { PickingService } from '../../services/picking.service'
import { namespace } from 'vuex-class'
import router from '../../router'
import BatchSendEmail from '@/components/picking/batch-send-email.vue'
import CreateReturn from '~/components/picking/create-return.vue'
import { ShipmentService } from '../../services/shipment.service'
import DeliveryMore from '@/components/picking/delivery-more.vue'
import ProductPart from '@/components/picking/product-part.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'picking-wrapper'
})
@Component({
    components: {
        PickingDetail,
        PickingDetailMulti,
        BatchSendEmail,
        CreateReturn,
        DeliveryMore,
        ProductPart
    }
})
export default class PickingWrapper extends Vue {
    @Prop()
    public id

    public idList: any[] = []

    private data: any[] = []

    private columns: any[] = []

    private detailInfo: any = {}

    // 分页服务
    private pageService = new PageService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private shipmentService = new ShipmentService()

    @Watch('id')
    private onPropChange(id: string) {
        if (!this.data.find(x => x.id == id)) {
            this.getPickingInfo()
        }

        this.$nextTick(() => {
            if (!this.idList.find(x => x == id)) {
                this.idList.push(id)
            }
        })
    }

    private created() {
        this.getcountry()
        this.getSystemuser()
        this.onPropChange(this.id)
    }

    private mounted() {}

    private getPickingInfo() {
        this.pickingService
            .queryDetail(
                new RequestParams(
                    { picking_id: parseInt(this.id) },
                    {
                        page: this.pageService,
                        loading: this.loadingService
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
