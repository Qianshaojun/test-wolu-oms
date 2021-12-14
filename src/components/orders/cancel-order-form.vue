<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 10, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="11">
                    <a-form-item :label="$t('columns.refund_reason')">
                        <a-select
                            showSearch
                            v-decorator="['refund_reason']"
                            :style="{ width: '400px' }"
                            size="small"
                            placeholder="Select a Refund Reason"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of refundReasonList"
                                :key="item.code"
                                >{{ item.name }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">
                {{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit">
                {{ $t('action.submit') }}
            </a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import DataForm from '~/shared/components/data-form.vue'
import { namespace } from 'vuex-class'
import { set } from 'vue/types/umd'
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')

interface detailData {
    default_code: string
    price_unit: number
}

// interface orderDetail []

@Component({
    components: {}
})
export default class CancelOrderForm extends Vue {
    @Emit('modal.submit')
    private submit(values) {
        return values
    }

    @Emit('modal.cancel')
    private cancel() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
        return
    }

    @Prop()
    private order_id_list

    @Prop()
    private changeSpinning

    @Prop({ default: Array })
    private refundReasonList

    private orderData = {
        paypal: '',
        receiver_name: '',
        iban: ''
    }

    @Prop()
    private platform

    private data: any[] = []

    private form2: any

    public mounted() {
        if (this.order_id_list) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form2.setFieldsValue(this.orderData)
    }

    public created() {
        this.form2 = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form2.validateFields({}, (err, values) => {
            if (!err) {
                if (
                    this.refundReasonList.length &&
                    values['refund_reason'] == undefined
                ) {
                    this.$message.info('please selecte refund reason')
                    return
                } else if (this.refundReasonList.length == 0) {
                    values['refund_reason'] = ''
                }

                values['order_id_list'] = this.order_id_list
                this.submit(values)
            }
        })
    }

    private handleChange(value, row, column) {
        row[column] = value
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
        "columns":{
            "type":"Type",
            "need_refund":"Need Refund",
            "need_origin":"Need Origin",
            "amount":"Amount",
            "special_refund":"Special Refund",
            "refund_reason":"Reason",
            "paypal":"PayPal",
            "street":"Street",
            "receiver_name":"Receiver Name",
            "nr":"Nr.",
            "iban":"IBAN",
            "city":"City",
            "bic":"BIC",
            "country":"Country",
            "bank_name":"Bank Name",
            "zip":"Zip",
            "refund_memo":"Refund Memo"
            
        },
        "action":{
            "submit":"Submit",
            "add":"Add",
            "del":"Delete",
            "cancel":"Cancel"
        }
    },
    "zh-cn":{
        "sku":"SKU",
        "product_name":"产品名称",
        "order_qty":"订单数量",
        "unit_price":"单价",
        "available_qty":"可用数量",
        "taxes":"税额",
        "fullfilment_center":"履行中心",
        "columns":{    
            "type":"类型",
            "need_refund":"需要退款",
            "need_origin":"需要原始发票",
            "amount":"金额",
            "special_refund":"特殊退款",
            "refund_reason":"原因",
            "paypal":"PayPal",
            "street":"街道",
            "receiver_name":"接受人",
            "nr":"门牌号",
            "iban":"IBAN",
            "city":"城市",
            "bic":"BIC",
            "country":"国家",
            "bank_name":"银行名称",
            "zip":"邮编",
            "refund_memo":"退款说明"
        },
        "action":{
            "submit":"提交",
            "add":"添加",
            "del":"删除",
            "cancel":"取消"
        }
  }
}
</i18n>
