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
                <a-col :span="30">
                    <a-form-item :label="$t('columns.amazon_sku')">
                        {{ row.amazon_sku }}
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.amazon_asin')">
                        {{ row.amazon_asin }}
                    </a-form-item>
                </a-col>
                <a-col :span="30">
                    <a-form-item :label="$t('columns.critical_value')" required>
                        <a-input-number
                            v-decorator="[
                                'critical_value',
                                {
                                    initialValue: row.critical_value
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
                <a-col :span="30">
                    <a-form-item :label="$t('columns.from_value')" required>
                        <a-input-number
                            v-decorator="[
                                'from_value',
                                {
                                    initialValue: row.from_value
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
                <a-col :span="30">
                    <a-form-item :label="$t('columns.to_value')" required>
                        <a-input-number
                            v-decorator="[
                                'to_value',
                                {
                                    initialValue: row.to_value
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

                <a-col :span="30">
                    <a-form-item :label="$t('columns.pull_off_value')" required>
                        <a-input-number
                            v-decorator="[
                                'pull_off_value',
                                {
                                    initialValue: row.pull_off_value
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
import { AmazonListingStockService } from '../../services/amazon_listing_stock.service'

@Component({
    components: {}
})
export default class AmazonListingEdit extends Vue {
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

    private amazonListingStockService = new AmazonListingStockService()

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
                values['id'] = this.row.id
                values['amazon_sku'] = this.row.amazon_sku
                values['amazon_asin'] = this.row.amazon_asin
                this.saveAmazonListing(values)
            }
        })
    }

    private saveAmazonListing(data) {
        this.amazonListingStockService
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
       "amazon_sku": "Amazon SKU",
       "amazon_asin": "Amazon ASIN",
       "critical_value": "Critical Value",
       "from_value": "From Value",
       "to_value":"To Value",
       "pull_off_value":"Pull Off Value"
    },
    "action":{
        "edit":"Edit",
        "cancel":"Cancel",
        "more":"More"
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
    "desc": "",
    "columns":{
       "amazon_sku": "Amazon SKU",
       "amazon_asin": "Amazon ASIN",
       "critical_value": "临界值",
       "from_value": "From值",
       "to_value":"To值",
       "pull_off_value":"下架值"
    },
    "action":{
      "edit":"编辑",
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
    "please_choose":"请选择"

  }
}
</i18n>
