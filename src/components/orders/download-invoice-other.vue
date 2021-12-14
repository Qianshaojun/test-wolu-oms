<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="12">
                    <a-form-item :label="$t('columns.company_name')">
                        <a-input
                            v-decorator="[`company_name`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.vat')">
                        <a-input
                            v-decorator="[`vat`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>       
                <a-col :span="12">
                    <a-form-item :label="$t('columns.street1')">
                        <a-input
                            v-decorator="[`street1`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>      
                <a-col :span="12">
                    <a-form-item :label="$t('columns.street2')">
                        <a-input
                            v-decorator="[`street2`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>                                                                                 
                <a-col :span="12">
                    <a-form-item :label="$t('columns.country')">
                        <a-input
                            v-decorator="[`country`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.state')">
                        <a-input
                            v-decorator="[`state`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.city')">
                        <a-input
                            v-decorator="[`city`]"
                            size="small"
                            style="width: 200px;"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item :label="$t('columns.postcode')">
                        <a-input
                            v-decorator="[`postcode`]"
                            size="small"
                            style="width: 200px;"
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
import moment from 'moment'
import { PublicService } from '~/services/public.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { InnerActionService } from '~/bootstrap/services/inner.action.service'
import { CommonService } from '../../shared/utils/common.service'

@Component({
    components: {}
})
export default class DownloadInvoiceOther extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private order_name

    private data: any = {
        country: 'CN',
        state: 'Guangdong',
        city: 'Shenzhen',
        postcode: '518000'
    }

    // 分页服务

    private loadingService = new LoadingService()
    private innerActionService = new InnerActionService()
    private publicService = new PublicService()

    private form: any

    private defaultWarehouse: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private instanceRequired = false

    public mounted() {
        this.setFormValues()
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data)
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['order_name'] = this.order_name
                this.saveCustomer(values)
            }
        })
    }

    private saveCustomer(data) {
        this.innerActionService.setActionAPI(
            'order_management/create_invoice_pdf_for_other_instance',
            CommonService.getMenuCode('order-manage')
        )
        this.publicService
            .modify(
                new RequestParams(data, {
                    loading: this.loadingService,
                    innerAction: this.innerActionService
                })
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
}
</script>

<i18n>
{
  "en-us":{
      "columns":{
        "company_name":"Company Name", 
        "vat":"Vat",
        "street1":"street1",
        "street2":"street2",                                 
        "country":"Country",
        "state":"State",
        "city":"City",
        "postcode":"postcode"

             },
    "action":{
      "submit":"Create",
      "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "columns":{
        "company_name":"公司名称", 
        "vat":"Vat",
        "street1":"街道1",
        "street2":"街道2",            
        "country":"国家",
        "state":"省",
        "city":"城市",
        "postcode":"邮编"

       },
    "action":{
        "submit":"提交",
        "cancel":"取消"
    }
  }
}
</i18n>
