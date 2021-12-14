<template>
    <section class="component order-detail">
        <a-tabs
            defaultActiveKey="base"
            :v-model="activeKey"
            @change="e => onPanelChange(e)"
            :style="{ height: divHeight }"
        >
            <a-tab-pane :tab="$t('base')" key="base">
                <OrderBaseDetail
                    :info="info"
                    :height="divHeight"
                ></OrderBaseDetail>
            </a-tab-pane>
            <a-tab-pane :tab="$t('pickingList')" key="picking">
                <OrderPickingDetail
                    :info="pick"
                    :height="divHeight"
                ></OrderPickingDetail>
            </a-tab-pane>
            <a-tab-pane :tab="$t('invoices')" key="invoice">
                <OrderInvoiceDetail
                    :info="invoice"
                    :height="divHeight"
                    :systemUsers="systemUsers"
                    :companyList="companyList"
                    :changeSpinning="changeSpinning"
                ></OrderInvoiceDetail>
            </a-tab-pane>
            <a-tab-pane :tab="$t('customerProblem')" key="customer">
                <OrderCustomerDetail
                    :info="customer"
                    :height="divHeight"
                    :systemUsers="systemUsers"
                    :orderId="id"
                    :changeSpinning="changeSpinning"
                ></OrderCustomerDetail>
            </a-tab-pane>
            <a-tab-pane
                v-if="changeSpinning && this.picking_id"
                :tab="$t('pickingdetail')"
                key="pickingdetail"
            >
                <div>
                    <a-card>
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            1. {{ $t('title-1') }}
                        </h3>
                        <DemandDetail
                            :info="demands"
                            :id="id"
                            :changeSpinning="changeSpinning"
                        ></DemandDetail>
                    </a-card>
                    <a-card style="margin-top:10px;">
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            2. {{ $t('title-2') }}
                        </h3>
                        <OperationDetail
                            :info="operations"
                            :id="id"
                            :changeSpinning="changeSpinning"
                        ></OperationDetail>
                    </a-card>
                    <a-card style="margin-top:10px;">
                        <h3 style="margin-top:10px;color:#000;font-weight:600;">
                            3. {{ $t('title-3') }}
                        </h3>
                        <ShipmentDetail
                            :info="shipments"
                            :id="id"
                            :systemUsers="systemUsers"
                            :shipTypeList="shipTypeList"
                            :saveShipment="saveShipment"
                            :changeSpinning="changeSpinning"
                        ></ShipmentDetail>
                    </a-card>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('operateLogs')" key="log">
                <OrderLogDetail
                    :info="logs"
                    :height="divHeight"
                    :systemUsers="systemUsers"
                ></OrderLogDetail>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import OrderBaseDetail from './order-base-detail.vue'
import OrderCustomerDetail from './order-customer-detail.vue'
import OrderPickingDetail from './order-picking-detail.vue'
import OrderInvoiceDetail from './order-invoice-detail.vue'
import OrderLogDetail from './order-log-detail.vue'
import { OrderService } from '../../services/order.service'
import { LoadingService } from '../../bootstrap/services/loading.service'
import { RequestParams } from '@/core/http'
import { TaxesService } from '../../services/taxes.service'
import OperationDetail from '../picking/operation-detail.vue'
import DemandDetail from '../picking/demand-detail.vue'
import ShipmentDetail from '../picking/shipment-detail.vue'
import { PickingService } from '@/services/picking.service'
import { namespace } from 'vuex-class'

const datasModule = namespace('datasModule')

@Component({
    components: {
        OrderBaseDetail,
        OrderCustomerDetail,
        OrderPickingDetail,
        OrderInvoiceDetail,
        OrderLogDetail,
        OperationDetail,
        DemandDetail,
        ShipmentDetail
    }
})
export default class OrderDetail extends Vue {
    @Prop()
    detail: any

    @Prop()
    private height: any

    @Prop()
    private systemUsers

    @Prop()
    private companyList

    @Prop()
    private cnt

    @Prop({ default: 0 })
    private picking_id

    @Prop()
    private changeSpinning

    private id: any = 0

    private activeKey: any = 'base'

    private divHeight: any = 300

    private saveShipment: any = 0

    @datasModule.State
    private shipTypeList

    @datasModule.Action
    private getShipType

    @Watch('detail')
    private onDetailChange() {
        // if (!this.detail.id || (this.detail.id && this.id != this.detail.id)) {
        if (this.detail.id) {
            this.id = this.detail.id
            this.info = []
            this.pick = []
            this.invoice = []
            this.customer = []
            this.logs = []

            if (this.activeKey == 'base') {
                this.getOrderDetail()
            } else if (this.activeKey == 'picking') {
                this.getPickList()
            } else if (this.activeKey == 'invoice') {
                this.getInvoiceList()
            } else if (this.activeKey == 'customer') {
                this.getCustomerList()
            } else if (this.activeKey == 'log') {
                this.getLogList()
            } else if (this.picking_id && this.activeKey == 'pickingdetail') {
                this.getOperations()
                this.getDemands()
                this.getShipments()
            }
        } else {
            this.info = []
            this.pick = []
            this.invoice = []
            this.customer = []
            this.logs = []
            this.operations = []
            this.demands = []
            this.shipments = []
        }
    }

    @Watch('cnt')
    private onCntChange() {
        this.info = []
        this.pick = []
        this.invoice = []
        this.customer = []
        this.logs = []
        this.operations = []
        this.demands = []
        this.shipments = []
    }

    @Watch('picking_id')
    private onPickingIDChange() {
        this.operations = []
        this.demands = []
        this.shipments = []
        if (this.picking_id && this.activeKey == 'pickingdetail') {
            this.getOperations()
            this.getDemands()
            this.getShipments()
        }
    }

    @Watch('height')
    private onHeightChange() {
        this.divHeight = this.height
    }

    private created() {
        this.getShipType()
        if (this.detail && this.detail.id) {
            this.getOrderDetail()
        }
        this.divHeight = this.height
    }

    private info: any[] = []

    private pick: any[] = []

    private invoice: any[] = []

    private customer: any[] = []

    private logs: any[] = []

    private operations: any[] = []

    private demands: any[] = []

    private shipments: any[] = []

    private orderService = new OrderService()

    private loadingService = new LoadingService()
    private pickingService = new PickingService()

    private onPanelChange(e) {
        this.activeKey = e
        if (e == 'base') {
            this.getOrderDetail()
        } else if (e == 'picking') {
            this.getPickList()
        } else if (e == 'invoice') {
            this.getInvoiceList()
        } else if (e == 'customer') {
            this.getCustomerList()
        } else if (e == 'log') {
            this.getLogList()
        } else if (this.picking_id && e == 'pickingdetail') {
            this.getOperations()
            this.getDemands()
            this.getShipments()
        }
    }

    private get loading() {
        let loading: any = {}
        if (this.changeSpinning) {
            this.changeSpinning(true)
        } else {
            loading = { loading: this.loadingService }
        }
        return loading
    }

    private closeLoading() {
        if (this.changeSpinning) {
            this.changeSpinning(false)
        }
    }

    private getOrderDetail() {
        if (!this.detail) return
        this.orderService
            .getDetail(
                new RequestParams(
                    {
                        order_id: this.detail.id
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.info = data.order_lines.map(x => {
                        let tax = this.detail.taxList.find(
                            t => t.id === x.account_tax_id
                        )
                        if (tax) {
                            x['tax_name'] = tax.name
                            x.account_tax_id = tax.amount
                        } else {
                            x['tax_name'] = x.account_tax_id
                            x.account_tax_id = 0
                        }

                        return x
                    })
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private getPickList() {
        if (!this.detail) return
        this.orderService
            .getPickList(
                new RequestParams(
                    {
                        order_id: this.detail.id
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.pick = data
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private getInvoiceList() {
        if (!this.detail) return
        this.orderService
            .getInvoiceList(
                new RequestParams(
                    {
                        order_name: this.detail.name
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.invoice = data
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private getCustomerList() {
        if (!this.detail) return
        this.orderService
            .getCustomerList(
                new RequestParams(
                    {
                        order_id: this.detail.id
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.customer = data
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private getLogList() {
        if (!this.detail) return
        this.orderService
            .getLogList(
                new RequestParams(
                    {
                        order_id: this.detail.id
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.logs = data
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private getOperations() {
        this.pickingService
            .queryStockOperation(
                new RequestParams(
                    {
                        picking_id: parseInt(this.picking_id)
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.operations = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private getDemands() {
        this.pickingService
            .queryStockMove(
                new RequestParams(
                    {
                        picking_id: parseInt(this.picking_id)
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.demands = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private getShipments() {
        this.pickingService
            .queryShipment(
                new RequestParams(
                    {
                        picking_id: parseInt(this.picking_id)
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.shipments = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "base": "Order Detail",
        "customerProblem": "Customer Problem",
        "pickingList": "Picking List",
        "invoices": "Invoices",
        "operateLogs": "Operate Logs",
        "pickingdetail": "Picking Detail",
        "title-1": "Details of the products to be shipped",
        "title-2": "Details of the reserved position of the shipped product in the warehouse",
        "title-3": "Logistics package details required to ship products"
    },
    "zh-cn": {
        "base": "订单详情",
        "customerProblem": "客户问题",
        "pickingList": "拣货列表",
        "invoices": "发票",
        "operateLogs": "操作日志",
        "pickingdetail": "发货明细",
        "title-1": "所需发货产品明细",
        "title-2": "发货产品在仓库预留位置明细",
        "title-3": "发货产品打包物流包裹明细"
    }
}
</i18n>
