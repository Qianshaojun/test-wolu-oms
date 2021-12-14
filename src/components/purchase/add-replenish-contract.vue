<template>
    <section class="component order-base-detail">
        <a-card class="margin-top order-edit-page">
            <a-form
                :form="form"
                :labelCol="{ span: 7 }"
                :wrapperCol="{ span: 16, offset: 1 }"
            >
                <a-row :gutter="24">
                    <a-col :span="12" class="height50">
                        <a-form-item :label="$t('supplier')" required>
                            <a-select
                                showSearch
                                v-decorator="[
                                    `vendor_id`,
                                    {
                                        initialValue: defaultVendor
                                    },
                                    { rules: rules.required }
                                ]"
                                :style="{ width: '240px' }"
                                size="small"
                                :filterOption="filterSelectOption"
                            >
                                <a-select-option
                                    v-for="item of vendorList"
                                    :key="item.code"
                                    :value="item.code"
                                >
                                    {{ item.name }}
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" class="height50">
                        <a-form-item :label="$t('order_date')">
                            <a-date-picker
                                v-decorator="[
                                    `order_date`,
                                    {
                                        initialValue: moment(Date.now())
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                                @change="e => onCreateDateChange(e)"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" class="height50">
                        <a-form-item :label="$t('company_id')" required>
                            <a-select
                                showSearch
                                v-decorator="[
                                    'order_company_id',
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                :style="{
                                    width: '100%',
                                    'max-width': '240px'
                                }"
                                size="small"
                                placeholder="Please Select"
                            >
                                <a-select-option value="woltu" key="woltu">
                                    Woltu
                                </a-select-option>
                                <a-select-option value="eugad" key="eugad">
                                    EUGAD
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" class="height50">
                        <a-form-item :label="$t('give_date')">
                            <a-date-picker
                                v-decorator="[
                                    `give_date`,
                                    {
                                        initialValue: moment(giveDate)
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                                @change="e => onGiveDateChange(e)"
                            />
                        </a-form-item>
                    </a-col>
                    <!-- <a-col :span="12">
                            <a-form-item
                                :label="$t('is_add_purchase_contract')"
                            >
                                <a-checkbox
                                    v-decorator="[
                                        `is_add_purchase_contract`,
                                        { initialValue: false }
                                    ]"
                                    v-model="company_account"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('is_add_delivery_contract')"
                            >
                                <a-checkbox
                                    v-decorator="[
                                        `is_add_delivery_contract`,
                                        { initialValue: false }
                                    ]"
                                    v-model="company_account"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('purchase_contract_no')">
                                <a-input
                                    v-decorator="[`purchase_contract_no`]"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('delivery_contract_no')">
                                <a-input
                                    v-decorator="[`delivery_contract_no`]"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col> -->
                </a-row>
            </a-form>
        </a-card>
        <!-- <div style="padding:20px 20px 0 20px;">
            <a-button @click="addBtn" type="primary" size="small"
                ><a-icon type="plus" />{{ $t('actions.add') }}</a-button
            >
        </div> -->
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;"
            rowKey="id"
            :customRow="
                rowKey => ({
                    on: {
                        // 单击每行
                        click: () => {
                            currentRow = rowKey.id
                        }
                    }
                })
            "
            bordered
        >
            <a-table-column
                :title="$t('req_name')"
                key="req_name"
                align="center"
            >
                <template slot-scope="row">
                    <span>{{ row.req_name }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('default_code')"
                key="default_code"
                align="center"
            >
                <template slot-scope="row">
                    <span>{{ row.default_code }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_qty')"
                key="product_qty"
                align="center"
            >
                <template slot-scope="row">
                    <a-input-number
                        decimalSeparator=","
                        v-if="currentRow == row.id && editable"
                        v-decorator="['product_qty']"
                        :value="row.product_qty"
                        :min="0"
                        :max="row.maxQty"
                        size="small"
                        :style="{ width: '100%', background: '#ecc5e9' }"
                        @change="e => onRowChange(row, 'product_qty', e)"
                    />
                    <span v-else>{{ row.product_qty }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_uom')"
                key="product_uom"
                align="center"
            >
                <template slot-scope="row">
                    <span>{{
                        row.id && row.id != 'summary' ? 'Units' : ''
                    }}</span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('product_purchase_price')"
                key="product_purchase_price"
                align="center"
            >
                <template slot-scope="row">
                    <span>
                        {{ row.product_purchase_price }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sales_expected_give_date')"
                key="sales_expected_give_date"
                align="center"
            >
                <template slot-scope="row">
                    <span>
                        {{ row.sales_expected_give_date }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('date_expected')"
                key="date_expected"
                align="center"
            >
                <template slot-scope="row">
                    <span>
                        {{ row.date_expected }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('contract_give_date')"
                key="contract_give_date"
                align="center"
            >
                <template slot-scope="row">
                    <a-date-picker
                        class="required"
                        v-if="currentRow == row.id && editable"
                        v-decorator="['contract_give_date']"
                        :default-value="
                            row.contract_give_date
                                ? moment(row.contract_give_date, 'YYYY-MM-DD')
                                : null
                        "
                        :style="{ width: '100%' }"
                        size="small"
                        format="YYYY-MM-DD"
                        @change="e => onRowChange(row, 'contract_give_date', e)"
                    />
                    <span v-else>{{
                        row.contract_give_date
                            ? row.contract_give_date.format('YYYY-MM-DD')
                            : ''
                    }}</span>
                </template>
            </a-table-column>
            <!-- <a-table-column
                :title="$t('product_uom')"
                key="product_uom"
                align="center"
            >
                <template slot-scope="row">
                    <span>
                        {{ row.product_uom }}
                    </span>
                </template>
            </a-table-column> -->
            <a-table-column
                :title="$t('user_require')"
                key="user_require"
                align="center"
            >
                <template slot-scope="row">
                    <span>
                        {{ row.user_require | dict2(systemUsers) }}
                    </span>
                </template>
            </a-table-column>
            <a-table-column key="action" align="center">
                <template slot-scope="row">
                    <a-popconfirm
                        v-if="row.id && row.id != 'summary'"
                        :title="$t('delete')"
                        :okText="$t('actions.ok')"
                        :cancelText="$t('actions.cancel')"
                        placement="left"
                        @confirm="onDel(row)"
                    >
                        <a class="btnDel"><a-icon type="delete"/></a>
                    </a-popconfirm>
                </template>
            </a-table-column>
        </a-table>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.submit')
            }}</a-button>
        </div>
    </section>
</template>

<style>
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}
.height50 {
    height: 50px;
}
.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import ModifyMemo from '@/components/cs_email_return/chat-modify-memo.vue'

@Component({
    components: {
        ModifyMemo
    }
})
export default class AddReplenishContract extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    info: any

    @Prop()
    systemUsers: any

    @Prop()
    vendorList: any

    private form: any

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private operateCnt: any = 0

    private giveDate: any = null

    private defaultVendor: any = ''

    private moment = moment

    private summaryList: any = ['product_qty']

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.info)
    }

    private mounted() {
        this.giveDate = this.getDay(20)
        if (this.info) {
            this.data = this.info.map(x => {
                x['maxQty'] = x.product_qty
                return x
            })
            if (
                this.summaryList != undefined &&
                this.summaryList.length &&
                this.data.length
            ) {
                let ret: any = CommonService.getSummaryData(
                    this.data,
                    this.summaryList
                )
                ret['id'] = 'summary'
                this.data.push(ret)
            }

            this.defaultVendor = this.data[0].vendor_id
            this.setFormValues()
        }

        this.$nextTick(() => {
            let querySelector = 'tr[data-row-key="summary"]'
            let tr: any = document.querySelector(querySelector)
            tr.style.background = '#fdfdfd'
        })
    }

    @Watch('info')
    private onInfoChange() {
        if (this.info) {
            this.data = this.info.map(x => {
                if (!x.maxQty) {
                    x['maxQty'] = x.product_qty
                }

                return x
            })
            this.defaultVendor = this.data[0].vendor_id

            if (
                this.summaryList != undefined &&
                this.summaryList.length &&
                this.data.length
            ) {
                let ret: any = CommonService.getSummaryData(
                    this.data,
                    this.summaryList
                )
                ret['id'] = 'summary'
                this.data.push(ret)
            }

            this.setFormValues()
        }
    }

    @Watch('data')
    private onDataChange() {
        if (this.data.length) {
            let sm = this.data.find(x => x.id == 'summary')
            if (sm) {
                let ret: any = CommonService.getSummaryData(
                    this.data,
                    this.summaryList
                )
                for (let i of this.summaryList) {
                    sm[i] = ret[i]
                }
            }
        }
    }

    private addBtn() {
        this.data.push({
            index: UUID.generate(),
            product: '',
            finish_qty: 0,
            is_finish: false,
            quantity: 0,
            warehouse_id: ''
        })
        this.$emit('change', this.data)
        this.currentRow = this.data.length
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }
        if (this.summaryList.includes(column)) {
            this.onDataChange()
        }
        this.$emit('change', this.data)
    }

    private cancelBtn(e) {
        e.stopPropagation()
        this.currentRow = -1
    }

    private onDel(row) {
        this.currentRow = -1
        let item = this.data.find(x => x.id === row.id)
        item['save_flag'] = 2
        this.data = this.data.filter(x => !x.save_flag || x.save_flag < 2)

        this.$emit('change', this.data)
    }

    private onSubmit() {
        //save

        this.form.validateFields({}, (err, values) => {
            if (!err) {
                if (!this.data.length) {
                    this.$message.error('至少添加一条明细信息')
                    return
                }
                if (values['order_date']) {
                    values['order_date'] = values['order_date']
                        .format('YYYY-MM-DD')
                        .toString()
                }

                if (values['give_date']) {
                    values['give_date'] = values['give_date']
                        .format('YYYY-MM-DD')
                        .toString()

                    //判断交期是否一致
                    let item = this.data.filter(
                        x =>
                            x.id != 'summary' &&
                            x.sales_expected_give_date != values['give_date']
                    )
                    if (item.length) {
                        this.$modal
                            .open(
                                ModifyMemo,
                                {
                                    memo: ''
                                },
                                {
                                    title: '合同交期和运营期望交期不一致的原因',
                                    width: '800px'
                                }
                            )
                            .subscribe(data => {
                                for (let i in item) {
                                    item[i].import_memo = data
                                }
                                values['order_lines'] = this.data
                                    .filter(y => y.id != 'summary')
                                    .map(x => {
                                        return {
                                            line_id: x.id,
                                            product_id: x.product_id,
                                            default_code: x.default_code,
                                            qty: x.product_qty,
                                            give_date: x.contract_give_date,
                                            import_memo: x.import_memo
                                                ? x.import_memo
                                                : ''
                                        }
                                    })
                                this.subData(values)
                            })
                    } else {
                        values['order_lines'] = this.data
                            .filter(y => y.id != 'summary')
                            .map(x => {
                                return {
                                    line_id: x.id,
                                    product_id: x.product_id,
                                    default_code: x.default_code,
                                    qty: x.product_qty,
                                    give_date: x.contract_give_date,
                                    import_memo: ''
                                }
                            })
                        this.subData(values)
                    }
                }
            }
        })
    }

    private subData(values) {
        this.innerAction.setActionAPI(
            'purchase_requirement/save_pre_make_order',
            CommonService.getMenuCode('purchase-pre-make-order')
        )
        this.publicService
            .modify(
                new RequestParams(values, {
                    loading: this.loadingService,
                    innerAction: this.innerAction
                })
            )
            .subscribe(
                data => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDay(day, from = new Date()) {
        var targetday_milliseconds = from.getTime() + 1000 * 60 * 60 * 24 * day

        from.setTime(targetday_milliseconds) //注意，这行是关键代码

        var tYear = from.getFullYear()

        var tMonth = from.getMonth()

        var tDate = from.getDate()

        tMonth = this.doHandleMonth(tMonth + 1)

        tDate = this.doHandleMonth(tDate)

        return tYear + '-' + tMonth + '-' + tDate
    }

    private doHandleMonth(month) {
        var m = month

        if (month.toString().length == 1) {
            m = '0' + month
        }

        return m
    }

    private onCreateDateChange(e) {
        let date = e.format('YYYY-MM-DD').toString()
        let from = new Date(date)
        this.giveDate = this.getDay(20, from)
    }

    private onGiveDateChange(e) {
        for (let i in this.data) {
            if (this.data[i].id != 'summary') {
                this.data[i]['contract_give_date'] = e
            }
        }
    }
}
</script>

<i18n>
{
  "en-us":{
    "supplier":"Supplier",
    "give_date":"Give Date",
    "company_id":"Company",
    "order_date":"Order Date",
    "is_add_purchase_contract":"is_add_purchase_contract",
    "is_add_delivery_contract":"is_add_delivery_contract",
    "delivery_contract_no":"Delivery Contract No.",
    "purchase_contract_no":"Purchase Contract No.",
    "req_name":"Req Name",
    "default_code":"Default Code",
    "product_qty":"Quantity",
    "product_purchase_price":"Product Purchase Price",
    "sales_expected_give_date":"Sales Expected Give Date",
    "date_expected":"Expected Date",
    "contract_give_date":"Contract Given Date",
    "product_uom":"Product Uom",
    "user_require":"Require User",
    "delete":"Are you sure delete?",
    "actions":{
      "add":"Add",
      "action":"Action",
      "save":"Save",
      "delete":"Delete",
      "cancel":"Cancel",
      "ok":"submit"
    }
  },
  "zh-cn":{
    "req_name":"需求编号",
    "default_code":"货号",
    "product_qty":"数量",
    "product_purchase_price":"产品采购价",
    "sales_expected_give_date":"运营期望交期",
    "date_expected":"期望入库",
    "contract_give_date":"合同交期",
    "product_uom":"产品计量单位",
    "user_require":"需求人",
    "supplier":"供货商",
    "give_date":"合同交期",
    "company_id":"公司",
    "order_date":"订单日期",
    "is_add_purchase_contract":"是否追加采购合同",
    "is_add_delivery_contract":"是否追加发货合同",
    "delivery_contract_no":"发货合同号",
    "purchase_contract_no":"补货合同号",
    "delete":"确定要删除吗？",
    "actions":{
      "add":"新增",
      "action":"操作",
      "save":"保存",
      "delete":"删除",
      "cancel":"取消",
      "ok":"确定"
    }
  }
}
</i18n>
