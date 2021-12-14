<template>
    <page-container ref="pageContainer">
        <template #header-action> </template>
        <a-card class="margin-y" style="margin:0 !important">
            <InvoiceEdit />
        </a-card>
    </page-container>
</template>

<style>
.order-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}
.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import PageContainer from '../../shared/components/page-container.vue'
import InvoiceEdit from '~/components/account/invoice-edit.vue'
import { formConfig } from '@/config/form.config'

@Page({
    layout: 'workspace',
    name: 'invoice-edit'
})
@Component({
    components: {
        InvoiceEdit
    }
})
export default class OrderEdit extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    private form: any

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1"
  },
  "zh-cn": {
    "desc": "这是订单页面1"
  }
}
</i18n>
