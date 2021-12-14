<template>
    <section class="component customer-detail">
        <div>
            <a-button type="primary" @click="modifyInvoiceAddress"
                >{{ $t('action.modify_address') }}
            </a-button>
        </div>
        <section class="component edit-customer">
            <a-form
                :form="form"
                :labelCol="{ span: 6 }"
                :wrapperCol="{ span: 16, offset: 2 }"
            >
                <a-card class="margin-top order-edit-page">
                    <a-row :gutter="24">
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.customer')">
                                <span
                                    >{{ order.partner_name | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.invoice_date')"
                                required
                            >
                                <a-date-picker
                                    v-decorator="[
                                        `date_invoice`,
                                        {
                                            initialValue: moment(Date.now())
                                        },
                                        {
                                            rule: rules.required
                                        }
                                    ]"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.nr')">
                                <span>
                                    {{ order.nr | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.need_refund')">
                                <a-date-picker
                                    v-decorator="[
                                        `need_refund`,
                                        {
                                            initialValue: moment(Date.now())
                                        }
                                    ]"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.street')">
                                <span>
                                    {{ order.street | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.refund_time')">
                                <a-date-picker
                                    v-decorator="[
                                        `refund_time`,
                                        {
                                            initialValue: moment(Date.now())
                                        }
                                    ]"
                                    format="YYYY-MM-DD HH:mm:ss"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.city')">
                                <span>
                                    {{ order.city | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.order_refund_status')"
                            >
                                <span>
                                    {{
                                        order.orderRefundStatus | occupiedFiled
                                    }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.country')">
                                <span>
                                    {{
                                        order.country_id
                                            | dict2(countryList)
                                            | occupiedFiled
                                    }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.operate_message')">
                                <span>
                                    {{ order.operateMessage | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.zip')">
                                <span>
                                    {{ order.zip | occupiedFiled }}
                                </span>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.uploaded_in_taxdoo')"
                            >
                                <a-checkbox
                                    v-decorator="['upload_tax_doo']"
                                    v-model="defaultTaxdoo"
                                    size="small"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.source_document')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `origin`,
                                        {
                                            rule: rules.required
                                        }
                                    ]"
                                    style="width:70%"
                                    size="small"
                                    :placeholder="$t('plzInput')"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.vat_number')">
                                <a-input
                                    v-decorator="[`vat_number`]"
                                    size="small"
                                    style="width:70%"
                                    :placeholder="$t('plzInput')"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.description')">
                                <a-input
                                    v-decorator="[`description`]"
                                    style="width:70%"
                                    size="small"
                                    :placeholder="$t('plzInput')"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.seller_code')">
                                <a-select
                                    showSearch
                                    v-decorator="['seller_code']"
                                    :style="{
                                        width: '100%',
                                        'max-width': '300px'
                                    }"
                                    size="small"
                                    :placeholder="$t('plzSelect')"
                                    @change="e => onCompanyChange(e)"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of sellerCodeList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12" required>
                            <a-form-item :label="$t('columns.currency')">
                                <a-select
                                    size="small"
                                    v-decorator="[
                                        `currency_id`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    style="width: 300px"
                                    :placeholder="$t('plzSelect')"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of currencyList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.instance_code')">
                                <a-select
                                    showSearch
                                    v-decorator="['instance_code']"
                                    :style="{
                                        width: '100%',
                                        'max-width': '300px'
                                    }"
                                    size="small"
                                    :placeholder="$t('plzSelect')"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of instanceCodeList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.company')">
                                <span>
                                    {{
                                        order.company_id
                                            | dict2(companyList)
                                            | occupiedFiled
                                    }}
                                </span>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
                <a-card class="margin-top">
                    <a-tabs defaultActiveKey="base">
                        <a-tab-pane tab="Lines" key="base">
                            <InvoiceDetail
                                :info="orderDetail"
                                :taxesList="this.taxesList"
                                :amount_tax="order.amount_tax"
                                :amount_total="order.amount_total"
                                :amount_untaxed="order.amount_untaxed"
                                @change="onDetailListChange($event)"
                            ></InvoiceDetail>
                        </a-tab-pane>
                    </a-tabs>
                </a-card>
            </a-form>
            <div class="flex-row justify-content-end margin-top">
                <a-button type="primary" @click="onSubmit()"
                    >{{ $t('action.save') }}
                </a-button>
            </div>
        </section>
    </section>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import InvoiceDetail from '~/components/account/invoice-detail.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { OrderService } from '../../services/order.service'
import SendEmail from '~/components/common/send-email.vue'
import RefundForm from '~/components/common/refund-form.vue'
import { PartnerService } from '../../services/partner.service'
import { CrmteamService } from '../../services/crmteam.service'
import { FiscalPositionService } from '../../services/fiscal_position.service'
import { DeliveryMethodService } from '../../services/delivery_method.service'
import { TaxesService } from '../../services/taxes.service'
import { UserController } from '../../config/services/user.controller'
import { UserService } from '../../services/user.service'
import { CompanyService } from '../../services/company.service'
import { SellerInstanceService } from '../../services/seller-instance.service'
import ModifyInvoiceAddress from '../../components/account/modify-invoice-address.vue'
import { AccountService } from '../../services/account.service'
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')
const chatModule = namespace('chatModule')

@Page({
    layout: 'workspace',
    name: 'invoice-edit'
})
@Component({
    components: {
        OrderDetail,
        InvoiceDetail
    }
})
export default class InvoiceEdit extends Vue {
    @Ref()
    readonly pageContainer!: PageContainer

    private form: any

    private moment = moment

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private orderService = new OrderService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private partnerService = new PartnerService()

    private crmteamService = new CrmteamService()

    private fiscalPositionService = new FiscalPositionService()

    private deliveryMethodService = new DeliveryMethodService()

    private taxesService = new TaxesService()

    private userService = new UserService()

    private companyService = new CompanyService()

    private sellerInstanceService = new SellerInstanceService()

    private accountService = new AccountService()
    // 表格数据源
    private order: any = []

    private customerList: any[] = []

    private salesTeamList: any[] = []

    private fiscalPositionList: any[] = []

    private deliveryMethodList: any[] = []

    private taxesList: any[] = []

    private salesPersonList: any[] = []

    private orderDetail: any[] = []

    private sellerCodeList: any[] = []

    private instanceCodeList: any[] = []

    private partnerName: any = ''

    private save_flag: any = 0

    private defaultOrderType: any = ''

    private originData: any = []

    private defaultPickPolicy: any = ''

    private defaultUserId: any = 0

    private defaultTaxdoo: any = false

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    invoiceEditParams

    @userModule.State
    private id

    @chatModule.Mutation('changeInvoiceId')
    private changeInvoiceId

    @Watch('invoiceEditParams')
    onOrderEditPatamsChange() {
        if (this.invoiceEditParams) {
            this.updateOrder(this.invoiceEditParams)
        }
    }

    @Prop()
    invoiceData: any

    @Prop()
    changeSpinning

    @Watch('invoiceData')
    OnInvoiceDataChange() {
        if (this.invoiceData) {
            this.updateOrder(this.invoiceData)
        }
    }

    private updateOrder(order) {
        this.originData = order
        this.getInstanceCodeList(order[0].seller_code)
        this.$nextTick(() => {
            this.order = order[0]
            this.save_flag = 1
            this.order.date_order = moment(
                this.order.date_order,
                'YYYY-MM-DD HH:ii:ss'
            )
            this.defaultUserId = this.order.user_id
            this.defaultTaxdoo = this.order.upload_tax_doo
            this.orderDetail = this.order.lines.map((x, i) => {
                x['price_tax'] = x.account_tax_id
                x['index'] = UUID.generate()
                if (x.product_uom_qty > 0 && x.price_unit > 0) {
                    let total: any = (x.price_unit * x.product_uom_qty).toFixed(
                        2
                    )
                    x.subtotal = total
                }

                return x
            })

            if (this.order.seller_code) {
                this.getTaxesList(this.order.seller_code)
            }

            if (this.order.need_refund) {
                this.order.need_refund = CommonService.dateToLocal(
                    this.order.need_refund
                )
            }

            if (this.order.refund_time) {
                this.order.refund_time = CommonService.dateToLocal(
                    this.order.refund_time
                )
            }

            if (this.order.date_invoice) {
                this.order.date_invoice = CommonService.dateToLocal(
                    this.order.date_invoice
                )
            }

            this.form.setFieldsValue(this.order)
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcountry()
        this.getcurrency()
        // this.getTaxesList()
        this.getcompany()
        this.getSellerCodeList()
        // this.getInstanceCodeList()
        this.getCustomerList()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.$dict.ShippingPolicy && this.$dict.ShippingPolicy.length > 0) {
            this.defaultPickPolicy = this.$dict.ShippingPolicy[0].value
        }
        this.defaultUserId = this.id
        if (this.$route.params.invoice) {
            this.updateOrder(this.$route.params.invoice)
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

    private getTaxesList(key) {
        this.taxesService
            .queryAll(
                new RequestParams(
                    {
                        seller_code: key
                    },
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.taxesList = data
                },
                err => {
                    this.taxesList = []
                    this.$message.error(err.message)
                }
            )
    }

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                    if (data.length) {
                        this.getInstanceCodeList(data[0].code)
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getInstanceCodeList(key) {
        this.sellerInstanceService
            .queryInstanceBySellerCode(
                new RequestParams({
                    seller_code: key
                })
            )
            .subscribe(
                data => {
                    this.instanceCodeList = data
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

    private onDetailListChange(data) {
        this.orderDetail = data
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['save_flag'] = this.save_flag
            values['id'] = this.order ? this.order.id : ''
            values['origin'] = this.order ? this.order.origin : ''
            values['type'] = this.order ? this.order.type : ''
            values['company_id'] = this.order ? this.order.company_id : ''
            values['amount_tax'] = 0
            values['amount_untaxed'] = 0
            values['amount_total'] = 0

            if (values['need_refund']) {
                let type: any = typeof values['need_refund']
                if (type != 'moment') {
                    values['need_refund'] = new Date(values['need_refund'])
                }
            }

            if (values['refund_time']) {
                let type: any = typeof values['refund_time']
                if (type != 'moment') {
                    values['refund_time'] = new Date(values['refund_time'])
                }
            }

            if (values['date_invoice']) {
                let type: any = typeof values['date_invoice']
                if (type != 'moment') {
                    values['date_invoice'] = new Date(values['date_invoice'])
                }
            }

            if (this.orderDetail.length) {
                for (var i of this.orderDetail) {
                    if (i.price_unit && i.quantity) {
                        i.price_subtotal = parseFloat(
                            (i.price_unit * i.quantity).toFixed(2)
                        )
                    }
                    let price_subtotal = i.price_subtotal ? i.price_subtotal : 0
                    values['amount_total'] += parseFloat(price_subtotal)
                    if (i.tax_id > 0) {
                        let amount = 0
                        let tax = this.taxesList.find(x => x.id === i.tax_id)
                        if (tax && tax.amount > 0) {
                            amount = tax.amount
                        }
                        values['amount_tax'] +=
                            (price_subtotal * amount) / (100 + amount)
                    } else {
                        i.tax_id = 0
                    }
                }
                values['amount_untaxed'] =
                    values['amount_total'] - values['amount_tax']
            }
            values['lines'] = this.orderDetail.map(x => {
                return x
            })
            let loading: any = {}
            if (this.changeSpinning) {
                this.changeSpinning(true)
            } else {
                loading = { loading: this.loadingService }
            }
            this.accountService
                .saveAccountInvoice(new RequestParams(values, loading))
                .subscribe(
                    data => {
                        let msg: any = this.$t('tips.save_success')
                        this.$message.success(msg)
                        if (this.changeSpinning) {
                            this.changeSpinning(false)
                        }
                        // this.form.resetFields()
                    },
                    err => {
                        if (this.changeSpinning) {
                            this.changeSpinning(false)
                        }
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private createUser(name) {
        // console.log('create user')
    }

    private onCompanyChange(e) {
        this.getTaxesList(e)
        this.getInstanceCodeList(e)
    }

    private testData: any[] = []

    private modifyInvoiceAddress() {
        this.$modal
            .open(
                ModifyInvoiceAddress,
                {
                    invoice: {
                        country_id: this.order.country_id,
                        id: this.order.id,
                        partner_id: this.order.partner_id
                    },
                    countryList: this.countryList,
                    changeSpinning: this.changeSpinning
                },
                {
                    title: this.$t('action.modify_address'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                this.$message.success('修改成功')
            })
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "customer": "Customer",
            "invoice_date": "Invoice Date",
            "country": "Country",
            "nr": "Nr.",
            "city": "City",
            "street": "Street",
            "need_refund": "Need Refund",
            "refund_time": "Refund Time",
            "instance_code": "Instance Code",
            "zip": "Zip",
            "email": "Email",
            "order_refund_status": "Order Refund Status",
            "phone": "Phone",
            "company": "Company",
            "memo": "Memo",
            "name": "Order Name",
            "operate_message": "Operate Message",
            "uploaded_in_taxdoo": "Uploaded in Taxdoo",
            "vat_number": "VAT Number",
            "source_document": "Source Document",
            "description": "Reference/Description",
            "currency": "Currency"
        },
        "action": {
            "order_detail": "Order Detail",
            "other_form": "Other Form",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "confirm_order": "Confirm Order",
            "cancel_order": "Cancel Order",
            "create_invovice": "Create Invovice",
            "detail": "Detail",
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "send_email": "Send Email",
            "refund": "Refund Supplement Wizard",
            "modify_cp": "Modify CP",
            "modify_address": "Modify Invoice Address",
            "save": "Save"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "plzInput": "Please Input",
        "plzSelect": "Please Select"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "customer": "客户",
            "invoice_date": "发票日期",
            "country": "国家",
            "nr": "门牌号",
            "city": "城市",
            "street": "街道",
            "need_refund": "需要退款",
            "refund_time": "退款时间",
            "instance_code": "实例",
            "zip": "邮编",
            "email": "邮箱",
            "order_refund_status": "退款状态",
            "phone": "手机号",
            "company": "公司",
            "memo": "备注",
            "name": "名称",
            "operate_message": "操作信息",
            "uploaded_in_taxdoo": "Uploaded in Taxdoo",
            "vat_number": "VAT Number",
            "source_document": "Source Document",
            "description": "Reference/Description",
            "currency": "币种"
        },
        "action": {
            "order_detail": "订单详情",
            "other_form": "其它信息",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "confirm_order": "确认订单",
            "cancel_order": "取消订单",
            "create_invovice": "创建发票",
            "detail": "详情",
            "today": "前一天",
            "yestoday": "前两天",
            "3day": "前三天",
            "send_email": "发送邮件",
            "refund": "退款管理",
            "modify_cp": "修改CP",
            "modify_address": "修改发票地址",
            "save": "保存"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "plzInput": "请输入",
        "plzSelect": "请选择"
    }
}
</i18n>
