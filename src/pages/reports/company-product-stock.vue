<template>
    <page-container ref="pageContainer">
        <data-form ref="dataForm" :column="1">
            <!--默认显示项-->
            <template #default> </template>
            <template #action>
                <a-button type="primary" @click="downloadStockReport">
                    {{ $t('action.download_excel_stock_file') }}
                </a-button>
            </template>
        </data-form>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ProductService } from '../../services/product.service'
import moment from 'moment'
import zhjson from '../../../src/assets/json/zh.json'
import appConfig from '../../config/app.config'

@Page({
    layout: 'workspace',
    name: 'company-product-stock'
})
@Component({
    components: {}
})
export default class CompanyProductStock extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private productService = new ProductService()

    private isShow: Boolean = true

    private rules = {
        required: [{ required: true }]
    }

    private created() {}

    private handleFatherCateChange(value) {}

    private url_pre = appConfig.server

    private downloadStockReport() {
        let url = appConfig.server + '/product/export_multi_company_stock'
        window.open(url)
    }
}
</script>

<i18n>
{
    "en-us": {
        "columns":{
            "shop_type":"platform",
            "cn_sub_category":"cn sub category",
            "order_date":"Order Date"
        }, 
        "action":{
            "download_excel_stock_file":"Download Multi Company Product Stock Report Excel"
        }
    },
    "zh-cn": {
        "columns":{
            "shop_type":"平台",
            "cn_sub_category":"中文子类",
            "order_date":"订单日期"
        }, 
        "action":{
            "downloadZip":"批量下载",
            "delete":"删除",
            "detail":"详情",
            "download_excel_stock_file":"下载产品多公司库存统计表Excel"
        } 
    }
}
</i18n>
