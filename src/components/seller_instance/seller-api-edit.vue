<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 2 }"
        >
            <a-form-item :label="$t('columns.merchant_id')" required>
                <a-input
                    v-decorator="[
                        `merchant_id`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                    placeholder="dev_id or merchant_id"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.access_key')" required>
                <a-input
                    v-decorator="[
                        `access_key`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.secret_key')" required>
                <a-input
                    v-decorator="[
                        `secret_key`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.auth_token')" required>
                <a-input
                    v-decorator="[
                        `auth_token`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.api_url')" required>
                <a-input
                    v-decorator="[
                        `api_url`,
                        {
                            rules: rules.required
                        }
                    ]"
                    size="small"
                />
            </a-form-item>
            <a-form-item :label="$t('columns.refresh_token_time')">
                <a-input
                    :disabled="true"
                    v-decorator="[`refresh_token_time`]"
                    size="small"
                />
            </a-form-item>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">取消</a-button>
            <a-button type="primary" @click="onSubmit">提交</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { SellerInstanceService } from '../../services/seller-instance.service'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {}
})
export default class SellerApiEdit extends Vue {
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

    private form: any

    private default_lang_id: any = 1
    private default_status: any = false

    private sellerInstanceService = new SellerInstanceService()

    private loadingService = new LoadingService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public mounted() {
        if (this.row) {
            this.default_status = this.row.status
            this.default_lang_id = this.row.lang_id

            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.row)
    }

    private saveIllegalWords(data) {
        this.sellerInstanceService
            .saveSellerApi(
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

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                if (this.row) {
                    values['seller_code'] = this.row['seller_code']
                }
                this.saveIllegalWords(values)
            }
        })
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }
}
</script>

<i18n>
{
  "en-us": {
    "desc": "this is a Order Page1",
    "columns":{
       "merchant_id":"Merchant",
       "access_key":"Access key",
       "secret_key":"Secret key",
       "auth_token":"Token",
       "refresh_token_time":"Refresh Token Time",
       "api_url":"Api Url"
    },
    "action":{
      "cancel":"Cancel",
      "save":"Save"
    },
    "cancel":"Are you sure Cancel?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "cancel_success":"Cancel Success",
    "yes":"Yes",
    "no":"No"
  },
  "zh-cn": {
    "desc": "",
    "columns":{
       "merchant_id":"Merchant",
       "access_key":"Access key",
       "secret_key":"Secret key",
       "auth_token":"Token",
       "refresh_token_time":"刷新时间",
       "api_url":"url地址"
    },
    "action":{
      "cancel":"取消",
      "save":"保存"
    },
    "cancel":"是否确认取消?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "cancel_success":"取消成功",
    "yes":"是",
    "no":"否"
  }
}
</i18n>
