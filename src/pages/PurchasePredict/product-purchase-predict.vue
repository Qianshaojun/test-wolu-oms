<template>
    <page-container ref="pageContainer" :showHeader="false">
        <ProductPurchasePredict :info="info"></ProductPurchasePredict>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import ProductPurchasePredict from '~/components/product/product-purchase-predict.vue'
import appConfig from '@/config/app.config'

@Page({
    layout: 'workspace',
    name: 'product-purchase-predict'
})
@Component({
    components: {
        ProductPurchasePredict
    }
})
export default class ProductPurchaseCal extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    private info: any = ''

    public created() {}
}
</script>

<i18n>
{
  "en-us": {
    "desc": ""
  },
  "zh-cn": {
    "desc": ""
  }
}
</i18n>
