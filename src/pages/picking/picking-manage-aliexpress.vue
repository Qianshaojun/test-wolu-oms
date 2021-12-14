<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <PickingManageContent :page_flag="page_flag"> </PickingManageContent>
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
import PickingManageContent from '~/components/picking/picking-manage-content.vue'
import PageContainer from '../../shared/components/page-container.vue'

@Page({
    layout: 'workspace',
    name: 'picking-manage-aliexpress'
})
@Component({
    components: {
        PickingManageContent
    }
})
export default class ProductManageAliexpress extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    // 表格数据源
    private page_flag: any = 'aliexpress'

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
