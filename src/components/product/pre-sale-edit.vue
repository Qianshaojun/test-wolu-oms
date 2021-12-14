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
                    <a-form-item :label="$t('columns.presale_object')" required>
                        <a-input
                            showSearch
                            v-decorator="[
                                'presale_object',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('columns.presale_object')"
                            size="small"
                        ></a-input>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.presale_type')" required>
                        <a-select
                            showSearch
                            v-decorator="[
                                'presale_type',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :placeholder="$t('please_choose')"
                            size="small"
                        >
                            <a-select-option
                                :value="item.value"
                                v-for="item of $dict.PresaleType"
                                :key="item.value"
                                >{{ $t(item.label) }}</a-select-option
                            >
                        </a-select>
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

                <a-col :span="20">
                    <a-form-item :label="$t('columns.is_presale')" required>
                        <a-checkbox
                            :defaultChecked="is_presale"
                            v-model="is_presale"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
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
                <a-col :span="20">
                    <a-form-item :label="$t('columns.presale_ratio')" required>
                        <a-input-number
                            v-decorator="[
                                `presale_ratio`,
                                {
                                    rules: rules.required
                                }
                            ]"
                            decimalSeparator=","
                            size="small"
                            min="0"
                            max="1"
                            placeholder="需大于0"
                        />
                        <span style="color:red;margin-left:50px">{{
                            $t('message_presale_ratio')
                        }}</span>
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.presale_days')" required>
                        <a-input-number
                            v-decorator="[
                                `presale_days`,
                                {
                                    initialValue: 14
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            decimalSeparator=","
                            size="small"
                            min="0"
                            placeholder="需大于0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.purchase_cycle')" required>
                        <a-input-number
                            v-decorator="[
                                `purchase_cycle`,
                                {
                                    initialValue: 90
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            decimalSeparator=","
                            size="small"
                            min="0"
                            placeholder="需大于0"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="20">
                    <a-form-item :label="$t('columns.sale_cycle')" required>
                        <a-input-number
                            v-decorator="[
                                `sale_cycle`,
                                {
                                    initialValue: 60
                                },
                                {
                                    rules: rules.required
                                }
                            ]"
                            decimalSeparator=","
                            size="small"
                            min="0"
                            placeholder="需大于0"
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
import { PreSaleService } from '../../services/presale.service'

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

    private is_presale: Boolean = false

    private is_second_presale: Boolean = false

    private form: any

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
                values['save_flag'] = this.saveFlag
                values['is_presale'] = this.is_presale
                values['is_second_presale'] = this.is_second_presale
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.preSaleService
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
    "desc": "",
    "columns":{
       "presale_type": "presale_type",
       "warehouse_id": "warehouse_id",
       "presale_object":"presale_object",
       "is_presale":"Is Presale",
       "is_second_presale":"Is Second Presale",
       "presale_ratio":"Presale_ratio",
       "presale_days":"Presale_days",
       "purchase_cycle":"Purchase Cycle"
       
    },
    "action":{
        "create":"Create",
        "copy":"Copy",
        "edit":"Edit",
        "delete":"Delete",
        "ok":"Ok",
        "cancel":"Cancel",
        "more":"More"
    },
    "rules":{

    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success",
    "please_choose":"Please Choose",
    "message_presale_ratio":"Presale Ratio must smaller than 1"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "presale_type": "预售类型",
       "warehouse_id": "仓库",
       "presale_object":"预售设置对象",
       "is_presale":"第一期预售",
       "is_second_presale":"第二期预售",
       "presale_ratio":"预售系数",
       "presale_days":"预售天数",
       "purchase_cycle":"采购周期/天",
       "sale_cycle":"销售周期/天"

    },
    "action":{
      "create":"新建",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功",
    "please_choose":"请选择",
    "message_presale_ratio":"预售系数不能超过1"

  }
}
</i18n>
