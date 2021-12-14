<template>
    <section class="component customer-detail">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="10">
                    <a-form-item :label="$t('columns.warehouse_id')">
                        <a-input
                            v-decorator="[`warehouse_id`]"
                            size="small"
                            disabled
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.req_type')" required>
                        <a-select
                            default-value="development"
                            v-decorator="[`req_type`]"
                        >
                            <a-select-option
                                key="operational"
                                value="operational"
                                >Operational</a-select-option
                            >
                            <a-select-option
                                key="development"
                                value="development"
                                >Development</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    期望交期（批量）
                    <a-date-picker
                        :default-value="batch_give_date"
                        @change="onChangeGiveDate"
                        size="small"
                    />
                </a-col>
                <a-col :span="10">
                    期望入库日期（批量）
                    <a-date-picker
                        :default-value="batch_date_expected"
                        @change="onChangeDateExpected"
                        size="small"
                    />
                </a-col>
                <a-col :span="4">
                    <a-button @click="batchEditDate">批量修改</a-button>
                </a-col>
            </a-row>
        </a-form>
        <a-card class="margin-y">
            <a-table
                :columns="columns"
                :data-source="rows"
                rowKey="default_code"
                :scroll="{ y: 500 }"
                class="components-table-demo-nested"
                @expand="expand"
            >
                <a-table
                    slot="expandedRowRender"
                    slot-scope="record"
                    :columns="innerColumns"
                    :rowKey="record.default_code"
                    :data-source="innerData[record.default_code]"
                    :pagination="false"
                >
                    <template
                        slot="sales_expected_give_date"
                        slot-scope="sales_expected_give_date, row"
                    >
                        <a-date-picker
                            :value="sales_expected_give_date"
                            @change="
                                e =>
                                    onInputChange(
                                        e,
                                        row,
                                        record,
                                        'sales_expected_give_date'
                                    )
                            "
                            size="small"
                        />
                    </template>
                    <template
                        slot="date_expected"
                        slot-scope="date_expected, row"
                    >
                        <a-date-picker
                            :value="date_expected"
                            @change="
                                e =>
                                    onInputChange(
                                        e,
                                        row,
                                        record,
                                        'date_expected'
                                    )
                            "
                            size="small"
                        />
                    </template>
                    <template slot="coefficient" slot-scope="coefficient, row">
                        <a-input-number
                            :value="coefficient"
                            @change="
                                e =>
                                    onInputChange(e, row, record, 'coefficient')
                            "
                            :style="{ width: '100%' }"
                            :min="0"
                            size="small"
                            decimalSeparator=","
                        />
                    </template>
                    <template slot="product_qty" slot-scope="product_qty, row">
                        <a-input-number
                            :value="product_qty"
                            @change="
                                e =>
                                    onInputChange(e, row, record, 'product_qty')
                            "
                            :style="{ width: '100%' }"
                            :min="0"
                            size="small"
                            decimalSeparator=","
                        />
                    </template>
                </a-table>
            </a-table>
        </a-card>
        <div class="flex-row justify-content-end margin-y">
            <a-button class="margin-x" type="primary" @click="onSubmit()">
                {{ $t('action.commit') }}
            </a-button>
            <a-button class="margin-x" @click="cancel()">
                {{ $t('action.cancel') }}
            </a-button>
        </div>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { RequestParams } from '../../core/http'
import { PurchaseService } from '../../services/purchase.service'
import { ProductService } from '~/services/product.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import moment from 'moment'

@Component({
    components: {}
})
export default class PurchaseApply extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {}

    @Prop()
    private rows

    @Prop()
    private warehouse_id

    @Prop()
    private form_data

    private form: any

    private data: any

    private batch_give_date: any

    private moment = moment

    private batch_date_expected: any
    // 里层数据{sku:[{},{}]}
    private innerData = {}

    private selectedRowKeys: any[] = []

    // Loading服务
    private loadingService = new LoadingService()

    private purchaseService = new PurchaseService()

    private productService = new ProductService()

    private columns = [
        { title: 'sku', dataIndex: 'default_code', key: 'default_code' },
        {
            title: this.$t('columns.product_qty'),
            dataIndex: 'product_qty',
            key: 'product_qty'
        },
        {
            title: this.$t('columns.min_qty'),
            dataIndex: 'min_qty',
            key: 'min_qty'
        }
    ]

    private innerColumns = [
        { title: 'sku', dataIndex: 'default_code', key: 'default_code' },
        {
            title: this.$t('columns.sales_expected_give_date'),
            dataIndex: 'sales_expected_give_date',
            format: 'YYYY-MM-DD',
            key: 'sales_expected_give_date',
            scopedSlots: { customRender: 'sales_expected_give_date' }
        },
        {
            title: this.$t('columns.date_expected'),
            // defaultValue: 'date_expected',
            dataIndex: 'date_expected',
            format: 'YYYY-MM-DD',
            scopedSlots: { customRender: 'date_expected' },
            key: 'date_expected'
        },
        {
            title: this.$t('columns.coefficient'),
            dataIndex: 'coefficient',
            key: 'coefficient',
            scopedSlots: { customRender: 'coefficient' }
        },
        {
            title: this.$t('columns.product_qty'),
            dataIndex: 'product_qty',
            scopedSlots: { customRender: 'product_qty' },
            key: 'product_qty'
        }
    ]

    public mounted() {
        this.form.setFieldsValue(this.form_data)
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private onInputChange(e, row, record, column) {
        const data = [...this.innerData[record.default_code]]
        const [target] = data.filter(
            item => row.default_code === item.default_code
        )
        if (target) {
            target[column] = e
        }
        this.innerData[record.default_code] = data
        let _obj = JSON.stringify(this.innerData)
        this.innerData = JSON.parse(_obj)

        if (column === 'coefficient') {
            let sum = 0
            const data2 = [...this.innerData[record.default_code]]
            for (let sub of data2) {
                sum += sub.coefficient
            }
            for (let sub2 of data2) {
                sub2.product_qty = record.product_qty * (sub2.coefficient / sum)
            }
            this.innerData[record.default_code] = data2
            let _obj = JSON.stringify(this.innerData)
            this.innerData = JSON.parse(_obj)
        }
    }

    private expand(expanded, record) {
        if (expanded && !this.innerData.hasOwnProperty(record.default_code)) {
            this.productService
                .queryProductPack(
                    new RequestParams(
                        {
                            default_code: record.default_code
                        },
                        { loading: this.loadingService }
                    )
                )
                .subscribe(
                    data => {
                        let sku_list: any[] = []
                        for (let sku of data) {
                            sku_list.push({
                                default_code: sku,
                                date_expected: '',
                                sales_expected_give_date: '',
                                coefficient: 0,
                                product_qty: 0,
                                qty_uom: data[0].qty_uom
                            })
                        }

                        this.innerData[record.default_code] = sku_list
                        let _obj = JSON.stringify(this.innerData)
                        this.innerData = JSON.parse(_obj)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        }
    }

    private onSubmit() {
        let inner_data = this.innerData
        let req_line_list: any[] = []
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                for (var item in inner_data) {
                    req_line_list = req_line_list.concat(inner_data[item])
                }
                req_line_list.forEach(function(item, index, arr) {
                    if (item['product_qty'] == 0) {
                        arr.splice(index, 1)
                    }
                })
                for (let i = 0; i < req_line_list.length; i++) {
                    let row = req_line_list[i]
                    row.default_code = row.default_code.default_code
                    let calculate = this.rows.find(
                        x => x.default_code === row.default_code
                    )
                    row['calculate_code'] = calculate.calculate_code
                    if (
                        !row['date_expected'] ||
                        !row['sales_expected_give_date']
                    ) {
                        this.$message.error(
                            row.default_code + ':请将时间填写完整'
                        )
                        return false
                    }
                    if (
                        row['date_expected'] < row['sales_expected_give_date']
                    ) {
                        this.$message.error(
                            row.default_code + ':期望交期必须小于期望入库日期'
                        )
                        return false
                    }
                }
                let data = {
                    req_line_list: req_line_list,
                    ...values
                }
                this.saveCustomer(data)
            }
        })
    }

    private saveCustomer(data) {
        this.purchaseService
            .save(new RequestParams(data, { loading: this.loadingService }))
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onChangeGiveDate(date, dateString) {
        this.batch_give_date = date
    }

    private onChangeDateExpected(date, dateString) {
        this.batch_date_expected = date
    }

    private batchEditDate() {
        if (!this.batch_give_date || !this.batch_date_expected) {
            this.$message.error('请填写批量时间')
            return
        }
        let innerDataValues = Object.values(this.innerData)
        for (let sku_obj in innerDataValues) {
            let sku_obj_values: any = innerDataValues[sku_obj]
            for (let row of sku_obj_values) {
                row['date_expected'] = this.batch_date_expected
                row['sales_expected_give_date'] = this.batch_give_date
            }
        }
        let _obj = JSON.stringify(this.innerData)
        this.innerData = JSON.parse(_obj)
        this.$message.success('批量修改时间成功')
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "",
    "columns":{
       "warehouse_id": "Warehouse",
       "req_type":"Req Type",
       "sales_expected_give_date":"Sales Expected Date",
       "date_expected":"Date Expected",
       "product_qty":"Prod QTY",
       "coefficient":"Coefficient",
       "min_qty":"Min Order"
    },
    "action":{
        "ok":"Ok",
        "cancel":"Cancel",
        "commit":"Commit"
    },
    "rules":{

    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "warehouse_id": "仓库",
       "req_type":"开发类型",
       "sales_expected_give_date":"期望交期",
       "date_expected":"期望入库",
       "product_qty":"预计采购数量",
       "coefficient":"比例",
       "min_qty":"起订量"
    },
    "action":{
      "ok":"确定",
      "cancel":"取消",
      "commit":"提交"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    }

  }
}
</i18n>
