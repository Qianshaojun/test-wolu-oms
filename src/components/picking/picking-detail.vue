<template>
    <section class="component order-detail" :style="{ height: divHeight }">
        <a-card class="btn-area" v-if="pageShow">
            <template>
                <a-button type="primary" @click="reserve">
                    {{ $t('action.reserved') }}
                </a-button>
                <a-button type="primary" @click="validateAddress"
                    >{{ $t('action.validate_address') }}
                </a-button>
                <a-button type="primary" @click="createShipment">
                    {{ $t('action.auto_create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="donePickingGetLabel"
                    style="display:none"
                    >{{ $t('action.done_picking_get_label') }}
                </a-button>
                <a-button @click="fake_shipments" type="primary"
                    >{{ $t('action.fake_shipment') }}
                </a-button>
                <a-button @click="upload_shipment" type="primary"
                    >{{ $t('action.upload_shipment') }}
                </a-button>
                <a-button @click="upload_fake_shipment" type="primary"
                    >{{ $t('action.upload_fake_shipment') }}
                </a-button>
                <a-button type="primary" @click="createReturn"
                    >{{ $t('action.createReturn') }}
                </a-button>
                <a-button type="primary" @click="deliveryMore"
                    >{{ $t('action.deliveryMore') }}
                </a-button>
                <a-button
                    v-show="data['is_resend']"
                    type="primary"
                    @click="productPart"
                    >{{ $t('action.ProductPart') }}
                </a-button>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item type="primary">
                            {{ $t('action.create_dhl') }}
                        </a-menu-item>
                        <a-menu-item type="primary">
                            {{ $t('action.create_dpd') }}
                        </a-menu-item>
                        <a-menu-item type="primary">
                            {{ $t('action.create_gls') }}
                        </a-menu-item>
                        <a-menu-item type="primary" @click="modifyAddress"
                            >{{ $t('action.modify_address') }}
                        </a-menu-item>
                        <a-menu-item type="primary" @click="batchSendEmail"
                            >{{ $t('action.batch_send_email') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px"
                        >Action
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
                <a-dropdown>
                    <a-menu slot="overlay">
                        <a-menu-item @click="forceAvailability"
                            >{{ $t('action.force_available') }}
                        </a-menu-item>
                        <a-menu-item @click="cancelPicking"
                            >{{ $t('action.cancelPicking') }}
                        </a-menu-item>
                        <a-menu-item @click="setAsDraft"
                            >{{ $t('action.setAsDraft') }}
                        </a-menu-item>
                        <a-menu-item @click="setPresale"
                            >{{ $t('action.setPresale') }}
                        </a-menu-item>
                        <a-menu-item @click="cancelPresale"
                            >{{ $t('action.cancelPresale') }}
                        </a-menu-item>
                        <a-menu-item @click="markSoldOut"
                            >{{ $t('action.markSoldOut') }}
                        </a-menu-item>
                        <a-menu-item @click="cancelSoldOut"
                            >{{ $t('action.cancelSoldOut') }}
                        </a-menu-item>
                        <a-menu-item @click="checkShipments"
                            >{{ $t('action.checkShipmentCount') }}
                        </a-menu-item>
                        <a-menu-item @click="cancelCheckShipments"
                            >{{ $t('action.cancelShipmentCount') }}
                        </a-menu-item>
                        <a-menu-item @click="serviceProcess"
                            >{{ $t('action.serviceProcess') }}
                        </a-menu-item>
                        <a-menu-item @click="returnProcess"
                            >{{ $t('action.returnProcess') }}
                        </a-menu-item>
                        <a-menu-item @click="customer_service_stop_plz"
                            >{{ $t('action.customer_service_stop_plz') }}
                        </a-menu-item>
                        <a-popconfirm
                            :title="$t('action.confirm_operate_refund_order')"
                            :okText="$t('action.ok')"
                            :cancelText="$t('action.cancel')"
                            placement="left"
                            @confirm="cancel_stock_picking_for_order_refund"
                        >
                            <a-menu-item style="text-indent:10px;"
                                >{{
                                    $t(
                                        'action.cancel_stock_picking_for_order_refund'
                                    )
                                }}
                            </a-menu-item>
                        </a-popconfirm>
                        <!-- <a-menu-item
                            @click="cancel_stock_picking_for_order_refund"
                            >{{
                                $t(
                                    'action.cancel_stock_picking_for_order_refund'
                                )
                            }}</a-menu-item
                        > -->
                    </a-menu>
                    <a-button style="margin-left: 8px"
                        >更多按钮
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </template>
        </a-card>
        <a-tabs
            defaultActiveKey="base"
            :v-model="activeKey"
            @change="e => onPanelChange(e)"
        >
            <a-tab-pane :tab="$t('base')" key="base">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <PickingBaseDetail
                        :info="data"
                        :id="id"
                        :countryList="countryList"
                        :systemUsers="systemUsers"
                    ></PickingBaseDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('operation')" key="operation">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <OperationDetail
                        :info="operations"
                        :id="id"
                    ></OperationDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('initial_demand')" key="demand">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <DemandDetail :info="demands" :id="id"></DemandDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('shipment')" key="shipment">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <ShipmentDetail
                        :info="shipments"
                        :id="id"
                        :systemUsers="systemUsers"
                        :shipTypeList="shipTypeList"
                    ></ShipmentDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('return_info')" key="return">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <ReturnDetail
                        :info="returns"
                        :picking_id="id"
                        :orderID="orderID"
                        :systemUsers="systemUsers"
                    ></ReturnDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('order_detail')" key="order_detail">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <OrderBaseDetail
                        :info="order_info"
                        :height="divHeight"
                    ></OrderBaseDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('invoices')" key="invoices">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <OrderInvoiceDetail
                        :info="invoice"
                        :height="divHeight"
                        :systemUsers="systemUsers"
                        :companyList="companyList"
                    ></OrderInvoiceDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('logs')" key="logs">
                <div
                    :style="
                        !pageShow
                            ? {
                                  height: divHeight + 'px',
                                  'overflow-y': 'scroll'
                              }
                            : ''
                    "
                >
                    <PickingLogDetail
                        :info="logs"
                        :id="id"
                        :systemUsers="systemUsers"
                    ></PickingLogDetail>
                </div>
            </a-tab-pane>
        </a-tabs>
    </section>
</template>

<style>
.max300 {
    max-height: 300px;
    overflow-y: scroll;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
import PickingBaseDetail from './picking-base-detail.vue'
import OperationDetail from './operation-detail.vue'
import DemandDetail from './demand-detail.vue'
import ShipmentDetail from './shipment-detail.vue'
import ReturnDetail from './return-detail.vue'
import PickingLogDetail from './picking-log-detail.vue'
import { Page } from '@/core/decorators'
import { PageService } from '~/bootstrap/services/page.service'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { RequestParams } from '~/core/http'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { PickingService } from '../../services/picking.service'
import { namespace } from 'vuex-class'
import router from '../../router'
import BatchSendEmail from '@/components/picking/batch-send-email.vue'
import CreateReturn from '~/components/picking/create-return.vue'
import { ShipmentService } from '../../services/shipment.service'
import DeliveryMore from '@/components/picking/delivery-more.vue'
import ProductPart from '@/components/picking/product-part.vue'
import { TaxesService } from '../../services/taxes.service'
import { OrderService } from '../../services/order.service'
import OrderBaseDetail from '../orders/order-base-detail.vue'
import { GeneralCodeService } from '../../services/general_code.service'
import OrderInvoiceDetail from '../orders/order-invoice-detail.vue'

const datasModule = namespace('datasModule')

@Component({
    components: {
        PickingBaseDetail,
        OperationDetail,
        DemandDetail,
        ShipmentDetail,
        ReturnDetail,
        PickingLogDetail,
        OrderBaseDetail,
        OrderInvoiceDetail
    }
})
export default class PickingDetail extends Vue {
    @Prop()
    private detail: any

    @Prop()
    id: any

    @Prop({
        default: true
    })
    private pageShow

    @Prop({
        default: 'auto'
    })
    private divHeight

    @Prop({
        default: 0
    })
    private cnt

    @Prop()
    countryList

    @Prop()
    systemUsers

    private activeKey: any = 'base'

    private data: any = {}

    private orderID: any = ''

    @datasModule.State
    private shipTypeList

    @datasModule.Action
    private getShipType

    @datasModule.State
    private companyList

    @Watch('detail')
    private onDetailChange() {
        // if (!this.data.id || (this.data.id && this.detail.id != this.data.id)) {
        if (this.detail.id) {
            this.data = Object.assign({}, this.detail)
            this.orderID = this.data.order_id
            this.getTaxList()
            this.reset()
        }
    }

    private taxList: any[] = []
    private taxesService = new TaxesService()

    private getTaxList() {
        if (this.data.seller_code) {
            this.taxesService
                .queryAll(
                    new RequestParams({
                        seller_code: this.data.seller_code
                    })
                )
                .subscribe(data => {
                    this.taxList = data
                })
        } else {
            this.taxList = []
        }
    }

    private invoice: any = []

    @Watch('cnt')
    private onCntChange() {
        this.data = []
        this.operations = []
        this.demands = []
        this.shipments = []
        this.returns = []
        this.logs = []
        this.order_info = []
        this.invoice = []
    }

    private reset() {
        this.operations = []
        this.demands = []
        this.shipments = []
        this.returns = []
        this.logs = []
        this.order_info = []
        this.invoice = []

        if (this.activeKey == 'operation') {
            this.getOperations()
        } else if (this.activeKey == 'base') {
            this.updatePickingInfo()
        } else if (this.activeKey == 'demand') {
            this.getDemands()
        } else if (this.activeKey == 'shipment') {
            this.getShipments()
        } else if (this.activeKey == 'return') {
            this.getReturns()
        } else if (this.activeKey == 'logs') {
            this.getLogs()
        } else if (this.activeKey == 'order_detail') {
            this.getOrderDetail()
        } else if (this.activeKey == 'invoices') {
            this.getInvoiceList()
        }
    }

    private created() {
        this.getShipType()
    }

    private mounted() {
        this.data = Object.assign({}, this.detail)
        this.orderID = this.data.order_id
    }

    private operations: any[] = []

    private demands: any[] = []

    private shipments: any[] = []

    private returns: any[] = []

    private logs: any[] = []

    private editable: any = false

    private pre_sale: any = false

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private shipmentService = new ShipmentService()

    private generalCodeService = new GeneralCodeService()

    private onPanelChange(e) {
        this.activeKey = e
        if (!this.id) {
            return
        }
        if (e == 'operation') {
            this.getOperations()
        } else if (e == 'demand') {
            this.getDemands()
        } else if (e == 'shipment') {
            this.getShipments()
        } else if (e == 'return') {
            this.getReturns()
        } else if (e == 'logs') {
            this.getLogs()
        } else if (e == 'order_detail') {
            this.getOrderDetail()
        } else if (e == 'invoices') {
            this.getInvoiceList()
        }
    }

    private getInvoiceList() {
        this.orderService
            .getInvoiceList(
                new RequestParams(
                    {
                        order_name: this.data.origin
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.invoice = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getOperations() {
        this.pickingService
            .queryStockOperation(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.operations = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private orderService = new OrderService()
    private order_info: any[] = []

    private getOrderDetail() {
        this.orderService
            .getDetail(
                new RequestParams(
                    {
                        order_id: this.orderID
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.order_info = data.order_lines.map(x => {
                        let tax = this.taxList.find(
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
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getDemands() {
        this.pickingService
            .queryStockMove(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.demands = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getShipments() {
        this.pickingService
            .queryShipment(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.shipments = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getReturns() {
        this.pickingService
            .queryReturnInfo(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.returns = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getLogs() {
        this.pickingService
            .queryPickingLog(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.logs = data.map((x, i) => ({
                        ...x,
                        index: i + 1
                    }))
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

    private editBtn() {
        this.editable = !this.editable
    }

    public handleChange(value, key) {
        this.data[key] = value
    }

    private saveBtn() {
        this.data['save_flag'] = 1
        this.pickingService
            .save(
                new RequestParams(this.data, {
                    loading: this.loadingService
                })
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                },
                err => {
                    this.$message.error(err.message)
                }
            )
        // this.editable = false
    }

    private cancelBtn() {
        this.data = Object.assign({}, this.detail)
        // this.editable = false
    }

    private createShipment() {
        this.pickingService
            .createShipmentsLines(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private reserve() {
        this.pickingService
            .reserve(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private modifyAddress() {
        router.push({
            name: 'modify-address',
            params: { pickingList: JSON.stringify([this.id]) }
        })
    }

    private validateAddress() {
        this.pickingService
            .validateAddress(
                new RequestParams(
                    {
                        picking_id_list: [parseInt(this.id)]
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private batchSendEmail() {
        this.$modal
            .open(
                BatchSendEmail,
                {
                    stock: [this.id]
                },
                {
                    title: this.$t('action.batch_send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
            })
    }

    private cancelPicking() {
        this.pickingService
            .cancelPicking(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private createReturn() {
        this.$modal
            .open(
                CreateReturn,
                {
                    picking_id: parseInt(this.id)
                },
                {
                    title: this.$t('Create Return Shipment'),
                    width: '80%'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('success')
                this.$message.success(msg)
            })
    }

    private donePickingGetLabel() {
        this.shipmentService
            .donePickingGetLabel(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private setAsDraft() {
        this.pickingService
            .setAsDraft(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private setPresale() {
        this.pickingService
            .setPresale(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelPresale() {
        this.pickingService
            .cancelPresale(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private markSoldOut() {
        this.pickingService
            .markSoldOut(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelSoldOut() {
        this.pickingService
            .cancelSoldOut(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private checkShipments() {
        this.pickingService
            .checkShipments(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelCheckShipments() {
        this.pickingService
            .cancelCheckShipments(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private serviceProcess() {
        this.pickingService
            .serviceProcess(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private returnProcess() {
        this.pickingService
            .returnProcess(
                new RequestParams(
                    { picking_id_list: [this.id] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private deliveryMore() {
        this.$modal
            .open(
                DeliveryMore,
                {
                    picking_id: parseInt(this.id)
                },
                {
                    title: this.$t('action.deliveryMore'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.reset()
                this.$router.push({
                    name: 'picking-detail',
                    path: `/picking/picking-detail/${data.new_picking_id}`,
                    params: {
                        id: data.new_picking_id,
                        name: data.new_picking_name
                    }
                })
            })
    }

    private productPart() {
        this.$modal
            .open(
                ProductPart,
                {
                    picking_id: parseInt(this.id)
                },
                {
                    title: this.$t('action.ProductPart'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.reset()
            })
    }

    private customer_service_stop_plz() {
        this.pickingService
            .customer_service_stop_plz(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancel_stock_picking_for_order_refund() {
        this.pickingService
            .cancel_stock_picking_for_order_refund(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private fake_shipments() {
        this.pickingService
            .fake_shipments(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private upload_shipment() {
        this.pickingService
            .upload_shipment(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private upload_fake_shipment() {
        this.pickingService
            .upload_fake_shipment(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private updatePickingInfo() {
        this.pickingService
            .queryDetail(
                new RequestParams(
                    { picking_id: parseInt(this.id) },
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = parseInt(this.id)
                    this.data = data[0]
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private forceAvailability() {
        this.pickingService
            .force_available(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
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
        "invoices": "invoices",
        "order_detail": "Order Detail",
        "base": "Picking Info",
        "operation": "Operations",
        "initial_demand": "Initial Demand",
        "shipment": "Shipments",
        "return_info": "Customer Problem",
        "logs": "Logs",
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "confirm_order": "Confirm Order",
            "cancel_order": "Cancel Order",
            "create_invovice": "Create Invovice",
            "detail": "Detail",
            "auto_create": "Auto Create",
            "create_dhl": "Create DHL",
            "create_dpd": "Create DPD",
            "create_gls": "Create GLS",
            "sold_out": "Sold Out",
            "validate_address": "Validate Address",
            "modify_address": "Modify Address",
            "batch_send_email": "Batch Send Email",
            "fake_shipment": "Fake Shipment",
            "upload_shipment": "Upload Shipment",
            "upload_fake_shipment": "Upload Fake Shipment",
            "createReturn": "Create Return",
            "done_picking_get_label": "Shipping Label",
            "deliveryMore": "Delivery More",
            "ProductPart": "Product Part",
            "createReturn": "Create Return",
            "cancelPicking": "Cancel",
            "setAsDraft": "Set Draft",
            "setPresale": "Set Presale",
            "cancelPresale": "Cancel Presale",
            "markSoldOut": "Mark SoldOut",
            "cancelSoldOut": "Cancel SoldOut",
            "checkShipmentCount": "Check Shipments",
            "cancelShipmentCount": "Cancel Check Shipments",
            "serviceProcess": "Service Process",
            "returnProcess": "Return Process",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "reserved": "Reserved",
            "force_available": "Force Availability",
            "confirm_operate_refund_order": "Are you sure to cancel order for refund?"
        }
    },
    "zh-cn": {
        "invoices": "发票",
        "order_detail": "订单明细",
        "base": "拣货单详情",
        "operation": "操作",
        "initial_demand": "包裹明细",
        "shipment": "面单",
        "return_info": "客户问题",
        "logs": "操作日志",
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "confirm_order": "确认订单",
            "cancel_order": "取消订单",
            "create_invovice": "创建发票",
            "detail": "详情",
            "auto_create": "创建运单",
            "create_dhl": "创建DHL",
            "create_dpd": "创建DPD",
            "create_gls": "创建GLS",
            "sold_out": "卖超",
            "validate_address": "验证地址",
            "modify_address": "批量验证",
            "batch_send_email": "批量发邮件",
            "fake_shipment": "假单号",
            "upload_shipment": "上传单号",
            "upload_fake_shipment": "上传假单号",
            "createReturn": "创建回程单",
            "done_picking_get_label": "生成运单号",
            "deliveryMore": "创建补发",
            "ProductPart": "补发零部件",
            "createReturn": "创建回程单",
            "cancelPicking": "取消",
            "setAsDraft": "设为草稿",
            "setPresale": "设为预售",
            "cancelPresale": "取消预售",
            "markSoldOut": "卖超",
            "cancelSoldOut": "取消卖超",
            "checkShipmentCount": "Check Shipments",
            "cancelShipmentCount": "Cancel Check Shipments",
            "serviceProcess": "Service Process",
            "returnProcess": "Return Process",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "reserved": "预留",
            "force_available": "强制预留",
            "confirm_operate_refund_order": "确定要取消订单[直接退款]吗?"
        }
    }
}
</i18n>
