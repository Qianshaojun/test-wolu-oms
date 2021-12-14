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
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.year')"
                        style="height:35px;margin:0;"
                        required
                    >
                        <a-date-picker
                            mode="year"
                            format="YYYY"
                            :value="yearPick"
                            :open="yearPickShow"
                            :disabled="saveFlag != 0"
                            valueFormat="YYYY"
                            @panelChange="handlePanelChange"
                            @openChange="handleOpenChange"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item
                        :label="$t('columns.cn_sub_category')"
                        required
                    >
                        <a-input
                            showSearch
                            v-decorator="[
                                'cn_sub_category',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('columns.cn_sub_category')"
                            :disabled="saveFlag != 0"
                            size="small"
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.warehouse_id')" required>
                        <a-select
                            showSearch
                            v-decorator="[
                                'warehouse_id',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('please_choose')"
                            :disabled="saveFlag != 0"
                            size="small"
                        >
                            <a-select-option
                                :value="item.value"
                                v-for="item of $dict.WarehouseId"
                                :key="item.value"
                                >{{ $t(item.label) }}</a-select-option
                            >
                        </a-select>
                    </a-form-item>
                </a-col>

                <a-col :span="12">
                    <a-form-item :label="$t('columns.jan_value')">
                        <a-input-number
                            v-decorator="[
                                `jan_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.feb_value')">
                        <a-input-number
                            v-decorator="[
                                `feb_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.mar_value')">
                        <a-input-number
                            v-decorator="[
                                `mar_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.apr_value')">
                        <a-input-number
                            v-decorator="[
                                `apr_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.may_value')">
                        <a-input-number
                            v-decorator="[
                                `may_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.jun_value')">
                        <a-input-number
                            v-decorator="[
                                `jun_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.jul_value')">
                        <a-input-number
                            v-decorator="[
                                `jul_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.aug_value')">
                        <a-input-number
                            v-decorator="[
                                `aug_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.sep_value')">
                        <a-input-number
                            v-decorator="[
                                `sep_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.oct_value')">
                        <a-input-number
                            v-decorator="[
                                `oct_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.nov_value')">
                        <a-input-number
                            v-decorator="[
                                `nov_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.dec_value')">
                        <a-input-number
                            v-decorator="[
                                `dec_value`,
                                {
                                    initialValue: 0
                                }
                            ]"
                            size="small"
                            min="0"
                            decimalSeparator=","
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
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
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { SaleTrendService } from '../../services/saletrend.service'

@Component({
    components: {}
})
export default class SaleTrendEdit extends Vue {
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

    private form: any

    private loadingService = new LoadingService()

    private saletrendService = new SaleTrendService()

    private yearPick = null

    private yearPickShow = false

    private handleOpenChange(status) {
        this.yearPickShow = status
    }
    // 得到年份选择器的值
    private handlePanelChange(value) {
        this.yearPick = value.format('YYYY')
        this.yearPickShow = false
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public mounted() {
        if (this.row) {
            this.yearPick = this.row.year
            this.setFormValues()
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
                values['save_flag'] = this.saveFlag
                values['year'] = this.yearPick
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.saletrendService
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
}
</script>
<i18n>
{
  "en-us": {
    "desc": "Sale Trend",
    "columns":{
       "warehouse_id": "warehouse_id",
       "year": "Year",
       "jan_value":"January",
       "feb_value":"February",
       "mar_value":"March",
       "apr_value":"April",
       "may_value":"May",
       "jun_value":"June",
       "jul_value":"July",
       "aug_value":"August",
       "sep_value":"September",
       "oct_value":"October",
       "nov_value":"November",
       "dec_value":"December",
       "cn_sub_category":"cn_sub_category"
       
    },
    "action":{
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose"
  },
  "zh-cn": {
    "desc": "销售趋势",
    "columns":{
       "warehouse_id": "仓库",
       "year": "年份",
       "jan_value":"一月",
       "feb_value":"二月",
       "mar_value":"三月",
       "apr_value":"四月",
       "may_value":"五月",
       "jun_value":"六月",
       "jul_value":"七月",
       "aug_value":"八月",
       "sep_value":"九月",
       "oct_value":"十月",
       "nov_value":"十一月",
       "dec_value":"十二月",
       "cn_sub_category":"中文子类"

    },
    "action":{
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择"
  }
}
</i18n>
