<template>
    <section class="component order-detail">
        <div style="margin-top:10px;font-weight:600;color:#222;">
            分档海运费
        </div>
        <a-tabs :defaultActiveKey="subDefaultKey" :v-model="activeSubKey">
            <a-tab-pane
                v-for="i of info"
                :tab="i.shipping_fee"
                :key="i.shipping_fee"
            >
                <PreProductPriceCheckViewItem :detail="i" />
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'

import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { Form } from 'ant-design-vue'
import PreProductPriceCheckViewItem from '~/components/product/pre-product-price-check-view-item.vue'

@Component({
    components: {
        PreProductPriceCheckViewItem
    }
})
export default class PreProductPriceCheckView extends Vue {
    @Prop({ default: Array })
    detail: any

    private id: any = 0

    private info: any = []

    private activeSubKey: any = ''
    private subDefaultKey: any = ''
    private form: any

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    @Watch('detail')
    private onDetailChange() {
        if (this.detail) {
            this.info = Object.assign({}, this.detail)
            this.form.setFieldsValue(this.info)
        } else {
            this.info = []
        }
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.detail) {
            this.info = Object.assign({}, this.detail)
            this.form.setFieldsValue(this.info)
        }
    }

    private onInputChange(e, column) {
        this.info[column] = e
        this.$emit('inputChange', this.info)
    }
}
</script>

<i18n>
{
  "en-us":{
    "base":"Order Detail",
    "customerProblem":"Customer Problem",
    "pickingList":"Picking List",
    "invoices":"Invoices",
    "operateLogs":"Operate Logs",
    "action":{
        "import":"Import",
        "add":"+ Add",
        "test_calc":"Test Calc"
    },
    "columns":{
        "custom_tax":"Custom Tax",
        "uk_custom_tax":"UK Custom Tax",
        "weight":"Weight",
        "size1":"Size1",
        "size2":"Size2",
        "size3":"Size3",
        "purchase_price":"Purchase Price"
    }
  },
  "zh-cn":{
    "base":"订单详情",
    "customerProblem":"客户问题",
    "pickingList":"拣货列表",
    "invoices":"发票",
    "operateLogs":"操作日志",
    "action":{
        "import":"导入SKU",
        "add":"+ 添加SKU",
        "test_calc":"试算"
    },
    "columns":{
        "custom_tax":"德国关税",
        "uk_custom_tax":"英国关税",
        "weight":"毛重",
        "size1":"包装尺寸1",
        "size2":"包装尺寸2",
        "size3":"包装尺寸3",
        "purchase_price":"采购价"
    }
  }
}
</i18n>
