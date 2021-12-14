<template>
    <page-container ref="pageContainer" :showHeader="false">
        <section class="component order-base-detail">
            <a-card>
                <VendorDetailMulti
                    v-for="_id in idList"
                    v-show="_id == id"
                    :key="_id"
                    :originVendor="data.find(x => x.id == _id)"
                    :id="_id"
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
import VendorDetailMulti from '~/components/purchase/vendor-detail-multi.vue'

import { namespace } from 'vuex-class'
import router from '../../router'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import { PublicService } from '~/services/public.service'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'vendor-wrapper'
})
@Component({
    components: {
        VendorDetailMulti
    }
})
export default class VendorWrapper extends Vue {
    @Prop()
    public id

    @Prop()
    public vendor

    public idList: any[] = []

    private data: any[] = []

    private columns: any[] = []

    private detailInfo: any = {}

    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()

    private loadingService = new LoadingService()

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @Watch('id')
    private onPropChange(id: string) {
        if (!this.data.find(x => x.id == this.id)) {
            this.getVendorInfo()
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

    private getVendorInfo() {
        let params: any = CommonService.createQueryCondition(
            { id: parseInt(this.id) },
            {
                id: '='
            }
        )
        let inneraction = new InnerActionService()

        inneraction.setActionAPI(
            '/vendor/query_all',
            CommonService.getMenuCode('vendor-manage')
        )

        this.publicService
            .queryPagination(
                new RequestParams(params, {
                    page: this.pageService,
                    loading: this.loadingService,
                    innerAction: inneraction
                })
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
