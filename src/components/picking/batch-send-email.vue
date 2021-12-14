<template>
    <section class="component edit-customer">
        <a-form
            class="data-form"
            layout="inline"
            :form="form"
            :labelCol="{ span: 3 }"
            :wrapperCol="{ span: 20, offset: 1 }"
        >
            <a-row :gutter="24">
                <a-col :span="23">
                    <a-form-item :label="$t('forms.order_memo')">
                        <a-input
                            v-decorator="[
                                `add_order_memo`,
                                { rules: rules.required }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="23">
                    <a-form-item :label="$t('forms.cancel_order')">
                        <a-checkbox
                            v-decorator="[`order_cancel`]"
                            v-model="is_cancel_order"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-if="is_cancel_order">
                    <a-form-item :label="$t('forms.cancel_memo')">
                        <a-input
                            v-decorator="[
                                `cancel_memo`,
                                { rules: rules.required }
                            ]"
                            size="small"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-show="is_cancel_order">
                    <a-form-item :label="$t('forms.customer_reason')">
                        <a-select
                            v-decorator="[`customer_reason`]"
                            size="small"
                        >
                            <a-select-option
                                v-for="item of customerReasonList"
                                :value="item.code"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-show="is_cancel_order">
                    <a-form-item :label="$t('forms.product_problem')">
                        <a-select
                            v-decorator="[`sale_tag`]"
                            size="small"
                            showSearch
                        >
                            <a-select-option
                                v-for="item of productReasonList"
                                :value="item"
                                :key="item"
                            >
                                {{ item }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-show="is_cancel_order">
                    <a-form-item :label="$t('forms.logistic_reason')">
                        <a-select
                            v-decorator="[`logistic_reason`]"
                            size="small"
                        >
                            <a-select-option
                                v-for="item of logisticReasonList"
                                :value="item.code"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-show="is_cancel_order">
                    <a-form-item :label="$t('forms.warehouse_reason')">
                        <a-select
                            v-decorator="[`warehouse_reason`]"
                            size="small"
                        >
                            <a-select-option
                                v-for="item of warehouseReasonList"
                                :value="item.code"
                                :key="item.code"
                            >
                                {{ item.name }}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :span="23">
                    <a-form-item :label="$t('forms.send_email')">
                        <a-checkbox
                            v-decorator="[`need_send_email`]"
                            size="small"
                            v-model="is_need_send_email"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="23" v-show="is_need_send_email">
                    <a-tabs default-active-key="en">
                        <a-tab-pane key="en" tab="EN Email">
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `en_title`,
                                                { initialValue: en_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`en_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="de" tab="DE Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `de_title`,
                                                { initialValue: de_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`de_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="fr" tab="FR Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `fr_title`,
                                                { initialValue: fr_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`fr_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="it" tab="IT Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `it_title`,
                                                { initialValue: it_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`it_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="es" tab="ES Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `es_title`,
                                                { initialValue: es_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`es_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="nl" tab="NL Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `nl_title`,
                                                { initialValue: nl_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`nl_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                        <a-tab-pane key="se" tab="SE Email" force-render>
                            <a-row :gutter="24">
                                <a-col :span="23">
                                    <a-form-item label="Title">
                                        <a-input
                                            v-decorator="[
                                                `se_title`,
                                                { initialValue: se_title }
                                            ]"
                                            size="small"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="23">
                                    <a-form-item label="Body">
                                        <a-textarea
                                            v-decorator="[`se_body`]"
                                            size="small"
                                            rows="6"
                                        ></a-textarea>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </a-tab-pane>
                    </a-tabs>
                </a-col>
            </a-row>
        </a-form>
        <div class="flex-row justify-content-end margin-top">
            <a-button class="margin-right" @click="cancel">{{
                $t('action.cancel')
            }}</a-button>
            <a-button type="primary" @click="onSubmit">{{
                $t('action.send')
            }}</a-button>
        </div>
    </section>
</template>
<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import { RequestParams } from '../../core/http'
import { Form } from 'ant-design-vue'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { CustomProblemService } from '~/services/custom_problem.service'
import { PickingService } from '~/services/picking.service'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import { CommonService } from '@/shared/utils/common.service'

@Component({
    components: {}
})
export default class BatchSendEmail extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    private stock

    @Prop()
    private saveFlag

    @Prop()
    private changeSpinning

    private form: any

    private loadingService = new LoadingService()

    private customProblemService = new CustomProblemService()
    private pickingService = new PickingService()

    private customerReasonList: any[] = []
    private productReasonList: any[] = []
    private logisticReasonList: any[] = []
    private warehouseReasonList: any[] = []

    private is_cancel_order: Boolean = false
    private is_need_send_email: Boolean = true

    private en_title = 'delivery delay'
    private de_title = 'Versandverspätung'
    private fr_title = "L'expédition retardée"
    private it_title = 'Ritardo nella spedizione'
    private es_title = 'retraso en la entrega'
    private nl_title = 'bezorgingsvertraging'
    private se_title = 'leverans fördröjning'

    private rules = {
        required: [{ required: true, message: 'required' }]
    }

    private defaultValue = {
        number_type: 'picking',
        add_order_memo: '',
        cancel_memo: '',
        order_cancel: false,
        need_send_email: true,
        sale_tag: '',
        logistic_reason: '',
        customer_reason: '',
        warehouse_reason: '',
        // en_title: '',
        en_body: '',
        // it_title: '',
        it_body: '',
        // de_title: '',
        de_body: '',
        // fr_title: '',
        fr_body: '',
        // es_title: '',
        es_body: '',
        // nl_title: '',
        nl_body: '',
        se_body: ''
    }

    public mounted() {
        if (this.stock) {
            this.setFormValues()
        }
    }

    public setFormValues() {
        this.form.setFieldsValue(this.defaultValue)
    }

    public created() {
        this.form = this.$form.createForm(this)
        this.getCpReason()
        this.getProductReason([''])
    }

    private getCpReason() {
        this.customProblemService
            .queryCpReasonEnum(new RequestParams())
            .subscribe(data => {
                this.warehouseReasonList = data[0]['warehouse_reason']
                this.customerReasonList = data[0]['customer_reason']
                // this.productReasonList = data[0]['product_reason']
                this.logisticReasonList = data[0]['logistic_reason']
            })
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                let data: any = {}
                data['number_list'] = this.stock
                data['cancel_info'] = {
                    number_type: 'picking',
                    add_order_memo: values['add_order_memo'],
                    cancel_memo: values['cancel_memo'],
                    order_cancel: values['order_cancel'],
                    need_send_email: values['need_send_email'],
                    sale_tag: values['sale_tag'],
                    logistic_reason: values['logistic_reason'],
                    customer_reason: values['customer_reason'],
                    warehouse_reason: values['warehouse_reason']
                }
                if (!values['order_cancel']) {
                    delete data['cancel_info'].cancel_memo
                } else {
                    if (
                        values['sale_tag'].length < 1 &&
                        values['logistic_reason'].length < 1 &&
                        values['customer_reason'].length < 1 &&
                        values['warehouse_reason'].length < 1
                    ) {
                        let cancel_order_err: any = this.$t('cancel_order_err')
                        this.$message.error(cancel_order_err)
                        return false
                    }
                }
                if (values['need_send_email']) {
                    let count = 0
                    let err_msg: any = this.$t('email_msg')
                    for (let i in values) {
                        if (i.search('_title') > 0) {
                            count += 1
                            if (
                                typeof values[i] == undefined ||
                                values[i].length < 1
                            ) {
                                this.$message.error(err_msg)
                                return false
                            }
                        }
                    }
                    if (count < 6) {
                        this.$message.error(err_msg)
                        return false
                    }
                    data['email_list'] = [
                        {
                            language: 'en',
                            body: values['en_body'],
                            title: values['en_title']
                        },
                        {
                            language: 'fr',
                            body: values['fr_body'],
                            title: values['fr_title']
                        },
                        {
                            language: 'de',
                            body: values['de_body'],
                            title: values['de_title']
                        },
                        {
                            language: 'it',
                            body: values['it_body'],
                            title: values['it_title']
                        },
                        {
                            language: 'es',
                            body: values['es_body'],
                            title: values['es_title']
                        },
                        {
                            language: 'nl',
                            body: values['nl_body'],
                            title: values['nl_title']
                        },
                        {
                            language: 'se',
                            body: values['se_body'],
                            title: values['se_title']
                        }
                    ]
                }
                this.sendEmail(data)
            }
        })
    }

    private sendEmail(data) {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        this.pickingService
            .SendEmail(new RequestParams(data, loading))
            .subscribe(
                () => {
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

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    public getProductReason(sku) {
        this.innerAction.setActionAPI(
            'product_management/query_product_reason_enum',
            CommonService.getMenuCode('common-menu')
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        sku_list: sku
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.productReasonList = data['']
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
    "forms":{
       "order_memo":"Memo",
       "cancel_order":"Cancel Order",
       "cancel_memo":"Cancel Memo",
       "customer_reason":"Customer Reason",
       "product_problem":"Product Problem",
       "logistic_reason":"Logistic Reason",
       "warehouse_reason":"Warehouse Reason",
       "send_email":"Send Email"
    },
    "action":{
      "send":"Send Email",
      "cancel":"Cancel"
    },
    "email_msg":"Please write all emails",
    "cancel_order_err":"Please Select at least one Reason"
  },
  "zh-cn": {
     "forms":{
       "order_memo":"Memo",
       "cancel_order":"取消订单",
       "cancel_memo":"取消备注",
       "customer_reason":"客户原因",
       "product_problem":"产品原因",
       "logistic_reason":"物流原因",
       "warehouse_reason":"仓库原因",
       "send_email":"发送邮件"
    },
    "action":{
      "send":"发送",
      "cancel":"取消"
    },
    "email_msg":"请将所有邮件都填写完整",
    "cancel_order_err":"请至少选择一条原因"
  }
}
</i18n>
