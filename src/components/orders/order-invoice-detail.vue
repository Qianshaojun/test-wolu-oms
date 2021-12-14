<template>
    <section
        class="component order-product-detail"
        :style="{ height: divHeight + 'px', 'overflow-y': 'auto' }"
    >
        <a-table
            :dataSource="data"
            :pagination="false"
            style="table-layout:fixed;max-height:300px;"
            rowKey="number"
            :scroll="{ x: 1500 }"
            bordered
        >
            <a-table-column
                :title="$t('customer')"
                key="partner_id"
                data-index="partner_id"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('invoice_date')"
                key="date_invoice"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.date_invoice | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('invoice_number')"
                key="number"
                align="center"
            >
                <template slot-scope="row">
                    <a @click="toPageInvoice(row.number)">{{ row.number }}</a>
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('company')"
                key="company_id"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.company_id | dict2(companyList) }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('sales_person')"
                key="user_id"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.user_id | dict2(systemUsers) }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('applicant')"
                key="applicant"
                data-index="applicant"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('due_date')"
                key="date_due"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.date_due | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('source_document')"
                key="origin"
                data-index="origin"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('total')"
                key="amount_total_signed"
                align="right"
            >
                <template slot-scope="row">
                    {{ row.amount_total ? row.amount_total.toFixed(2) : '' }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('amount_due')"
                key="amount_due"
                data-index="amount_due"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('status')"
                key="state"
                data-index="state"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('payment_method')"
                key="payment_method"
                data-index="payment_method"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('need_refund')"
                key="need_refund"
                data-index="need_refund"
                align="center"
            >
                <template slot-scope="scope">
                    {{ scope | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('refund_time')"
                key="refund_time"
                align="center"
            >
                <template slot-scope="row">
                    {{ row.refund_time | datetolocal }}
                </template>
            </a-table-column>
            <a-table-column
                :title="$t('refund_memo')"
                key="refund_memo"
                data-index="refund_memo"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('order_refund_status')"
                key="orderRefundStatus"
                data-index="orderRefundStatus"
                align="center"
            ></a-table-column>
            <a-table-column
                :title="$t('operate_message')"
                key="action"
                align="center"
            >
                <template slot-scope="row">
                    <a-icon
                        type="file"
                        @click="downloadInvoce(row)"
                        style="margin-right:10px"
                    />
                    <a-icon
                        type="setting"
                        @click="editInvoice(row)"
                        style="margin-right:10px"
                    />
                    <a-icon type="mail" @click="sendInvoce(row)" />
                </template>
            </a-table-column>
        </a-table>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import SendEmail from '~/components/common/send-email.vue'
import router from '../../router'
import { AccountService } from '../../services/account.service'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { Mutation, namespace } from 'vuex-class'
import appConfig from '@/config/app.config'

const pageParamsModule = namespace('pageParamsModule')
const chatModule = namespace('chatModule')

@Component({
    components: {}
})
export default class OrderInvoiceDetail extends Vue {
    @Prop()
    private info

    @Prop()
    private height

    @Prop()
    private systemUsers

    @Prop()
    private companyList

    private divHeight: any = 100

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private data: any[] = []

    private mounted() {
        this.data = this.info.map(x => x)

        this.divHeight = this.height
    }

    @Watch('info')
    private onInfoChange() {
        this.data = this.info.map(x => x)
    }

    private accountService = new AccountService()
    private loadingService = new LoadingService()

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    private sendInvoce(row) {
        this.$modal
            .open(
                SendEmail,
                {
                    model: 'accountManage',
                    recordID: row.id,
                    data: { orderId: row.order_id, templateId: 5 },
                    changeSpinning: this.changeSpinning
                },
                {
                    title: this.$t('actions.send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

    @pageParamsModule.Mutation('changeInvoice')
    private changeInvoice

    @chatModule.Mutation('changeInvoiceId')
    private changeInvoiceId

    private editInvoice(row) {
        if (this.$route.name == 'chat-box') {
            this.changeInvoiceId(row.id)
        } else {
            this.accountService
                .queryInvoiceDetailForEdit(
                    new RequestParams(
                        { invoice_id: row.id },
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
    }

    private toPageInvoice(origin) {
        if (this.changeSpinning) {
            let url = this.$router.resolve({
                name: 'account-invoice',
                query: { number: origin }
            })
            window.open(url.href, '_blank')
        } else {
            router.push({
                name: 'account-invoice',
                params: { number: origin }
            })
        }
    }

    private downloadInvoce(row) {
        let urlParams = encodeURIComponent(JSON.stringify([row.id]))
        window.open(
            appConfig.server +
                '/account/download_invoice_pdf?invoice_id_list=' +
                urlParams
        )
    }
}
</script>

<i18n>
{
    "en-us": {
        "customer": "Customer",
        "invoice_date": "Invoice Date",
        "invoice_number": "Invoice Number",
        "company": "Company",
        "sales_person": "Sales_Person",
        "applicant": "Applicant",
        "due_date": "Due Date",
        "source_document": "Source Document",
        "total": "Total",
        "amount_due": "Amount Due",
        "status": "Status",
        "payment_method": "Payment Method",
        "need_refund": "Need Refund",
        "refund_time": "Refund Time",
        "refund_memo": "Refund Memo",
        "order_refund_status": "Order Refund Status",
        "operate_message": "Operate Message",
        "actions": {
            "send_email": "Send Invoice"
        }
    },
    "zh-cn": {
        "customer": "客户",
        "invoice_date": "发票日期",
        "invoice_number": "发票号",
        "company": "公司",
        "sales_person": "销售人员",
        "applicant": "申请人",
        "due_date": "截止日期",
        "source_document": "源文件",
        "total": "总金额",
        "amount_due": "应付金额",
        "status": "状态",
        "payment_method": "支付方式",
        "need_refund": "需要退款",
        "refund_time": "退款时间",
        "refund_memo": "退款原因",
        "order_refund_status": "退款状态",
        "operate_message": "操作消息",
        "actions": {
            "send_email": "发送发票"
        }
    }
}
</i18n>
