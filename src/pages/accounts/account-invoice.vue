<template>
    <page-container ref="pageContainer" :showHeader="false">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getInvoiceList"
            :column="2"
        >
            <!--默认查询-->
            <template #default>
                <a-form-item
                    :label="$t('columns.origin')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['origin']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="[
                            'number',
                            { initialValue: defaultNumber }
                        ]"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ebay_buyer_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['ebay_buyer_id']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.partner_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['partner_name']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.seller_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        mode="tags"
                        show-search
                        v-decorator="['seller_code']"
                        :style="{ width: '200px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filter-option="filterOption"
                    >
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.refund_memo')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['refund_memo']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.date_invoice')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="[
                            'date_invoice',
                            { initialValue: initialDate }
                        ]"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:10px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fillYestoday"
                        size="small"
                        type="primary"
                        style="margin-left:10px;"
                        >{{ $t('action.yestoday') }}
                    </a-button>
                    <a-button
                        @click="fill3day"
                        size="small"
                        type="primary"
                        style="margin-left:10px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    @click="sendInvoce"
                    :disabled="selectedRowKeys.length != 1"
                >
                    {{ $t('action.sendInvoce') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="downloadInvoce"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.downloadInvoce') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="flagRefunded"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.flag_refunded') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="exportAccountInvoice"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.export_account_invoice') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y" style="margin:0 !important">
            <data-table
                :stripe="true"
                :data="data"
                :page="pageService"
                rowKey="id"
                :rowSelection="{
                    selectedRowKeys: selectedRowKeys,
                    onChange: keys => (selectedRowKeys = keys)
                }"
                @on-page-change="getInvoiceList"
                @onClick="
                    record => {
                        this.selectedRowKeys = [record]
                        onTrClick(record)
                    }
                "
                style="table-layout:fixed;"
                :scroll="{ y: 420 }"
            >
                <a-table-column
                    :title="$t('columns.partner_name')"
                    key="partner_name"
                    data-index="partner_name"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.date_invoice')"
                    key="date_invoice"
                    data-index="date_invoice"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.number')"
                    key="number"
                    data-index="number"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.company_name')"
                    key="company_name"
                    align="center"
                >
                    <template slot-scope="row">
                        <a :title="row.company_name">
                            {{
                                row.company_name
                                    ? row.company_name.substr(0, 5) + '...'
                                    : ''
                            }}
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.user_name')"
                    key="user_name"
                    data-index="user_name"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.create_user_name')"
                    key="create_user_name"
                    data-index="create_user_name"
                    align="left"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.date_due')"
                    key="date_due"
                    data-index="date_due"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.origin')"
                    key="origin"
                    align="center"
                >
                    <template slot-scope="row">
                        <a @click="toPageOrder(row.origin)">{{ row.origin }}</a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.amount_total_signed')"
                    key="amount_total_signed"
                    align="right"
                >
                    <template slot-scope="row">
                        {{ row.amount_total_signed.toFixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.residual_signed')"
                    key="residual_signed"
                    align="right"
                >
                    <template slot-scope="row">
                        {{ row.residual_signed.toFixed(2) }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.state')"
                    key="state"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a
                                style="background:none;color:#1890ff;"
                                @click="e => e.preventDefault()"
                            >
                                {{ row.state }}
                                <a-icon type="down" />
                            </a>
                            <a-menu slot="overlay">
                                <a-menu-item
                                    key="draft"
                                    :disabled="
                                        row.state == 'draft' ||
                                            row.state == 'paid'
                                    "
                                    @click="
                                        changeState(row.id, 'draft', row.state)
                                    "
                                >
                                    Draft
                                </a-menu-item>
                                <a-menu-item
                                    key="open"
                                    :disabled="
                                        row.state == 'open' ||
                                            row.state == 'cancel'
                                    "
                                    @click="
                                        changeState(row.id, 'open', row.state)
                                    "
                                >
                                    <span>Open</span>
                                </a-menu-item>
                                <a-menu-item
                                    key="cancel"
                                    :disabled="
                                        row.state == 'cancel' ||
                                            row.state == 'open' ||
                                            row.state == 'paid'
                                    "
                                    @click="
                                        changeState(row.id, 'cancel', row.state)
                                    "
                                >
                                    <span>Cancel</span>
                                </a-menu-item>
                                <a-menu-item
                                    key="paid"
                                    :disabled="
                                        row.state == 'paid' ||
                                            row.state == 'cancel' ||
                                            row.state == 'draft'
                                    "
                                    @click="
                                        changeState(row.id, 'paid', row.state)
                                    "
                                >
                                    <span>paid</span>
                                </a-menu-item>
                            </a-menu>
                        </a-dropdown>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.payment_method')"
                    key="payment_method"
                    data-index="payment_method"
                    align="center"
                ></a-table-column>
                <a-table-column
                    :title="$t('columns.need_refund')"
                    key="need_refund"
                    data-index="need_refund"
                    align="center"
                >
                    <template slot-scope="need_refund">
                        {{ need_refund | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.refund_time')"
                    key="refund_time"
                    data-index="refund_time"
                    align="center"
                >
                    <template slot-scope="refund_time">
                        {{ refund_time | datetolocal }}
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.refund_memo')"
                    key="refund_memo"
                    width="8%"
                    align="left"
                    ellipsis="true"
                >
                    <template slot-scope="row">
                        <a :title="row.refund_memo">
                            {{
                                row.refund_memo
                                    ? row.refund_memo.substr(0, 7) + '...'
                                    : ''
                            }}
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.order_refund_status')"
                    key="order_refund_status"
                    data-index="order_refund_status"
                    align="center"
                >
                </a-table-column>
                <a-table-column
                    :title="$t('columns.operate_message')"
                    key="operator_message"
                    width="8%"
                    align="left"
                >
                    <template slot-scope="row">
                        <a :title="row.operator_message">
                            {{
                                row.operator_message
                                    ? row.operator_message.substr(0, 7) + '...'
                                    : ''
                            }}
                        </a>
                    </template>
                </a-table-column>
                <a-table-column
                    :title="$t('columns.action')"
                    key="action"
                    align="center"
                >
                    <template slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item
                                    @click="onEdit(row)"
                                    v-if="row.state == 'draft'"
                                    >{{ $t('action.edit') }}
                                </a-menu-item>
                                <a-menu-item @click="onChangeState(row)"
                                    >{{ $t('action.change_state') }}
                                </a-menu-item>
                                <a-menu-item @click="onDelete(row)"
                                    >{{ $t('action.delete') }}
                                </a-menu-item>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </a-table-column>
            </data-table>
        </a-card>
        <a-card v-if="selectedRows[0]">
            <template>
                <section class="component customer-detail">
                    <a-tabs
                        defaultActiveKey="invoice_detail"
                        v-model="activeKey"
                    >
                        <a-tab-pane
                            :tab="$t('invoice_detail')"
                            key="invoice_detail"
                        >
                            <a-table
                                :dataSource="invoice_detail"
                                style="table-layout:fixed;"
                                :pagination="false"
                                :scroll="{ y: 300 }"
                                bordered
                            >
                                <a-table-column
                                    :title="$t('columns.default_code')"
                                    key="default_code"
                                    align="center"
                                    dataIndex="default_code"
                                >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.name')"
                                    key="name"
                                    align="center"
                                    dataIndex="name"
                                >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.quantity')"
                                    key="quantity"
                                    align="center"
                                    dataIndex="quantity"
                                >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.price_unit')"
                                    key="price_unit"
                                    align="center"
                                    dataIndex="price_unit"
                                >
                                </a-table-column>
                                <a-table-column
                                    :title="$t('columns.account_tax_id')"
                                    key="account_tax_id"
                                    align="left"
                                    dataIndex="account_tax_id"
                                >
                                </a-table-column>
                            </a-table>
                        </a-tab-pane>
                        <a-tab-pane :tab="$t('log')" key="log">
                            <LogView
                                :object_name="object_name"
                                :record_code="record_code"
                            ></LogView>
                        </a-tab-pane>
                    </a-tabs>
                </section>
            </template>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Component, Vue, Ref, Watch } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import DataForm from '~/shared/components/data-form.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import LogView from '~/shared/common/log-view.vue'
import router from '../../router'
import moment from 'moment'
import { AccountService } from '../../services/account.service'
import SendEmail from '~/components/common/send-email.vue'
import appConfig from '@/config/app.config'
import ChangeState from '@/components/account/change-state.vue'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { XLSXUtil } from '../../shared/utils/xlsx.util'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'account-invoice'
})
@Component({
    components: {
        LogView
    }
})
export default class AccountInvoice extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private accountService = new AccountService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private sellerInstanceService = new SellerInstanceService()

    // 表格数据源
    private data: any[] = []

    private showBtn: any = false

    // 表格选择项
    private selectedRowKeys: any[] = []

    // 详情项
    private detailInfo: any = null

    private isShow: any = true

    private defaultNumber: any = ''

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @pageParamsModule.Mutation('changeInvoice')
    private changeInvoice

    private get rules() {
        return {}
    }

    @Watch('$route')
    onRouteChange(newRoute, oldRoute) {
        if (this.$route.params.number || this.$route.query.number) {
            let values = this.dataForm.getValues()
            if (this.$route.params.number) {
                values['number'] = this.$route.params.number
            } else {
                values['number'] = this.$route.query.number
            }

            this.dataForm.setValues(values)

            if (this.data.length === 0) {
                this.getInvoiceList()
            }
        }
    }

    private created() {
        this.getcountry()
        this.getcurrency()
        this.getSellerCodeList()
    }

    private mounted() {
        if (this.$route.params.number || this.$route.query.number) {
            if (this.$route.params.number) {
                this.defaultNumber = this.$route.params.number
            } else {
                this.defaultNumber = this.$route.query.number
            }
            let values = this.dataForm.getValues()
            values['number'] = this.defaultNumber
            this.dataForm.setValues(values)
            this.getInvoiceList()
        }
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id === record)
        this.selectedRows = [info]
    }

    private moment = moment

    private object_name = 'account_invoice'

    private initialDate: any = []

    private sellerCodeList: any[] = []

    private getSellerCodeList() {
        this.sellerInstanceService
            .query_seller_name(new RequestParams({}))
            .subscribe(
                data => {
                    this.sellerCodeList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private sendInvoce() {
        let row = this.data.find(x => x.id === this.selectedRowKeys[0])
        this.$modal
            .open(
                SendEmail,
                {
                    model: 'accountManage',
                    recordID: row.id,
                    data: { orderId: row.order_id, templateId: 5 }
                },
                {
                    title: this.$t('actions.send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['date_invoice'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillYestoday() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_invoice'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3day() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 72 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_invoice'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private formatDate(time) {
        // 空数据处理
        if (time === null || time === undefined || time === '') {
            return ''
        }

        let y = time.getFullYear()
        let m = time.getMonth() + 1
        let d = time.getDate()
        let h = time.getHours()
        let mi = time.getMinutes()
        let s = time.getSeconds()
        m = m < 10 ? `0${m}` : m
        d = d < 10 ? `0${d}` : d
        h = h < 10 ? `0${h}` : h
        mi = mi < 10 ? `0${mi}` : mi
        s = s < 10 ? `0${s}` : s
        return `${y}-${m}-${d} ${h}：${mi}`
    }

    /**
     * 获取账单数据
     */
    private getInvoiceList() {
        this.dataForm.validateFields().then((values: any) => {
            if (values['seller_code'] && values['seller_code'].length > 0) {
                values['seller_code'] = values['seller_code'].join(',')
            }

            let params: any = CommonService.createQueryCondition(values, {
                partner_name: 'like',
                refund_memo: 'like',
                number: 'in_or_=',
                origin: 'in_or_=',
                seller_code: 'in_or_=',
                ebay_buyer_id: 'in_or_=',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array) {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
                            )
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(
                                item.value[1].format('YYYY-MM-DD') +
                                    ' 23:59:59.999999'
                            )
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }
            params.query_condition = nowConditions
            this.accountService
                .getInvoiceList(
                    new RequestParams(params, {
                        page: this.pageService,
                        loading: this.loadingService
                    })
                )
                .subscribe(
                    data => {
                        this.data = data
                        if (!this.record_code) {
                            this.record_code = data[0].id
                        }
                        if (!this.selectedRows[0]) {
                            this.selectedRows = [data[0]]
                            this.selectedRowKeys = [data[0].id]
                        }
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private activeKey: any = 'invoice_detail'
    private invoice_detail: any[] = []
    private record_code = ''
    private selectedRows: any[] = []

    @Watch('selectedRows')
    onselectedRowsChange() {
        this.invoice_detail = []
        if (this.activeKey == 'invoice_detail') {
            this.getInvoiceDetail()
        } else {
            this.record_code = this.selectedRows[0].id
        }
    }

    private getInvoiceDetail() {
        this.accountService
            .getInvoiceDetail(
                new RequestParams(
                    { invoice_id: this.selectedRows[0].id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.invoice_detail = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private toPageOrder(origin) {
        router.push({
            name: 'order-manage',
            params: { origin: origin }
        })
    }

    private downloadInvoce() {
        let params: any[] = []
        params = this.selectedRowKeys.map(code => code)
        let urlParams = encodeURIComponent(JSON.stringify(params))
        window.open(
            appConfig.server +
                '/account/download_invoice_pdf?invoice_id_list=' +
                urlParams
        )
    }

    private onEdit(row) {
        this.accountService
            .queryInvoiceDetailForEdit(
                new RequestParams(
                    { invoice_id: this.selectedRows[0].id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.changeInvoice(data)
                    router.push({
                        name: 'invoice-edit',
                        params: { invoice: data }
                    })
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onDelete(row) {
        this.accountService
            .deleteAccountInvoice(
                new RequestParams(
                    { invoice_id: this.selectedRows[0].id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('删除成功')
                    this.data = this.data.filter(x => x.id != row.id)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onChangeState(row) {
        this.$modal
            .open(
                ChangeState,
                {
                    invoice: { id: row.id, state: row.state }
                },
                { title: this.$t('action.change_state') }
            )
            .subscribe(data => {
                this.accountService
                    .changeInvoiceState(
                        new RequestParams(
                            {
                                id: row.id,
                                state: data.state
                            },
                            { loading: this.loadingService }
                        )
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                            this.getInvoiceList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private filterOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private flagRefunded() {
        this.accountService
            .updateRefundTime(
                new RequestParams(
                    { invoice_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.invoice_detail = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private exportAccountInvoice() {
        let params: any[] = []
        params = this.selectedRowKeys.map(code => code)
        let urlParams = encodeURIComponent(JSON.stringify(params))
        window.open(
            appConfig.server +
                '/account/export_refund_orders?invoice_id_list=' +
                urlParams
        )
    }

    private export22() {
        const xlsxUtil = new XLSXUtil()
        xlsxUtil.readFromJson(
            {
                name: '预约用户名',
                phone: '预约手机号',
                // appointmentDate: '预约日期',
                state: '订单状态'
            },
            this.data.map(x => ({
                name: x.partner_name,
                phone: x.partner_name,
                // appointmentDate:
                //     x.refund_time.split(' ')[0] +
                //     '  ' +
                //     x.refund_time.split('-')[0],
                state: x.state
            })),
            [20, 20, 20, 15]
        )
        xlsxUtil.exportFile('预约管理-234.xlsx')
    }

    private changeState(id, state, oldState) {
        this.accountService
            .changeInvoiceState(
                new RequestParams(
                    {
                        id: id,
                        state: state,
                        oldState: oldState
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getInvoiceList()
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
        "columns": {
            "id": "id",
            "partner_name": "Customer",
            "date_invoice": "Invoice Date",
            "number": "Number",
            "company_name": "Company",
            "user_name": "Salesperson",
            "create_user_name": "Applicant",
            "date_due": "Due Date",
            "origin": "Order Num",
            "amount_total_signed": "Total",
            "residual_signed": "Amount Due",
            "state": "State",
            "payment_method": "Payment Method",
            "need_refund": "Need Refund",
            "refund_time": "Refund Time",
            "refund_memo": "Refund Memo",
            "order_refund_status": "Order Refund Status",
            "operate_message": "Operate Message",
            "default_code": "SKU",
            "name": "Product Name",
            "quantity": "Quantity",
            "price_unit": "Unit Price",
            "account_tax_id": "Account Tax",
            "action": "Action",
            "ebay_buyer_id": "Ebay Buyer ID"
        },
        "action": {
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Days",
            "more": "More",
            "sendInvoce": "Send Invoice",
            "downloadInvoce": "Download Invoice",
            "edit": "Edit",
            "delete": "Delete",
            "more": "More",
            "change_state": "Change State",
            "origin": "Order ID",
            "flag_refunded": "Flag Refunded",
            "export_account_invoice": "Export Refund Orders"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "yes": "Yes",
        "no": "No"
    },
    "zh-cn": {
        "desc": "",
        "columns": {
            "id": "id",
            "partner_name": "客户",
            "date_invoice": "开票日期",
            "number": "发票号",
            "company_name": "公司",
            "user_name": "销售员",
            "create_user_name": "创建人",
            "date_due": "截止日期",
            "origin": "订单号",
            "amount_total_signed": "总计",
            "residual_signed": "退款金额",
            "state": "状态",
            "payment_method": "付款方式",
            "need_refund": "需要退款",
            "refund_time": "退款时间",
            "refund_memo": "退款备注",
            "order_refund_status": "退款状态",
            "operate_message": "信息",
            "default_code": "SKU",
            "name": "产品名称",
            "quantity": "数量",
            "price_unit": "单价",
            "account_tax_id": "税率",
            "action": "操作",
            "ebay_buyer_id": "Ebay买家ID"
        },
        "invoice_detail": "发票明细",
        "log": "日志",
        "action": {
            "today": "前一天",
            "yestoday": "前两天",
            "3day": "前三天",
            "more": "More",
            "sendInvoce": "发送发票",
            "downloadInvoce": "下载发票",
            "edit": "编辑",
            "delete": "删除",
            "more": "更多",
            "change_state": "修改状态",
            "origin": "订单号",
            "flag_refunded": "标志已退款",
            "export_account_invoice": "导出退款订单"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "yes": "是",
        "no": "否"
    }
}
</i18n>
