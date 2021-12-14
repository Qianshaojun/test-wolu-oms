<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action> </template>
        <ShipmenListContent :page_flag="page_flag"> </ShipmenListContent>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import ShipmenListContent from '~/components/picking/shipment-list-content.vue'
import PageContainer from '../../shared/components/page-container.vue'

@Page({
    layout: 'workspace',
    name: 'shipment-list'
})
@Component({
    components: {
        ShipmenListContent
    }
})
export default class ShipmentList extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    // 表格数据源
    private page_flag: any = ''

    private created() {}
}
</script>

<i18n>
{
  "en-us": {
    "no": "no",
    "desc": "this is a Order Page1"
  },
  "zh-cn": {
    "no": "无",      
    "desc": "这是订单页面1"
  }
}
</i18n>
