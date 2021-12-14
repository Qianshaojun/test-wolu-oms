<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <ProductUnsalableReportContent :page_flag="page_flag">
        </ProductUnsalableReportContent>
    </page-container>
</template>

<style>
.components-table-demo-nested
    tr.ant-table-expanded-row
    td
    > .ant-table-wrapper {
    margin: -9px !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import ProductUnsalableReportContent from '~/components/product/product-unsalable-report-content.vue'
import PageContainer from '../../shared/components/page-container.vue'

@Page({
    layout: 'workspace',
    name: 'product-unsalable-report-leader'
})
@Component({
    components: {
        ProductUnsalableReportContent
    }
})
export default class ProductUnsalableReportLeader extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    // 表格数据源
    private page_flag: any = 'leader'

    private created() {}

    private mounted() {
        this.page_flag = 'leader'
    }
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
