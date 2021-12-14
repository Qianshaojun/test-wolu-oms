<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-row :gutter="24">
                <a-col :span="10">
                    <a-form-item label="sku" required>
                        <a-input
                            showSearch
                            v-decorator="[
                                'default_code',
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="sku"
                            size="small"
                            disabled
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.calculate_date')" required>
                        <a-input
                            showSearch
                            v-decorator="[
                                'calculate_date',
                                {
                                    rules: rules.required
                                }
                            ]"
                            placeholder="统计日期"
                            size="small"
                            disabled
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.calculate_code')"
                        v-show="false"
                        required
                    >
                        <a-input
                            showSearch
                            v-decorator="[
                                'calculate_code',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('columns.calculate_code')"
                            size="small"
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.is_presale')" required>
                        <a-checkbox
                            :defaultChecked="is_presale"
                            v-model="is_presale"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.is_second_presale')"
                        required
                    >
                        <a-checkbox
                            :defaultChecked="is_second_presale"
                            v-model="is_second_presale"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.presale_ratio')" required>
                        <a-input-number
                            v-decorator="[
                                `presale_ratio`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.week_avg_sales')" required>
                        <a-input-number
                            v-decorator="[
                                `week_avg_sales`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.use_history_week_sale')"
                        required
                    >
                        <a-checkbox
                            :defaultChecked="use_history_week_sale"
                            v-model="use_history_week_sale"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.use_history_ratio')"
                        required
                    >
                        <a-checkbox
                            :defaultChecked="use_history_ratio"
                            v-model="use_history_ratio"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.purchase_cycle')" required>
                        <a-input-number
                            v-decorator="[
                                `purchase_cycle`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.memo')">
                        <a-input v-decorator="[`memo`]" size="small" />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.sale_cycle')" required>
                        <a-input-number
                            v-decorator="[
                                `sale_cycle`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item :label="$t('columns.presale_days')" required>
                        <a-input-number
                            v-decorator="[
                                `presale_days`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>

                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.increase_ratio_1')"
                        v-show="use_history_ratio"
                    >
                        <a-input-number
                            v-decorator="[`increase_ratio_1`]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.increase_ratio_2')"
                        v-show="use_history_ratio"
                    >
                        <a-input-number
                            v-decorator="[`increase_ratio_2`]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.increase_ratio_3')"
                        v-show="use_history_ratio"
                    >
                        <a-input-number
                            v-decorator="[`increase_ratio_3`]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="10">
                    <a-form-item
                        :label="$t('columns.increase_ratio_4')"
                        v-show="use_history_ratio"
                    >
                        <a-input-number
                            v-decorator="[`increase_ratio_4`]"
                            size="small"
                            min="0"
                            placeholder="需大于0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
        <a-card class="margin-y" v-if="use_history_week_sale">
            <template>
                <a-input-number
                    placeholder="填写以往周数来查看销量"
                    style="width:50%"
                    min="1"
                    max="100"
                    decimalSeparator=","
                    @change="value => (week_number = value)"
                ></a-input-number>
                <a-button @click="get_week_sales">查询</a-button>
            </template>
            <data-table
                :stripe="true"
                :data="history_week_sale"
                :page="pageService"
                rowKey="week"
                :scroll="{ y: 300 }"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: (keys, select_rows) => {
                        selectedRows = select_rows
                        selectedRowKeys = keys
                    }
                }"
            >
                <a-table-column
                    :title="$t('columns.week')"
                    data-index="week"
                    key="week"
                    width="25%"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.sales')"
                    data-index="sales"
                    key="sales"
                    width="25%"
                ></a-table-column>
            </data-table>
        </a-card>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.ok')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { PreSaleService } from '../../services/presale.service'

@Component({
    components: {}
})
export default class PurchasePredictEdit extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private row

    @Prop()
    private saveFlag

    private history_week_sale: any[] = []

    private is_presale: Boolean = false

    private is_second_presale: Boolean = false

    private use_history_week_sale: Boolean = false

    private use_history_ratio: Boolean = false

    private form: any

    private week_number: any

    // 表格选择项
    private selectedRowKeys: any[] = []

    private selectedRows: any[] = []

    private loadingService = new LoadingService()

    private preSaleService = new PreSaleService()

    private checkValue(rule, value, callback) {
        if (value < 0) {
            callback('必须大于0')
        }
    }

    private rules = {
        required: [{ required: true, message: '必填项' }],
        requiredvalue: [
            { message: '请输入大于0的数', validator: this.checkValue }
        ]
    }

    public mounted() {
        if (this.row) {
            // console.log(this.row)
            this.setFormValues()
            this.is_presale = this.row.is_presale
            this.is_second_presale = this.row.is_second_presale
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['is_presale'] = this.is_presale
                values['is_second_presale'] = this.is_second_presale
                values['use_history_week_sale'] = this.use_history_week_sale
                values['use_history_ratio'] = this.use_history_ratio
                values['week_sales_list'] = this.selectedRows
                if (!this.use_history_ratio) {
                    values['increase_ratio_1'] = 0
                    values['increase_ratio_2'] = 0
                    values['increase_ratio_3'] = 0
                    values['increase_ratio_4'] = 0
                }
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.preSaleService
            .re_calculate_purchase_predict(
                new RequestParams(data, { loading: this.loadingService })
            )
            .subscribe(
                () => {
                    this.submit()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private get_week_sales() {
        this.preSaleService
            .query_sku_week_sales(
                new RequestParams(
                    {
                        calculate_code: this.row.calculate_code,
                        week_number: this.week_number
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.history_week_sale = data
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
  "en-us": {
    "desc": "",
    "columns":{
        "warehouse_id":"warehouse_id",
        "calculate_date":"calculate_date",
        "week_avg_sales":"week_avg_sales",
        "is_presale":"is_presale",
        "is_second_presale":"is_second_presale",
        "presale_ratio":"presale_ratio",
        "use_history_week_sale":"use_history_week_sale",
        "purchase_cycle":"purchase_cycle",
        "sale_cycle":"sale_cycle",
        "presale_days":"presale_days",
        "week":"week",
        "sales":"sales",
        "increase_ratio_1":"increase_ratio_1",
        "increase_ratio_2":"increase_ratio_2",
        "increase_ratio_3":"increase_ratio_3",
        "increase_ratio_4":"increase_ratio_4",
        "memo":"memo",  
        "use_history_ratio":"use_history_ratio"
    },
    "action":{
        "ok":"Ok",
        "cancel":"Cancel"
    },
    "rules":{

    }
  },
  "zh-cn": {
    "desc": "",
    "columns":{
        "warehouse_id":"仓库",
        "calculate_date":"统计日期",
        "week_avg_sales":"周均销量",
        "is_presale":"第一期预售",
        "is_second_presale":"第二期预售",
        "presale_ratio":"预售系数",
        "use_history_week_sale":"以往周销量",
        "purchase_cycle":"采购周期",
        "sale_cycle":"销售周期",
        "presale_days":"预售天数",
        "week":"前几周",
        "sales":"销量",
        "increase_ratio_1":"增长比率1",
        "increase_ratio_2":"增长比率2",
        "increase_ratio_3":"增长比率3",
        "increase_ratio_4":"增长比率4",
        "memo":"备注",  
        "use_history_ratio":"修改环比"
    },
    "action":{
        "ok":"重算",
        "cancel":"取消"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    }
  }
}
</i18n>
