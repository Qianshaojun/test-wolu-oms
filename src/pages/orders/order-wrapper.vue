<template>
    <page-container ref="pageContainer">
        <section class="component order-base-detail">
            <p>{{ id }}</p>
            <a-card class="margin-y" style="margin:0 !important">
                <data-table
                    :stripe="true"
                    :data="data"
                    :columns="columns"
                    :page="pageService"
                    rowKey="id"
                    style="table-layout:fixed;"
                    :scroll="{ y: 360 }"
                >
                    <span slot="customTitle"
                        ><a-icon type="smile-o" /> Name</span
                    >
                    <span slot="tags" slot-scope="tags">
                        <a-tag v-for="tag in tags" :key="tag">
                            {{ tag }}11
                        </a-tag>
                    </span>
                </data-table>
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

@Page({
    layout: 'workspace',
    name: 'order-wrapper'
})
@Component({
    components: {}
})
export default class OrderWrapper extends Vue {
    @Prop()
    private id

    private data: any[] = []

    private columns: any[] = []

    // 分页服务
    private pageService = new PageService()

    private mounted() {
        this.columns = [
            {
                dataIndex: 'name',
                key: 'name',
                slots: { title: 'customTitle' }
            },
            {
                title: 'Age',
                dataIndex: 'age',
                key: 'age'
            },
            {
                title: 'Tags',
                key: 'tags',
                dataIndex: 'tags',
                scopedSlots: { customRender: 'tags' }
            }
        ]

        this.data = [
            {
                id: 1,
                name: 'xinge',
                age: Math.ceil(Math.random() * 100),
                tags: ['nice', 'developer']
            },
            {
                id: 2,
                name: 'John Brown',
                age: 22,
                tags: ['werwe', 'ere']
            }
        ]
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
    "fullfilment_center":"Fullfilment Center"
  },
  "zh-cn":{
    "sku":"SKU",
    "product_name":"产品名称",
    "order_qty":"订单数量",
    "unit_price":"单价",
    "available_qty":"可用数量",
    "taxes":"税额",
    "fullfilment_center":"履行中心"
  }
}
</i18n>
