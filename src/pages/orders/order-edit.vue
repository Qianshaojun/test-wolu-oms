<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <a-card class="margin-y" style="margin:0 !important">
            <section class="component edit-customer">
                <a-form
                    :form="form"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16 }"
                >
                    <a-card class="margin-top order-edit-page">
                        <a-row>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.customer')"
                                    required
                                >
                                    <a-select
                                        show-search
                                        v-decorator="[
                                            `partner_id`,
                                            { rules: rules.required }
                                        ]"
                                        :placeholder="$t('plzInput')"
                                        style="width: 300px"
                                        :default-active-first-option="false"
                                        :show-arrow="false"
                                        :filter-option="false"
                                        :not-found-content="null"
                                        size="small"
                                        @search="handleSearch"
                                        @change="e => onCustomerChange(e)"
                                    >
                                        <a-select-option
                                            v-for="item in customerList"
                                            :key="item.id"
                                            :value="item.id"
                                        >
                                            <span
                                                v-if="
                                                    item.id ===
                                                        currentCustomerValue
                                                "
                                            >
                                                <a>
                                                    {{ item.name }}
                                                </a>
                                            </span>
                                            <span v-else>
                                                {{ item.name }}
                                            </span>
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.date_order')">
                                    <a-date-picker
                                        v-decorator="[
                                            `date_order`,
                                            {
                                                initialValue: moment(Date.now())
                                            }
                                        ]"
                                        format="YYYY-MM-DD HH:mm:ss"
                                        size="small"
                                        style="width: 300px;"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.country')"
                                    required
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'country_id',
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        :style="{
                                            width: '100%',
                                            'max-width': '300px'
                                        }"
                                        size="small"
                                        :filterOption="filterSelectOption"
                                        :placeholder="$t('plzSelect')"
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
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.order_type')"
                                    required
                                >
                                    <a-select
                                        show-search
                                        v-decorator="[
                                            `order_type`,
                                            {
                                                initialValue:
                                                    $dict.OrderType[0].value
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        style="width: 300px"
                                        size="small"
                                    >
                                        <a-select-option
                                            v-for="item in $dict.OrderType"
                                            :key="item.value"
                                            :value="item.value"
                                        >
                                            {{ $t(item.label) }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.city')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            `city`,
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        size="small"
                                        :placeholder="$t('plzInput')"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.street2')">
                                    <a-input
                                        v-decorator="[`street2`]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        style="width: 300px"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.street')"
                                    required
                                >
                                    <a-input
                                        :placeholder="$t('plzInput')"
                                        v-decorator="[
                                            `street`,
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        size="small"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12" required>
                                <a-form-item :label="$t('columns.seller_code')">
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'seller_code',
                                            {
                                                rules: rules.required
                                            }
                                        ]"
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
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.zip')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            `zip`,
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.instance_code')"
                                    required
                                >
                                    <a-select
                                        showSearch
                                        v-decorator="[
                                            'instance_code',
                                            {
                                                rules: rules.required
                                            }
                                        ]"
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
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.email')">
                                    <a-input
                                        v-decorator="[`email`]"
                                        size="small"
                                        :placeholder="$t('plzInput')"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.delivery_method')"
                                >
                                    <a-select
                                        size="small"
                                        v-decorator="[`carrier_id`]"
                                        style="width: 300px"
                                        :placeholder="$t('plzSelect')"
                                    >
                                        <a-select-option value="" key="">
                                            <span style="color:#ccc;"
                                                >null</span
                                            >
                                        </a-select-option>
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of deliveryMethodList"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.phone')">
                                    <a-input
                                        v-decorator="[`phone`]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        :maxLength="11"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12" required>
                                <a-form-item :label="$t('columns.currency')">
                                    <a-select
                                        size="small"
                                        v-decorator="[
                                            `pricelist_id`,
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
                        </a-row>
                        <a-row>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.name')">
                                    <a-input
                                        v-decorator="[`name`]"
                                        size="small"
                                        :placeholder="$t('plzInput')"
                                        :disabled="true"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.sales_person')"
                                    required
                                >
                                    <a-select
                                        v-decorator="[
                                            `user_id`,
                                            {
                                                initialValue: defaultUserId
                                            },
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        style="width: 300px"
                                        :placeholder="$t('plzSelect')"
                                        size="small"
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item in salesPersonList"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                        <a-row>
                            <a-col :span="23">
                                <a-form-item
                                    :label="$t('columns.memo')"
                                    :labelCol="{ span: 3 }"
                                    :wrapperCol="{ span: 20 }"
                                    style="margin-left: 10px"
                                >
                                    <a-textarea
                                        v-decorator="[`memo`]"
                                        :placeholder="$t('plzInput')"
                                        size="small"
                                        :rows="4"
                                        style="width: 80%;"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                    <a-card class="margin-top">
                        <a-tabs defaultActiveKey="base">
                            <a-tab-pane
                                :tab="$t('action.order_detail')"
                                key="base"
                            >
                                <AddOrderDetail
                                    :info="orderDetail"
                                    :taxesList="this.taxesList"
                                    @change="onDetailListChange($event)"
                                ></AddOrderDetail>
                            </a-tab-pane>
                            <a-tab-pane
                                :tab="$t('action.other_info')"
                                key="oter"
                            >
                                <a-row :gutter="24">
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="
                                                $t('columns.picking_policy')
                                            "
                                            required
                                        >
                                            <a-select
                                                v-decorator="[
                                                    `picking_policy`,
                                                    {
                                                        initialValue: defaultPickPolicy
                                                    },
                                                    {
                                                        rules: rules.required
                                                    }
                                                ]"
                                                style="width: 100%"
                                                :placeholder="$t('plzSelect')"
                                                size="small"
                                            >
                                                <a-select-option
                                                    v-for="item in $dict.ShippingPolicy"
                                                    :key="item.value"
                                                    :value="item.value"
                                                >
                                                    {{ $t(item.label) }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="
                                                $t('columns.fiscal_position')
                                            "
                                        >
                                            <a-select
                                                v-decorator="[
                                                    `fiscal_position_id`
                                                ]"
                                                style="width: 100%"
                                                :placeholder="$t('plzSelect')"
                                                size="small"
                                            >
                                                <a-select-option
                                                    value=""
                                                    key=""
                                                >
                                                    <span style="color:#ccc;"
                                                        >null</span
                                                    >
                                                </a-select-option>
                                                <a-select-option
                                                    :value="item.code"
                                                    v-for="item in fiscalPositionList"
                                                    :key="item.code"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="$t('columns.sales_team')"
                                        >
                                            <a-select
                                                v-decorator="[`team_id`]"
                                                style="width: 100%"
                                                :placeholder="$t('plzSelect')"
                                                size="small"
                                            >
                                                <a-select-option
                                                    value=""
                                                    key=""
                                                >
                                                    <span style="color:#ccc;"
                                                        >null</span
                                                    >
                                                </a-select-option>
                                                <a-select-option
                                                    :value="item.code"
                                                    v-for="item in salesTeamList"
                                                    :key="item.code"
                                                >
                                                    {{ item.name }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                    <a-col :span="12">
                                        <a-form-item
                                            :label="
                                                $t('columns.invoice_policy')
                                            "
                                        >
                                            <a-select
                                                v-decorator="[`invoice_policy`]"
                                                style="width: 100%"
                                                :placeholder="$t('plzSelect')"
                                                size="small"
                                            >
                                                <a-select-option
                                                    value=""
                                                    key=""
                                                >
                                                    <span style="color:#ccc;"
                                                        >null</span
                                                    >
                                                </a-select-option>
                                                <a-select-option
                                                    v-for="item in $dict.InvoicePolicy"
                                                    :key="item.value"
                                                    :value="item.value"
                                                >
                                                    {{ $t(item.label) }}
                                                </a-select-option>
                                            </a-select>
                                        </a-form-item>
                                    </a-col>
                                </a-row>
                            </a-tab-pane>
                        </a-tabs>
                    </a-card>
                </a-form>
                <div class="flex-row justify-content-end margin-top">
                    <a-button type="primary" @click="onSubmit(0)"
                        >{{ $t('action.save') }}
                    </a-button>
                </div>
            </section>
        </a-card>
    </page-container>
</template>

<style scoped>
.order-edit-page .ant-form-item {
    margin-bottom: 5px !important;
}

.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import AddOrderDetail from '~/components/orders/add-order-detail.vue'
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

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Page({
    layout: 'workspace',
    name: 'order-edit'
})
@Component({
    components: {
        OrderDetail,
        AddOrderDetail
    }
})
export default class OrderEdit extends Vue {
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

    private currentCustomerValue: any = ''

    private originData: any = []

    private defaultPickPolicy: any = ''

    private defaultUserId: any = 0

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
    orderEditParams

    @userModule.State
    private id

    @Watch('orderEditParams')
    onOrderEditPatamsChange() {
        if (this.orderEditParams) {
            this.updateOrder(this.orderEditParams)
        }
    }

    private updateOrder(order) {
        this.originData = order
        this.$nextTick(() => {
            this.order = order[0]
            this.save_flag = 1
            this.order.date_order = moment(
                this.order.date_order,
                'YYYY-MM-DD HH:ii:ss'
            )
            this.defaultUserId = this.order.user_id
            this.orderDetail = this.order.order_detail_list.map((x, i) => {
                x['price_tax'] = x.account_tax_id
                x['index'] = i + 1
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
            this.form.setFieldsValue(this.order)
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcountry()
        this.getcurrency()
        this.getcompany()
        this.getTeamList()
        this.getFiscalPositionList()
        this.getDeliveryMethodList()
        // this.getTaxesList()
        this.getSalesPersonList()
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
        if (this.$route.params.order) {
            this.updateOrder(this.$route.params.order)
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

    private getTeamList() {
        this.crmteamService
            .queryAll(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.salesTeamList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getFiscalPositionList() {
        this.fiscalPositionService
            .queryAll(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.fiscalPositionList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDeliveryMethodList() {
        this.deliveryMethodService
            .queryAll(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.deliveryMethodList = data
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
                    this.$message.error(err.message)
                }
            )
    }

    private getSalesPersonList() {
        this.userService
            .querySalesUser(
                new RequestParams(
                    {},
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(
                data => {
                    this.salesPersonList = data
                },
                err => {
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
            if (this.save_flag) {
                values['id'] = this.order.id
                values['user_id'] = values['user_id']
                    ? values['user_id']
                    : this.defaultUserId
            }
            values['partner_name'] = this.partnerName

            if (!values.picking_policy) {
                values['picking_policy'] = this.defaultPickPolicy
            }

            //客户不存在的时候
            if (values['partner_id'] == this.partnerName) {
                // values['partner_id'] = ''
                delete values['partner_id']
            }
            for (var i of this.orderDetail) {
                if (i.product_id === 0) {
                    this.$message.error('请先完善明细中的产品信息')
                    return false
                }
            }
            values['order_detail_list'] = this.orderDetail.map(x => {
                delete x.index
                delete x.invoiced
                delete x.delivered
                delete x.subtotal
                delete x.fulfillment_center
                delete x.available_qty
                delete x.product
                delete x.account_tax_id
                delete x.fulfillment_center_id
                delete x.id
                delete x.product_url
                delete x.stock_de_available_qty
                delete x.stock_uk_available_qty
                x.price_tax = x.price_tax ? x.price_tax : 0
                if (x.price_tax) {
                    x['tax_id'] = x.price_tax
                }

                let tax = this.taxesList.find(y => y.id === x.tax_id)
                if (tax && tax.amount) {
                    x.price_tax = tax.amount
                }
                return x
            })
            if (values.carrier_id == '') {
                delete values.carrier_id
            }
            if (values.invoice_policy == '') {
                delete values.invoice_policy
            }
            if (values.fiscal_position_id == '') {
                delete values.fiscal_position_id
            }
            if (values.team_id == '') {
                delete values.team_id
            }
            delete values.name
            this.orderService
                .save(
                    new RequestParams(values, {
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        let msg: any = this.$t('tips.save_success')
                        this.$message.success(msg)
                        if (this.save_flag === 0) {
                            this.save_flag = 1
                            let vls = this.form.getFieldsValue()

                            let name = data[0].order_id.toString()
                            if (name.length < 8) {
                                while (name.length < 8) {
                                    name = '0' + name
                                }
                            }
                            vls['name'] = 'SO' + name
                            vls['partner_id'] = data[0].partner_id
                            this.form.setFieldsValue(vls)
                        }

                        this.order.id = data[0].order_id

                        // this.form.resetFields()
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private timeout: any

    private fetch(value, callback) {
        if (!value) {
            return
        }
        if (this.timeout) {
            clearTimeout(this.timeout)
            this.timeout = null
        }
        this.currentCustomerValue = value
        let _that = this

        function searchCustomer() {
            let params = CommonService.createQueryCondition(
                { name: _that.currentCustomerValue },
                {
                    name: 'rlike',
                    ...formConfig.condition
                }
            )
            _that.partnerService
                .queryCustomerContact(
                    new RequestParams(params, {
                        page: _that.pageService,
                        loading: _that.loadingService
                    })
                )
                .subscribe(data => {
                    data.push({
                        id: value,
                        name: value
                    })
                    callback(data)
                })
        }

        this.timeout = setTimeout(searchCustomer, 300)
    }

    private createUser(name) {
        // console.log('create user')
    }

    private onCustomerChange(e) {
        let customer = this.customerList.find(x => x.id === e)
        if (customer) {
            this.partnerName = customer.name
            let values = this.form.getFieldsValue()
            values['country_id'] = customer.country_id
            values['city'] = customer.city
            values['zip'] = customer.zip
            values['street'] = customer.street
            values['street2'] = customer.street2
            values['phone'] = customer.phone
            values['email'] = customer.email
            values['partner_id'] = customer.id

            this.form.setFieldsValue(values)
            let _that = this
            this.fetch(customer.id, data => (_that.customerList = data))
        }
    }

    private onCompanyChange(e) {
        this.getTaxesList(e)
        this.getInstanceCodeList(e)
    }

    private testData: any[] = []

    private handleSearch(value) {
        this.fetch(value, data => (this.customerList = data))
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "customer": "Customer",
            "date_order": "Order Date",
            "country": "Country",
            "order_type": "Order Type",
            "city": "City",
            "street": "Street",
            "street2": "Street2",
            "seller_code": "Seller Code",
            "instance_code": "Instance Code",
            "zip": "Zip",
            "email": "Email",
            "delivery_method": "Delivery Method",
            "phone": "Phone",
            "company": "Company",
            "memo": "Memo",
            "name": "Order Name",
            "picking_policy": "Picking Policy",
            "sales_person": "Sales Person",
            "sales_team": "Sales Team",
            "fiscal_position": "Fiscal Position",
            "invoice_policy": "Invoice Policy",
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
            "order_detail": "Order Detail",
            "other_info": "Other Info",
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
            "date_order": "订单日期",
            "country": "国家",
            "order_type": "订单类型",
            "city": "城市",
            "street": "街道",
            "street2": "街道2",
            "seller_code": "店铺",
            "instance_code": "实例",
            "zip": "邮编",
            "email": "邮箱",
            "delivery_method": "发货方式",
            "phone": "手机号",
            "company": "公司",
            "memo": "备注",

            "name": "订单号",
            "picking_policy": "发货策略",
            "sales_person": "销售人员",
            "sales_team": "销售团队",
            "fiscal_position": "贸易术语",
            "invoice_policy": "发票策略",
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
            "order_detail": "订单明细",
            "other_info": "其它信息",
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
