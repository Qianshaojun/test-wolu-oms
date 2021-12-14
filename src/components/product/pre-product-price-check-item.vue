<template>
    <section class="component order-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 8 }"
            :wrapperCol="{ span: 15, offset: 1 }"
        >
            <a-card>
                <div style="margin-top:10px;font-weight:600;color:#222;">
                    <span>调价项</span>
                    <a-radio-group
                        :value="hj_type"
                        size="small"
                        @change="e => handleHjTypeChange(e)"
                        style="margin-left:673px;"
                    >
                        <a-radio-button
                            value="compute"
                            style="width:45px;padding: 0 3px !important;"
                        >
                            <span style="font-size:10px !important;"
                                >取核价</span
                            >
                        </a-radio-button>
                        <a-radio-button
                            value="purchase"
                            style="width:55px;padding: 0 3px !important;"
                        >
                            <span style="font-size:10px !important;"
                                >取采购价</span
                            >
                        </a-radio-button>
                    </a-radio-group>
                </div>
                <a-row :gutter="24">
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.money_type')">
                            <a-select
                                v-decorator="['money_type']"
                                style="width: 120px"
                                size="small"
                                @change="e => onInputChange(e, 'money_type')"
                            >
                                <a-select-option key="人民币" value="人民币">
                                    人民币
                                </a-select-option>
                                <a-select-option key="欧元" value="欧元">
                                    欧元
                                </a-select-option>
                                <a-select-option key="美金" value="美金">
                                    美金
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.refund_tax')">
                            <a-input-number
                                v-decorator="['refund_tax']"
                                @change="e => onInputChange(e, 'refund_tax')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.purchase_price')">
                            <a-input-number
                                v-decorator="['purchase_price']"
                                @change="
                                    e => onInputChange(e, 'purchase_price')
                                "
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.custom_tax')">
                            <a-input-number
                                v-decorator="['custom_tax']"
                                @change="e => onInputChange(e, 'custom_tax')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.weight')">
                            <a-input-number
                                v-decorator="['weight']"
                                @change="e => onInputChange(e, 'weight')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.uk_custom_tax')">
                            <a-input-number
                                v-decorator="['uk_custom_tax']"
                                @change="e => onInputChange(e, 'uk_custom_tax')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size1')">
                            <a-input-number
                                v-decorator="['size1']"
                                @change="e => onInputChange(e, 'size1')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size2')">
                            <a-input-number
                                v-decorator="['size2']"
                                @change="e => onInputChange(e, 'size2')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.size3')">
                            <a-input-number
                                v-decorator="['size3']"
                                @change="e => onInputChange(e, 'size3')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size1')">
                            <a-input-number
                                v-decorator="['package_size1']"
                                @change="e => onInputChange(e, 'package_size1')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size2')">
                            <a-input-number
                                v-decorator="['package_size2']"
                                @change="e => onInputChange(e, 'package_size2')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="8">
                        <a-form-item :label="$t('columns.package_size3')">
                            <a-input-number
                                v-decorator="['package_size3']"
                                @change="e => onInputChange(e, 'package_size3')"
                                :min="0"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-card>
        </a-form>
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

@Component({
    components: {}
})
export default class PreProductPriceCheckItem extends Vue {
    @Prop({ default: Array })
    detail: any

    private id: any = 0

    private info: any = []

    private activeKey: any = ''

    private activeSubKey: any = ''
    private subDefaultKey: any = ''
    private form: any

    private hj_type: any = 'compute'

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }
    private loadingService = new LoadingService()
    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    @Watch('detail')
    private onDetailChange() {
        if (this.detail) {
            this.info = Object.assign({}, this.detail)
            this.hj_type = this.info.price_type
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
            this.hj_type = this.info.price_type
            this.form.setFieldsValue(this.info)
        }
    }

    private onInputChange(e, column) {
        this.info[column] = e
        this.$emit('inputChange', this.info)
    }

    private handleHjTypeChange(e) {
        this.hj_type = e.target.value
        this.innerAction.setActionAPI(
            'product_management/query_sku_price_info_for_try_calculate',
            CommonService.getMenuCode('product_price_check')
        )
        this.publicService
            .query(
                new RequestParams(
                    { sku: this.info.sku, price_type: this.hj_type },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.info.purchase_price = data.price
                    this.form.setFieldsValue(this.info)
                    this.$emit('inputChange', this.info)
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
        "purchase_price":"Purchase Price",
        "refund_tax":"refund tax",
        "money_type":"money type",
        "package_size1":"Package Size 1",
        "package_size2":"Package Size 2",
        "package_size3":"Package Size 3"
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
        "purchase_price":"采购价",
        "refund_tax":"出口退税率",
        "money_type":"币种",
        "package_size1":"分摊尺寸1",
        "package_size2":"分摊尺寸2",
        "package_size3":"分摊尺寸3"
    }
  }
}
</i18n>
