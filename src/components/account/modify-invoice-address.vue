<template>
    <section class="component customer-detail">
        <a-form
            :form="form"
            :labelCol="{ span: 4 }"
            :wrapperCol="{ span: 20, offset: 0 }"
        >
            <a-row :gutter="24">
                <a-col :span="22">
                    <a-form-item :label="$t('columns.customer')" required>
                        <a-input
                            v-decorator="[
                                `name`,
                                {
                                    rules: rules.required
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.street')" required>
                        <a-input
                            v-decorator="[
                                `street`,
                                {
                                    rules: rules.required
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.street2')">
                        <a-input v-decorator="[`street2`]" />
                    </a-form-item>
                </a-col>

                <a-col :span="22">
                    <a-row>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.city')"
                                :labelCol="{ span: 8 }"
                                :wrapperCol="{ span: 16, offset: 0 }"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `city`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.zip')"
                                :labelCol="{ span: 6 }"
                                :wrapperCol="{ span: 18, offset: 0 }"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `zip`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                />
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-col>
                <a-col :span="22">
                    <a-form-item :label="$t('columns.country')" required>
                        <a-select
                            showSearch
                            v-decorator="[
                                'country_id',
                                {
                                    rules: rules.required
                                }
                            ]"
                            :filterOption="filterSelectOption"
                            placeholder="Select Country"
                        >
                            <a-select-option
                                :value="item.code"
                                v-for="item of countryList"
                                :key="item.code"
                            >
                                [{{ item.code }}]{{ item.name }}
                            </a-select-option>
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
import { Form } from 'ant-design-vue'
import OrderBaseDetail from './order-base-detail.vue'
import OrderCustomerDetail from './order-customer-detail.vue'
import OrderProductDetail from './order-product-detail.vue'
import { PartnerService } from '../../services/partner.service'
import { RequestParams } from '@/core/http'
import { PageService } from '../../bootstrap/services/page.service'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { AccountService } from '../../services/account.service'
@Component({
    components: {}
})
export default class ModifyInvoiceAddress extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    invoice: any

    @Prop()
    countryList: any

    @Prop()
    changeSpinning

    private form: any

    private customerList: any[] = []

    private partnerService = new PartnerService()

    private pageService = new PageService()

    private loadingService = new LoadingService()

    private accountService = new AccountService()

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.invoice) {
            this.form.setFieldsValue(this.invoice)
        }
    }

    private getCustomerList() {
        this.partnerService
            .queryCustomerContact(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.customerList = data
                },
                err => {
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

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['invoice_id'] = this.invoice.id
                values['partner_id'] = this.invoice.partner_id
                this.seveInvoice(values)
            }
        })
    }

    private seveInvoice(params) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.accountService
            .modifyInvoiceAddress(new RequestParams(params, loading))
            .subscribe(
                data => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.submit()
                },
                err => {
                    if (this.changeSpinning) {
                        this.changeSpinning(false)
                    }
                    this.$message.error(err.message)
                }
            )
    }
}
</script>

<i18n>
{
  "en-us":{
    "base":"Order Info",
    "customer":"Customer Info",
    "product":"Product Info",
    "columns": {
        "customer":"Customer",
        "country":"Country",
        "city":"City",
        "zip":"Zip",
        "state":"State",
        "street":"Street",
        "street2":"Street2"
    },
    "action":{
        "submit":"Submit",
        "add":"Add",
        "del":"Delete",
        "cancel":"Cancel"
    }
  },
  "zh-cn":{
    "base":"基本信息",
    "customer":"客户信息",
    "product":"产品信息",
    "columns": {
        "customer":"客户",
        "country":"国家",
        "city":"城市",
        "zip":"邮编",
        "state":"州",
        "street":"街道",
        "street2":"街道2"
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
