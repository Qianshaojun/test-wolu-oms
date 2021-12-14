<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 17, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="11">
                    <a-form-item :label="$t('columns.type')">
                        <a-select
                            v-decorator="['type', { initialValue: 10 }]"
                            size="small"
                            v-model="currentType"
                            placeholder="Select a Type"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of typeList"
                                :key="item.code"
                                >{{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                    <a-form-item :label="$t('columns.need_refund')">
                        <a-checkbox
                            v-decorator="[
                                `is_need_refund`,
                                { initialValue: false }
                            ]"
                            size="small"
                            style="float:left;"
                            v-model="isNeedRefund"
                        ></a-checkbox>
                        <p
                            style="line-height:30px;margin-left:30px;display:block;background:#d2d2ff;"
                        >
                            (Do you really need a refund? if Yes,plz tick the
                            checkbox.)
                        </p>
                    </a-form-item>
                    <template v-if="isNeedRefund && fromEbay">
                        <a-form-item :label="$t('columns.refundWay')">
                            <a-radio-group
                                name="radioGroup"
                                :default-value="'PayPal'"
                                @change="changeRefundWay"
                            >
                                <a-radio :value="'PayPal'">
                                    PayPal
                                </a-radio>
                                <a-radio :value="'MoneyXferAcceptedInCheckout'">
                                    Bank
                                </a-radio>
                            </a-radio-group>
                        </a-form-item>
                    </template>
                    <template v-if="isNeedRefund">
                        <template v-if="checkValue === 'PayPal' || !fromEbay">
                            <a-form-item :label="$t('columns.paypal')">
                                <a-input
                                    v-decorator="[
                                        `paypal`,
                                        {
                                            rules: [
                                                {
                                                    required: fromEbay
                                                        ? true
                                                        : false,
                                                    message: '必填项'
                                                }
                                            ]
                                        }
                                    ]"
                                    size="small"
                                />
                            </a-form-item>
                        </template>
                        <template
                            v-if="
                                checkValue === 'MoneyXferAcceptedInCheckout' ||
                                    !fromEbay
                            "
                        >
                            <a-form-item :label="$t('columns.receiver_name')">
                                <a-input
                                    v-decorator="[`receiver_name`]"
                                    size="small"
                                />
                            </a-form-item>
                            <a-form-item :label="$t('columns.iban')">
                                <a-input v-decorator="[`iban`]" size="small" />
                            </a-form-item>
                            <a-form-item :label="$t('columns.bic')">
                                <a-input v-decorator="[`bic`]" size="small" />
                            </a-form-item>
                            <a-form-item :label="$t('columns.bank_name')">
                                <a-input
                                    v-decorator="[`bank_name`]"
                                    size="small"
                                />
                            </a-form-item>
                            <a-form-item :label="$t('columns.refund_memo')">
                                <a-textarea
                                    v-decorator="[`refund_memo`]"
                                    rows="2"
                                    cols="40"
                                    size="small"
                                ></a-textarea>
                            </a-form-item>
                        </template>
                    </template>
                </a-col>
                <a-col :span="11">
                    <a-form-item
                        :label="$t('columns.amount')"
                        v-if="currentType == 30"
                    >
                        <a-input-number
                            v-decorator="[`amount`]"
                            size="small"
                            decimalSeparator=","
                        />
                    </a-form-item>
                    <a-form-item :label="$t('columns.need_return_goods')">
                        <a-checkbox
                            v-decorator="[`need_return_goods`]"
                            size="small"
                            style="float:left;"
                            v-model="defaultNeedReturnGoods"
                        ></a-checkbox>
                    </a-form-item>
                    <template v-if="isNeedRefund">
                        <a-form-item :label="$t('columns.special_refund')">
                            <a-checkbox
                                v-decorator="[`special_refund`]"
                                size="small"
                            ></a-checkbox>
                        </a-form-item>
                        <a-form-item :label="$t('columns.description')">
                            <a-input
                                v-decorator="[`description`]"
                                size="small"
                            />
                        </a-form-item>
                        <a-form-item :label="$t('columns.street')">
                            <a-input v-decorator="[`street`]" size="small" />
                        </a-form-item>
                        <a-form-item :label="$t('columns.nr')">
                            <a-input v-decorator="[`nr`]" size="small" />
                        </a-form-item>
                        <a-form-item :label="$t('columns.city')">
                            <a-input v-decorator="[`city`]" size="small" />
                        </a-form-item>
                        <a-form-item :label="$t('columns.country')">
                            <a-select
                                showSearch
                                v-decorator="['country_id']"
                                :style="{ width: '200px' }"
                                size="small"
                                :filterOption="filterSelectOption"
                                :placeholder="$t('selectCountry')"
                            >
                                <a-select-option
                                    :value="item.code"
                                    v-for="item of countryList"
                                    :key="item.code"
                                    >{{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                        <a-form-item :label="$t('columns.zip')">
                            <a-input v-decorator="[`zip`]" size="small" />
                        </a-form-item>
                    </template>
                </a-col>

                <!-- <a-col :span="11">
                    <a-form-item :label="$t('columns.need_origin')">
                        <a-checkbox
                            v-decorator="[`is_need_origin`]"
                            size="small"
                            style="float:left;"
                            v-model="isNeedOrigin"
                        ></a-checkbox>
                    </a-form-item>
                </a-col> -->
            </a-row>
        </a-form>
        <div v-show="currentType === 10" style="margin: 20px 0">
            <div style="margin-bottom: 10px">
                <a-button
                    type="primary"
                    @click="handleAdd"
                    :disabled="data.length >= detailCount"
                    >{{ $t('action.add') }}
                </a-button>
                <a-button
                    type="danger"
                    @click="batchDel"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 5px"
                    >{{ $t('action.del') }}
                </a-button>
            </div>

            <a-table
                :dataSource="data"
                :pagination="false"
                rowKey="sku"
                :scroll="{ y: 200 }"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, selectedRows) => {
                        selectedRowKeys = keys
                    }
                }"
                bordered
            >
                <a-table-column
                    :title="$t('sku')"
                    key="default_code"
                    data-index="default_code"
                    width="250px"
                    align="center"
                >
                    <template slot-scope="default_code, row">
                        <a-select
                            showSearch
                            style="width: 100%"
                            placeholder="Select a Sku"
                            :defaultValue="default_code"
                            :value="row.default_code"
                            @change="e => handleChange(e, row, 'default_code')"
                        >
                            <a-select-option
                                :value="item"
                                v-for="item of skuSet"
                                :key="item"
                                >{{ item }}
                            </a-select-option>
                        </a-select>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('order_qty')"
                    key="quantity"
                    data-index="quantity"
                    align="center"
                    width="150px"
                >
                    <template slot-scope="quantity, row">
                        <a-input-number
                            decimalSeparator=","
                            :value="quantity"
                            @change="e => handleChange(e, row, 'quantity')"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('unit_price')"
                    key="price_unit"
                    data-index="price_unit"
                    align="center"
                    width="200px"
                >
                    <template slot-scope="price_unit, row">
                        <a-input-number
                            decimalSeparator=","
                            :value="price_unit"
                            @change="e => handleChange(e, row, 'price_unit')"
                        />
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('delete')"
                    key="delete"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-icon
                            @click="onDelete(row)"
                            type="delete"
                            style="color:red"
                        />
                    </template>
                </a-table-column>
            </a-table>
            <div style="width:100%;display:inline-block;margin-top: 8px">
                <div style="width:200px;float:right;">
                    <p style="padding:0;margin:0;">
                        {{ $t('order_total') }}：{{
                            detailInfo.amount_total || 0
                        }}
                        {{ detailInfo.symbol || '' }}
                    </p>
                    <p style="padding:0;margin:0;border-bottom:1px solid #aaa;">
                        {{ $t('has_refund') }}：{{
                            detailInfo.amount_refunded || 0
                        }}
                        {{ detailInfo.symbol || '' }}
                    </p>
                    <p style="padding:0;margin:0;">
                        Amount：{{ detailInfo.amount_remaining || 0 }}
                        {{ detailInfo.symbol || '' }}
                    </p>
                </div>
            </div>
        </div>
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
import { OrderService } from '~/services/order.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { Form } from 'ant-design-vue'
import DataForm from '~/shared/components/data-form.vue'
import { namespace } from 'vuex-class'
import UUID from 'uuidjs'
import { CommonService } from '@/shared/utils/common.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { PublicService } from '@/services/public.service'

const datasModule = namespace('datasModule')

interface detailData {
    default_code: string
    price_unit: number
}

// interface orderDetail []

@Component({
    components: {}
})
export default class RefundForm extends Vue {
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
    private order_id

    @Prop()
    private changeSpinning

    private orderService = new OrderService()
    private loadingService = new LoadingService()
    private innerAction = new InnerActionService()
    private publicService = new PublicService()

    private selectedRowKeys: any[] = []
    private skuSet: any = []
    private detailCount: number = 0
    private orderData = {
        type: 10,
        is_need_refund: false,
        is_need_origin: true,
        amount: 0,
        special_refund: false,
        reason: '',
        paypal: false,
        street: '',
        receiver_name: '',
        nr: '',
        iban: '',
        city: '',
        bic: '',
        country_id: 0,
        bank_name: '',
        zip: '',
        refund_memo: '',
        need_return_goods: true
    }

    @Prop()
    private countryList

    private data: any[] = []

    private detailInfo: any = {}

    private form2: any

    private rules = {
        companyName: [{ required: true, message: '必填' }]
    }

    private isNeedRefund: Boolean = false
    private defaultNeedReturnGoods: Boolean = true
    private isNeedOrigin: Boolean = true
    private currentType: number = 10

    private fromEbay: boolean = false

    private typeList = [
        { code: 10, name: 'Part Refund' },
        { code: 20, name: 'Full Refund' },
        { code: 30, name: 'Supplement' }
    ]

    //动态校验条件
    private receiverNameRequired: boolean = true
    private ibanRequired: boolean = true

    private inputReceiverName(e) {
        this.ibanRequired = false
        this.$nextTick(() => {
            this.form2.validateFields(['receiver_name'], { force: true })
        })
    }

    private checkValue: string = 'PayPal'

    private changeRefundWay(e) {
        this.checkValue = e.target.value
    }

    public setFormValues() {
        this.form2.setFieldsValue(this.orderData)
    }

    public created() {
        this.form2 = this.$form.createForm(this)
        if (this.order_id) {
            this.setFormValues()
            this.getOrderDetail()
        }
    }

    private onSubmit() {
        this.form2.validateFields({}, (err, values) => {
            if (!err) {
                values['order_id'] = this.order_id
                if (values['type'] === 10) {
                    values['refund_detail_list'] = this.data
                }
                if (values['type'] === 20 || !values['amount']) {
                    values['amount'] = 0
                }
                values['is_need_origin'] = this.isNeedOrigin
                if (this.checkValue) {
                    values['payment_method'] = this.checkValue
                    if (
                        this.fromEbay &&
                        this.checkValue === 'MoneyXferAcceptedInCheckout'
                    ) {
                        if (
                            !this.form2.getFieldValue('receiver_name') &&
                            !this.form2.getFieldValue('iban')
                        ) {
                            this.$message.error('请输入接受人或IBAN中的一项')
                            return
                        }
                    }
                }
                this.reFund(values)
            }
        })
    }

    private reFund(values) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.orderService.refund(new RequestParams(values, loading)).subscribe(
            data => {
                this.submit(values), this.$message.success('success')
            },
            err => {
                if (this.changeSpinning) {
                    this.changeSpinning(false)
                }
                this.$message.error(err.message)
            }
        )
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private getOrderDetail() {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.orderService
            .getDetail(new RequestParams({ order_id: this.order_id }, loading))
            .subscribe(
                data => {
                    this.detailInfo = data
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    let order_lines = data.order_lines
                    if (data.is_amazon) {
                        this.isNeedOrigin = false
                        this.orderData.is_need_origin = false
                    } else if (data.is_ebay) {
                        this.fromEbay = true
                    } else {
                        this.isNeedOrigin = true
                    }
                    let detail_data: any = []
                    const s = new Set()
                    this.detailCount = order_lines.length
                    for (let i = 0; i < order_lines.length; i++) {
                        let detail = {}
                        detail['key'] = UUID.generate()
                        detail['default_code'] = order_lines[i]['default_code']
                        detail['quantity'] = 1
                        detail['price_unit'] = order_lines[i]['price_unit']
                        detail_data.push(detail)
                        s.add(order_lines[i]['default_code'])
                    }
                    this.data = detail_data
                    console.log('data', this.data)
                    this.skuSet = s
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error('获取订单详情数据失败')
                }
            )
    }

    private handleChange(value, row, column) {
        row[column] = value
    }

    private onDelete(row) {
        let index = this.data.findIndex(x => x.key === row.key)
        this.data.splice(index, 1)
    }

    private batchDel() {
        for (let i in this.selectedRowKeys) {
            let index = this.data.findIndex(x => x.key === i)
            this.data.splice(index, 1)
        }
        this.selectedRowKeys = []
    }

    private handleAdd() {
        const newData = {
            key: UUID.generate(),
            default_code: '',
            quantity: 1,
            price_unit: 0
        }
        this.data.unshift(newData)
    }
}
</script>

<i18n>
{
    "en-us": {
        "sku": "SKU",
        "product_name": "Product Name",
        "order_qty": "Order Qty",
        "unit_price": "Unit_Price",
        "available_qty": "Available Qty",
        "taxes": "Taxes",
        "fullfilment_center": "Fullfilment Center",
        "delete": "Delete",
        "selectCountry": "Select a Country",
        "order_total": "Order Total Income",
        "has_refund": "Refunds incurred",
        "columns": {
            "type": "Type",
            "need_refund": "Need Refund",
            "need_origin": "Need Origin",
            "amount": "Amount",
            "special_refund": "Special Refund",
            "description": "Reason",
            "paypal": "PayPal",
            "street": "Street",
            "receiver_name": "Receiver Name",
            "nr": "Nr.",
            "iban": "IBAN",
            "city": "City",
            "bic": "BIC",
            "country": "Country",
            "bank_name": "Bank Name",
            "zip": "Zip",
            "refund_memo": "Refund Memo",
            "need_return_goods": "Need Return Goods",
            "refundWay": "Refund Way"
        },
        "action": {
            "submit": "Submit",
            "add": "Add",
            "del": "Delete",
            "cancel": "Cancel"
        }
    },
    "zh-cn": {
        "sku": "SKU",
        "product_name": "产品名称",
        "order_qty": "订单数量",
        "unit_price": "单价",
        "available_qty": "可用数量",
        "taxes": "税额",
        "fullfilment_center": "履行中心",
        "delete": "删除",
        "selectCountry": "选择国家",
        "order_total": "订单总收入",
        "has_refund": "已发生退款",
        "columns": {
            "type": "类型",
            "need_refund": "需要退款",
            "need_origin": "需要原始发票",
            "amount": "金额",
            "special_refund": "特殊退款",
            "description": "原因",
            "paypal": "PayPal",
            "street": "街道",
            "receiver_name": "接受人",
            "nr": "门牌号",
            "iban": "IBAN",
            "city": "城市",
            "bic": "BIC",
            "country": "国家",
            "bank_name": "银行名称",
            "zip": "邮编",
            "refund_memo": "退款说明",
            "need_return_goods": "需要退货",
            "refundWay": "退款方式"
        },
        "action": {
            "submit": "提交",
            "add": "添加",
            "del": "删除",
            "cancel": "取消"
        }
    }
}
</i18n>
