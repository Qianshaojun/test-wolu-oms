<template>
    <section class="component order-detail">
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
                <a-button type="primary" @click="multiCreateInvoice">
                    {{ $t('action.create_invovice') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('dhl')"
                        >
                            {{ $t('action.create_dhl') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('dpd')"
                        >
                            {{ $t('action.create_dpd') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('gls')"
                        >
                            {{ $t('action.create_gls') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createShipmentByType('brief')"
                            >{{ $t('action.create_brief') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="createGift()"
                            >{{ $t('action.create_gift') }}
                        </a-menu-item>                            
                        <a-menu-item type="primary" @click="modifyAddress"
                            >{{ $t('action.modify_address') }}
                        </a-menu-item>
                        <a-menu-item type="primary" @click="forceVerifyAddress"
                            >{{ $t('action.force_verify_address') }}
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
                <a-dropdown :trigger="['click']">
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
                        <a-menu-item @click="pickingRefundConfirm"
                            >{{
                                $t(
                                    'action.cancel_stock_picking_for_order_refund'
                                )
                            }}
                        </a-menu-item>
                        <!--                        <a-popconfirm-->
                        <!--                            :title="$t('action.confirm_operate_refund_order')"-->
                        <!--                            :okText="$t('action.ok')"-->
                        <!--                            :cancelText="$t('action.cancel2')"-->
                        <!--                            placement="left"-->
                        <!--                            @confirm="cancel_stock_picking_for_order_refund"-->
                        <!--                        >-->
                        <!--                        </a-popconfirm>-->
                        <!-- <a-menu-item
                            @click="cancel_stock_picking_for_order_refund"
                            >{{
                                $t(
                                    'action.cancel_stock_picking_for_order_refund'
                                )
                            }}
                        </a-menu-item> -->
                        <a-menu-item @click="OnRefund"
                            >{{ $t('action.refund') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px"
                        >{{ $t('action.more_btn') }}
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
                <div>
                    <PickingBaseDetail
                        :info="data"
                        :id="id"
                        :saveDetail="saveDetail"
                        :countryList="countryList"
                        :systemUsers="systemUsers"
                        :pageShow="pageShow"
                        :changeSpinning="changeSpinning"
                        @validateAds="refreshDetailPage"
                    ></PickingBaseDetail>
                </div>
            </a-tab-pane>
            <a-tab-pane :tab="$t('pickingdetail')" key="pickingdetail">
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
                        :changeSpinning="changeSpinning"
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
                        :height="500"
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
                        :height="500"
                        :systemUsers="systemUsers"
                        :companyList="companyList"
                        :changeSpinning="changeSpinning"
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
import { AccountService } from '../../services/account.service'
import RefundForm from '~/components/common/refund-form.vue'
import { OrderService } from '../../services/order.service'
import { TaxesService } from '../../services/taxes.service'
import OrderBaseDetail from '../orders/order-base-detail.vue'
import { GeneralCodeService } from '@/services/general_code.service'
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
        RefundForm,
        OrderBaseDetail,
        OrderInvoiceDetail
    }
})
export default class PickingDetailMulti extends Vue {
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

    @Prop()
    changeSpinning

    @Prop()
    getPickingInfo

    private activeKey: any = 'base'

    private data: any = {}

    private orderID: any = ''

    private saveDetail: any = 0

    private order_info: any[] = []
    private saveShipment: any = 0
    private invoice: any[] = []

    @datasModule.State
    private shipTypeList

    @datasModule.Action
    private getShipType

    @datasModule.State
    private mvShipTypeList

    @datasModule.Action
    private getMvShipType

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

    private reset() {
        this.operations = []
        this.demands = []
        this.shipments = []
        this.returns = []
        this.logs = []
        this.order_info = []
        this.invoice = []
        if (this.activeKey == 'base') {
            this.updatePickingInfo()
        } else if (this.activeKey == 'pickingdetail') {
            this.getOperations()
            this.getDemands()
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

    private orderService = new OrderService()

    private getOrderDetail() {
        this.orderService
            .getDetail(
                new RequestParams(
                    {
                        order_id: this.orderID
                    },
                    this.loading
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
                    this.closeLoading()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private created() {
        this.getShipType()
        this.getMvShipType()
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
        if (e == 'pickingdetail') {
            this.getOperations()
            this.getDemands()
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

    private getOperations() {
        this.pickingService
            .queryStockOperation(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
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
                        picking_id: parseInt(this.id)
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
                        picking_id: parseInt(this.id)
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

    private getReturns() {
        this.pickingService
            .queryReturnInfo(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.returns = data.map((x, i) => ({
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

    private getLogs() {
        this.pickingService
            .queryPickingLog(
                new RequestParams(
                    {
                        picking_id: parseInt(this.id)
                    },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    this.logs = data.map((x, i) => ({
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
            .save(new RequestParams(this.data, this.loading))
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
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
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    // this.reset()
                    this.reset()
                },
                err => {
                    this.closeLoading()
                    this.$message.error(err.message)
                }
            )
    }

    private reserve() {
        this.pickingService
            .reserve(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
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
        this.saveDetail++
        let _that = this
        // setTimeout(function() {
        //     _that.reset()
        // }, 3000)
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
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private createReturn() {
        this.$modal
            .open(
                CreateReturn,
                {
                    picking_id: parseInt(this.id),
                    changeSpinning: this.changeSpinning
                },
                {
                    title: this.$t('Create Return Shipment'),
                    width: '80%'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('success')
                this.$message.success(msg)
                this.reset()
            })
    }

    private donePickingGetLabel() {
        this.saveShipment++

        let _that = this
        setTimeout(function() {
            _that.shipmentService
                .donePickingGetLabel(
                    new RequestParams(
                        { picking_id_list: [_that.id] },
                        _that.loading
                    )
                )
                .subscribe(
                    data => {
                        let msg: any = _that.$t('success')
                        _that.$message.success(msg)
                        _that.reset()
                    },
                    err => {
                        _that.$message.error(err.message)
                        _that.closeLoading()
                    }
                )
        }, 1500)
    }

    private setAsDraft() {
        this.pickingService
            .setAsDraft(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private setPresale() {
        this.pickingService
            .setPresale(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private cancelPresale() {
        this.pickingService
            .cancelPresale(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private markSoldOut() {
        this.pickingService
            .markSoldOut(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private cancelSoldOut() {
        this.pickingService
            .cancelSoldOut(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private checkShipments() {
        this.pickingService
            .checkShipments(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private cancelCheckShipments() {
        this.pickingService
            .cancelCheckShipments(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private serviceProcess() {
        this.pickingService
            .serviceProcess(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private returnProcess() {
        let _this = this
        this.$confirm({
            title: this.$t('action.confirm_operate_return_order'),
            onOk() {
                _this.returnProcessService()
            },
            onCancel() {}
        })
    }

    private returnProcessService() {
        this.pickingService
            .returnProcess(
                new RequestParams({ picking_id_list: [this.id] }, this.loading)
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('success')
                    this.$message.success(msg)
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private deliveryMore() {
        this.$modal
            .open(
                DeliveryMore,
                {
                    picking_id: parseInt(this.id),
                    changeSpinning: this.changeSpinning
                },
                {
                    title: this.$t('action.deliveryMore'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                if (this.getPickingInfo) {
                    this.getPickingInfo(data.new_picking_id)
                } else {
                    this.$router.push({
                        name: 'picking-detail',
                        path: `/picking/picking-detail/${data.new_picking_id}`,
                        params: {
                            id: data.new_picking_id,
                            name: data.new_picking_name
                        }
                    })
                }
            })
    }

    private productPart() {
        this.$modal
            .open(
                ProductPart,
                {
                    picking_id: parseInt(this.id),
                    changeSpinning: this.changeSpinning
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
        let _this = this
        this.$confirm({
            title: this.$t('action.confirm_operate_wrong_order'),
            onOk() {
                _this.customer_service_stop_plz_service()
            },
            onCancel() {}
        })
    }

    private customer_service_stop_plz_service() {
        this.pickingService
            .customer_service_stop_plz(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private pickingRefundConfirm() {
        let _this = this
        this.$confirm({
            title: this.$t('action.confirm_operate_refund_order'),
            onOk() {
                _this.cancel_stock_picking_for_order_refund()
            },
            onCancel() {}
        })
    }

    private cancel_stock_picking_for_order_refund() {
        this.pickingService
            .cancel_stock_picking_for_order_refund(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private fake_shipments() {
        this.pickingService
            .fake_shipments(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private upload_shipment() {
        this.pickingService
            .upload_shipment(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private upload_fake_shipment() {
        this.pickingService
            .upload_fake_shipment(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private updatePickingInfo() {
        this.pickingService
            .queryDetail(
                new RequestParams(
                    { picking_id: parseInt(this.id) },
                    this.loading
                )
            )
            .subscribe(
                data => {
                    data[0]['id'] = parseInt(this.id)
                    this.data = data[0]
                    this.closeLoading()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }

    private forceVerifyAddress() {
        this.pickingService
            .forceVerifyAddress(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private refreshDetailPage() {
        this.reset()
    }

    private accountService = new AccountService()

    private multiCreateInvoice() {
        this.accountService
            .createInvoice(
                new RequestParams(
                    { order_id_list: [this.data.order_id] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private OnRefund() {
        this.$modal
            .open(
                RefundForm,
                {
                    countryList: this.countryList,
                    order_id: this.data.order_id,
                    changeSpinning: this.changeSpinning
                },
                {
                    title: this.$t('action.refund'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.reset()
            })
    }

    private createShipmentByType(type) {
        this.pickingService
            .create_shipment_lines_by_ship_type(
                new RequestParams(
                    {
                        picking_id_list: [parseInt(this.id)],
                        ship_type: type
                    },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }

    private createGift() {
        this.pickingService
            .create_dhl_dpd_gift(
                new RequestParams(
                    {
                        picking_ids: [parseInt(this.id)],
                    },
                    this.loading
                    )
            )
            .subscribe(
                data => {
                    this.$message.success('创建成功!')
                    this.reset()
                },
                err => {
                    this.$message.error(err.message)
                    this.closeLoading()
                }
            )
    }        

    private forceAvailability() {
        this.pickingService
            .force_available(
                new RequestParams(
                    { picking_id_list: [parseInt(this.id)] },
                    this.loading
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
                    this.closeLoading()
                }
            )
    }
}
</script>

<i18n>
{
    "en-us": {
        "invoices": "Invoices",
        "order_detail": "Order Detail",
        "base": "Picking Info",
        "operation": "Operations",
        "initial_demand": "Initial Demand",
        "shipment": "Shipments",
        "return_info": "Customer Problem",
        "logs": "Logs",
        "pickingdetail": "Picking Detail",
        "title-1": "Details of the products to be shipped",
        "title-2": "Details of the reserved position of the shipped product in the warehouse",
        "title-3": "Logistics package details required to ship products",
        "action": {
            "create": "Create",
            "batch-create": "EXCEL Import",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Discard",
            "cancel2": "Cancel",
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
            "force_verify_address": "Force Verify Address",
            "refund": "Refund/Supplement",
            "create_brief": "Create Brief",
            "reserved": "Reserved",
            "more_btn": "More Buttons",
            "force_available": "Force Availability",
            "confirm_operate_refund_order": "Are you sure to cancel order for refund?",
            "confirm_operate_return_order": "Are you sure to cancel order for return?",
            "confirm_operate_wrong_order": "Are you sure to cancel order for wrong address?"
        }
    },
    "zh-cn": {
        "invoices": "发票",
        "order_detail": "订单详情",
        "base": "拣货单详情",
        "operation": "操作",
        "initial_demand": "包裹明细",
        "shipment": "面单",
        "return_info": "客户问题",
        "logs": "操作日志",
        "pickingdetail": "发货明细",
        "title-1": "所需发货产品明细",
        "title-2": "发货产品在仓库预留位置明细",
        "title-3": "发货产品打包物流包裹明细",
        "action": {
            "create": "新建",
            "batch-create": "EXCEL导入",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "丢弃",
            "cancel2": "取消",
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
            "force_verify_address": "强制验证地址",
            "refund": "退/补款",
            "create_brief": "创建Brief",
            "reserved": "预留",
            "more_btn": "更多按钮",
            "force_available": "强制预留",
            "confirm_operate_refund_order": "确定要取消订单[直接退款]吗?",
            "confirm_operate_return_order": "确定要取消订单[退回]吗?",
            "confirm_operate_wrong_order": "确定要取消订单[错误地址]吗?"
        }
    }
}
</i18n>
