<template>
    <div ref="container" style="padding:0 5px 0 5px">
        <a-tabs
            type="editable-card"
            hide-add
            @change="searchDetail"
            v-model="activeKey"
            @edit="onEdit"
        >
            <a-tab-pane
                key="1"
                :tab="$t('Message Content')"
                :closable="false"
                :style="{ height: messageHeight }"
            >
                <div
                    class="chat-integration-container"
                    :class="{ moving: moving }"
                    :style="{ 'grid-template-rows': gridTemplateRows }"
                >
                    <div class="chat-message-wrap wrap">
                        <chat-user-message></chat-user-message>
                    </div>
                    <div class="user-input-wrap ">
                        <div class="split" ref="split"></div>
                        <div class="full-height wrap">
                            <chat-user-input></chat-user-input>
                        </div>
                    </div>
                </div>
            </a-tab-pane>

            <a-tab-pane key="2" :tab="$t('Pickings')" :closable="false">
                <div class="test overHeight">
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        @click="showDetailPage"
                        >{{ $t('action.showDetailPage') }}
                    </a-button>
                    <a-button
                        type="primary"
                        @click="reserve"
                        style="margin-left: 8px;"
                        :disabled="!selectedRowKeys.length"
                    >
                        {{ $t('action.reserved') }}
                    </a-button>
                    <a-button
                        type="primary"
                        style="margin-left: 8px;"
                        :disabled="!selectedRowKeys.length"
                        @click="validateAddress"
                        >{{ $t('action.validate_address') }}
                    </a-button>
                    <a-button
                        type="primary"
                        style="margin-left: 8px;"
                        @click="createShipment"
                        :disabled="!selectedRowKeys.length"
                    >
                        {{ $t('action.auto_create') }}
                    </a-button>
                    <a-button
                        type="primary"
                        style="margin-left: 8px;display:none"
                        @click="donePickingGetLabel"
                        :disabled="!selectedRowKeys.length"
                        >{{ $t('action.done_picking_get_label') }}
                    </a-button>
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        style="margin-left: 8px;"
                        >{{ $t('action.fake_shipment') }}
                    </a-button>
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        style="margin-left: 8px;"
                        >{{ $t('action.upload_shipment') }}
                    </a-button>
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        style="margin-left: 8px;"
                        >{{ $t('action.upload_fake_shipment') }}
                    </a-button>
                    <a-button
                        type="primary"
                        style="margin-left: 8px;"
                        :disabled="!selectedRowKeys.length"
                        @click="createReturn"
                        >{{ $t('action.createReturn') }}
                    </a-button>
                    <a-button
                        type="primary"
                        style="margin-left: 8px;"
                        :disabled="!selectedRowKeys.length"
                        @click="deliveryMore"
                        >{{ $t('action.deliveryMore') }}
                    </a-button>
                    <a-button
                        style="margin-left: 8px;"
                        v-show="
                            pickingDatas.length > 0 &&
                                selectedRowKeys.length &&
                                pickingDatas.find(
                                    x => x['id'] == selectedRowKeys[0]
                                ) &&
                                pickingDatas.find(
                                    x => x['id'] == selectedRowKeys[0]
                                )['is_resend']
                        "
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        @click="productPart"
                        >{{ $t('action.ProductPart') }}
                    </a-button>
                    <a-button
                        type="primary"
                        :disabled="!selectedRowKeys.length"
                        @click="multiCreateInvoice"
                    >
                        {{ $t('action.create_invovice') }}
                    </a-button>
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item
                                type="primary"
                                @click="createShipmentByType('dhl')"
                                :disabled="!selectedRowKeys.length"
                            >
                                {{ $t('action.create_dhl') }}
                            </a-menu-item>
                            <a-menu-item
                                type="primary"
                                @click="createShipmentByType('dpd')"
                                :disabled="!selectedRowKeys.length"
                            >
                                {{ $t('action.create_dpd') }}
                            </a-menu-item>
                            <a-menu-item
                                type="primary"
                                @click="createShipmentByType('gls')"
                                :disabled="!selectedRowKeys.length"
                            >
                                {{ $t('action.create_gls') }}
                            </a-menu-item>
                            <a-menu-item
                                type="primary"
                                @click="createShipmentByType('brief')"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.create_brief') }}
                            </a-menu-item>
                            <a-menu-item
                                type="primary"
                                @click="createGift()"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.create_gift') }}
                            </a-menu-item>                                
                            <a-menu-item
                                type="primary"
                                @click="assignToUser"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.assign_to_user') }}
                            </a-menu-item>
                            <a-menu-item
                                :disabled="selectedRowKeys.length != 1"
                                @click="viewAmazonInvoicePDF"
                                >{{ $t('action.viewAmazonInvoicePDF') }}
                            </a-menu-item>
                        </a-menu>
                        <a-button style="margin-left: 8px"
                            >Action
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>
                    <a-dropdown>
                        <a-menu slot="overlay">
                            <a-menu-item
                                @click="deletePicking"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.deletePicking') }}
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
                            <a-menu-item
                                @click="forceAvailability"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.force_available') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="OnRefund"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.refund') }}
                            </a-menu-item>
                            <a-menu-item
                                @click="customer_service_stop_plz"
                                :disabled="!selectedRowKeys.length"
                                >{{ $t('action.customer_service_stop_plz') }}
                            </a-menu-item>
                            <a-menu-item
                                :disabled="!selectedRowKeys.length"
                                @click="pickingRefundConfirm"
                                >{{
                                    $t(
                                        'action.cancel_stock_picking_for_order_refund'
                                    )
                                }}
                            </a-menu-item>
                            <!--                            <a-popconfirm-->
                            <!--                                :title="-->
                            <!--                                    $t('action.confirm_operate_refund_order')-->
                            <!--                                "-->
                            <!--                                :okText="$t('action.ok')"-->
                            <!--                                :cancelText="$t('action.cancel')"-->
                            <!--                                placement="left"-->
                            <!--                                @confirm="cancel_stock_picking_for_order_refund"-->
                            <!--                                :disabled="!selectedRowKeys.length"-->
                            <!--                            >-->
                            <!--                              -->
                            <!--                            </a-popconfirm>-->
                        </a-menu>
                        <a-button style="margin-left: 8px"
                            >{{ $t('more_actions') }}
                            <a-icon type="down" />
                        </a-button>
                    </a-dropdown>

                    <a-card class="margin-y" style="margin-top:10px">
                        <data-table
                            :stripe="true"
                            :data="pickingDatas"
                            :page="pageService"
                            rowKey="id"
                            :rowSelection="{
                                selectedRowKeys: selectedRowKeys,
                                onChange: keys => onTbSelectChange(keys)
                            }"
                            @on-page-change="getOrderList"
                            @onClick="
                                record => {
                                    this.selectedRowKeys = [record]
                                    onTrClick(record)
                                    onTbSelectChange([record])
                                }
                            "
                            style="table-layout:fixed;"
                            :scroll="{ y: 560, x: 1712 }"
                            @change="sorter => onTableChange(sorter)"
                        >
                            <a-table-column
                                :title="$t('columns.reference')"
                                key="name"
                                align="center"
                                width="100"
                                :sorter="true"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">{{
                                        row.name
                                    }}</span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.product_name')"
                                key="product_name"
                                width="100"
                                align="left"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.product_name }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.order_memo')"
                                key="memo"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <a
                                        :title="row.memo"
                                        :class="calcStyle(row)"
                                        @click="onEditMemo(row)"
                                    >
                                        <a-tooltip>
                                            <template slot-scope="row">
                                                {{ row.memo }}
                                            </template>
                                            {{
                                                row.memo
                                                    ? row.memo.substr(0, 10) +
                                                      '...'
                                                    : $t('no')
                                            }}
                                        </a-tooltip>
                                    </a>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.instance')"
                                key="instance_code"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{
                                            sellerInstanceDict[
                                                row.instance_code
                                            ]
                                        }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.partner')"
                                key="partner_name"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.partner_name }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.scheduled_date')"
                                key="min_date"
                                align="center"
                                :sorter="true"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">{{
                                        row.min_date | datetolocal
                                    }}</span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.order_id')"
                                key="origin"
                                align="center"
                                :sorter="true"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="isBold(row)">{{
                                        row.origin
                                    }}</span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.state')"
                                key="state"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">{{
                                        row.state
                                            | dict('PickingStatus')
                                            | translate
                                    }}</span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.payment_date')"
                                key="payment_date"
                                align="center"
                                width="100"
                                :sorter="true"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.payment_date | datetolocal }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.latest_ship_date')"
                                key="latest_ship_date_new"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{
                                            row.latest_ship_date_new
                                                | datetolocal
                                        }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.validate_state')"
                                key="validate_s"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle2(row)">
                                        {{
                                            row.validate_s
                                                | dict('PickingValidateState')
                                                | translate
                                        }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.shipment_count')"
                                key="shipment_count"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.shipment_count }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.shipment_product')"
                                key="shipment_product"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="row">
                                    <a-tooltip>
                                        <template slot-scope="row">
                                            {{ row.shipment_product }}
                                        </template>
                                        <a
                                            :class="calcStyle(row)"
                                            :title="row.shipment_product"
                                            @click="openShipmentProduct(row)"
                                        >
                                            {{
                                                row.shipment_product
                                                    ? row.shipment_product.substr(
                                                          0,
                                                          10
                                                      ) + '...'
                                                    : ''
                                            }}
                                        </a>
                                    </a-tooltip>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.shipment_time')"
                                key="shipment_time_str"
                                width="100"
                                align="center"
                                :sorter="true"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{
                                            row.shipment_time_str | datetolocal
                                        }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.ebay_type')"
                                key="stock_ebay3"
                                align="center"
                                width="100"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.stock_ebay3 }}
                                    </span>
                                </template>
                            </a-table-column>
                            <a-table-column
                                :title="$t('columns.amazon_type')"
                                key="stock_amazon3"
                                width="100"
                                align="center"
                            >
                                <template slot-scope="row">
                                    <span :class="calcStyle(row)">
                                        {{ row.stock_amazon3 }}
                                    </span>
                                </template>
                            </a-table-column>
                            <!-- <a-table-column
                                    :title="$t('columns.operate')"
                                    key="action"
                                    align="center"
                                >
                                    <template slot-scope="row">
                                        <a-dropdown>
                                            <a-menu slot="overlay">
                                                <a-popconfirm
                                                    :title="$t('delete')"
                                                    :okText="$t('action.ok')"
                                                    :cancelText="
                                                        $t('action.cancel')
                                                    "
                                                    placement="left"
                                                    @confirm="onDelete(row)"
                                                >
                                                    <a-menu-item
                                                        style="cursor:pointer;margin-left:12px;"
                                                        class="btnDel"
                                                        >{{
                                                            $t('action.delete')
                                                        }}</a-menu-item
                                                    >
                                                </a-popconfirm>
                                            </a-menu>
                                            <a-button>
                                                {{ $t('action.more') }}
                                                <a-icon type="down" />
                                            </a-button>
                                        </a-dropdown>
                                    </template>
                                </a-table-column> -->
                        </data-table>
                    </a-card>

                    <a-card>
                        <OrderDetail
                            :detail="orderDetail"
                            :height="500"
                            :systemUsers="systemUsers"
                            :companyList="companyList"
                            :changeSpinning="changeSpinning"
                            :picking_id="currentPickingId"
                        ></OrderDetail>
                    </a-card>
                </div>
            </a-tab-pane>

            <a-tab-pane
                :key="item.name"
                :tab="item.name"
                :closable="true"
                v-for="item of pickingList"
            >
                <div class="overHeight">
                    <PickingDetailMulti
                        v-for="p_item of pickingList"
                        :key="p_item.name"
                        v-show="p_item.name == item.name"
                        :detail="pickingList.find(x => x.name == p_item.name)"
                        :id="p_item.id"
                        :countryList="countryList"
                        :systemUsers="systemUsers"
                        :changeSpinning="changeSpinning"
                        :getPickingInfo="getPickingInfo"
                    />
                </div>
            </a-tab-pane>

            <a-tab-pane
                key="3"
                :tab="$t('Invoice')"
                :closable="true"
                :style="{ height: invoiceHeight }"
                v-if="invoiceId !== 0"
            >
                <div class="overHeight">
                    <a-card>
                        <InvoiceEdit
                            :invoiceData="invoiceData"
                            :changeSpinning="changeSpinning"
                        />
                    </a-card>
                </div>
            </a-tab-pane>
        </a-tabs>
        <!-- </a-spin> -->
    </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Ref, Watch } from 'vue-property-decorator'

import ChatUserInput from '~/components/cs_email_return/chat-user-input.vue'
import ChatUserMessage from '~/components/cs_email_return/chat-user-message.vue'
import { PickingService } from '~/services/picking.service'
import router from '../../router'
import BatchSendEmail from '@/components/picking/batch-send-email.vue'
import { ShipmentService } from '~/services/shipment.service'

import { namespace } from 'vuex-class'

const chatModule = namespace('chatModule')
import { RequestParams } from '~/core/http'
import { EmailService } from '~/services/cs-email.service'
import { PageService } from '~/bootstrap/services/page.service'

const datasModule = namespace('datasModule')
import CreateReturn from '~/components/picking/create-return.vue'
import PickingDetailMulti from '~/components/picking/picking-detail-multi.vue'
import OrderDetail from '~/components/orders/order-detail.vue'
import ShipmentProduct from '~/components/cs_email_return/chat-shipment-product.vue'
import { TaxesService } from '../../services/taxes.service'
import DeliveryMore from '@/components/picking/delivery-more.vue'
import ProductPart from '@/components/picking/product-part.vue'
import { SellerInstanceService } from '~/services/seller-instance.service'
import AssignUser from '@/components/picking/assign_user.vue'
import RefundForm from '~/components/common/refund-form.vue'
import { AccountService } from '../../services/account.service'
import InvoiceEdit from '~/components/account/invoice-edit.vue'
import appConfig from '@/config/app.config'
import PickingModifyMemo from '../picking/picking-modify-memo.vue'
import { LoadingService } from '../../bootstrap/services/loading.service'

@Component({
    components: {
        ChatUserInput,
        ChatUserMessage,
        BatchSendEmail,
        CreateReturn,
        PickingDetailMulti,
        OrderDetail,
        ShipmentProduct,
        DeliveryMore,
        ProductPart,
        AssignUser,
        RefundForm,
        InvoiceEdit
    }
})
export default class ChatIntegration extends Vue {
    @Ref('split')
    private split!: HTMLDivElement

    @Ref('container')
    private container!: HTMLDivElement

    private moving = false

    // 表格选择项
    private selectedRowKeys: any[] = []

    private sellerInstanceDict: any = {}

    @chatModule.State
    private pickingList

    @chatModule.Mutation('changePickingList')
    private changePickingList

    @chatModule.Mutation('replacePickingList')
    private replacePickingList

    @chatModule.State
    private inputHeight

    @chatModule.State
    private spinning

    @chatModule.Mutation('changeSpinning')
    private changeSpinning

    @chatModule.Mutation('changeInputHieght')
    private changeInputHieght

    @datasModule.State
    private countryList

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private companyList

    @chatModule.State
    private clientWidth

    @chatModule.State
    private clientHeight

    @chatModule.State
    private currentUser

    @datasModule.Action
    private getMvShipType

    private currentId: any = ''

    private created() {
        this.getMvShipType()
    }

    @Watch('currentUser')
    onSwitchUser() {
        this.orderDetail = {}
    }

    private orderBy: any = ''

    private currentPickingId: any = 0

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getOrderList()
    }

    private get messageHeight() {
        return this.activeKey == '1'
            ? `${this.clientHeight - 60 - 55}px`
            : '0px'
    }

    private get pickingsHeight() {
        return this.activeKey == '2'
            ? `${this.clientHeight - 60 - 55}px`
            : '0px'
    }

    private get invoiceHeight() {
        return this.activeKey == '3'
            ? `${this.clientHeight - 60 - 55}px`
            : '0px'
    }

    private get divWidth() {
        let widthValue = this.clientWidth * 0.75
        return `${widthValue}px`
    }

    private get divHeight() {
        let height = this.clientHeight - 116
        return `${height}px`
    }

    private get gridTemplateRows() {
        return `${this.clientHeight - 176 - this.inputHeight}px ${
            this.inputHeight
        }px`
    }

    @chatModule.State
    private invoiceId

    @chatModule.Mutation('changeInvoiceId')
    private changeInvoiceId

    @Watch('invoiceId')
    OnInvoiceIdChange() {
        if (this.invoiceId != 0) {
            this.queryInvoceData()
            this.searchDetail('3')
        }
    }

    private invoiceData: any = []
    private accountService = new AccountService()

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

    private isBold(row) {
        if (
            this.userList.find(x => x.id === this.currentUser)
                .last_order_num === row.origin
        ) {
            return this.calcStyle(row, true)
        } else {
            return this.calcStyle(row)
        }
    }

    private queryInvoceData() {
        this.accountService
            .queryInvoiceDetailForEdit(
                new RequestParams({ invoice_id: this.invoiceId })
            )
            .subscribe(
                data => {
                    this.invoiceData = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    public mounted() {
        this.setupDrag()
        this.getSellerInstanceList()
        this.getSystemuser()
    }

    private setupDrag() {
        var that = this
        // this.split.onmousedown = () => (this.moving = true)
        this.container.onmouseup = () => (this.moving = false)
        this.container.onmouseleave = () => (this.moving = false)
        this.container.onmousemove = ({ movementY }) => {
            if (!this.moving) return
            if (movementY > 0 && that.inputHeight <= 200) return
            this.changeInputHieght(that.inputHeight - movementY)
            // this.inputHeight -= movementY
        }
    }

    @chatModule.State
    private userList

    private user = ''

    @chatModule.State
    private activeKey

    private detail_data: any[] = []

    // 邮件服务
    private emailService = new EmailService()
    private pickingService = new PickingService()
    // Loading服务
    private shipmentService = new ShipmentService()
    private taxesService = new TaxesService()
    private loadingService = new LoadingService()

    @chatModule.Mutation('changeActiveKey')
    private changeactiveKey

    private pickingDatas: any = []
    private detailInfo: any = {}
    private data: any[] = []
    private orderDetail: any = {}
    private sellerInstanceService = new SellerInstanceService()

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryInstanceList(new RequestParams())
            .subscribe(data => {
                for (let i of data) {
                    this.sellerInstanceDict[i.code] = i.name
                }
            })
    }

    private onDetail(row) {
        if (row.seller_code) {
            this.taxesService
                .queryAll(
                    new RequestParams({
                        seller_code: row.seller_code
                    })
                )
                .subscribe(data => {
                    this.orderDetail = {
                        id: row.order_id,
                        name: row.origin,
                        taxList: data
                    }
                })

            // this.$nextTick(() => this.pageContainer.scrollToBottom())
        } else {
            this.orderDetail = {
                id: row.order_id,
                name: row.origin,
                taxList: []
            }
        }
    }

    private onClose() {
        this.orderDetail = null
    }

    private onTrClick(record) {
        let info = this.pickingDatas.find(x => x.id === record)
        if (info) {
            this.onDetail(info)
        }
    }

    private onEditMemo(record) {
        this.$modal
            .open(
                PickingModifyMemo,
                {
                    memo: record.memo,
                    id: record.id,
                    systemUsers: this.systemUsers,
                    orderID: record.order_id
                },
                {
                    title: this.$t('action.modify_memo'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.modifyMemo(record.order_id, data)
            })
    }

    private openShipmentProduct(record) {
        this.$modal
            .open(
                ShipmentProduct,
                { shipment_product: record.shipment_product },
                {
                    title: this.$t('action.shipment_product'),
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

    private modifyMemo(order_id, memo) {
        this.changeSpinning(true)
        this.emailService
            .modifyMemo(
                new RequestParams({
                    order_id: order_id,
                    memo: memo
                })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.$message.error(err.message)
                    this.changeSpinning(false)
                }
            )
    }

    private getPickingInfo(picking_id: any = false) {
        this.changeSpinning(true)
        let that = this
        let picking_ids: any = []
        if (!picking_id) {
            this.selectedRowKeys.forEach(value => {
                if (!that.pickingList.find(x => x.id === value)) {
                    picking_ids.push(parseInt(value))
                }
            })
        } else {
            picking_ids.push(picking_id)
        }
        if (picking_ids.length != 0) {
            this.pickingService
                .queryDetailList(
                    new RequestParams({
                        picking_ids: picking_ids
                    })
                )
                .subscribe(
                    data => {
                        data.forEach(value => {
                            that.detailInfo = value
                            that.changePickingList(that.detailInfo)
                        })
                        // that.changeactiveKey(that.selectedRowKeys[0])
                        this.changeSpinning(false)
                        this.changeactiveKey(data[data.length - 1].name)
                    },
                    err => {
                        this.changeSpinning(false)
                        this.$message.error(err.message)
                    }
                )
        } else {
            this.changeactiveKey(
                this.pickingList[this.pickingList.length - 1].name
            )
            this.changeSpinning(false)
        }
    }

    private getOrderList() {
        let that = this
        this.emailService
            .queryPickingList(
                new RequestParams(
                    {
                        customer_id: this.currentUser,
                        order_by: this.orderBy
                    },
                    {
                        page: this.pageService
                    }
                )
            )
            .subscribe(data => {
                that.pickingDatas = data
            })
    }

    private pageService = new PageService()

    private searchDetail(key) {
        let that = this

        if (key == '2') {
            this.orderDetail = {}
            this.selectedRowKeys = []
            this.currentId = false
            this.changeactiveKey(key)
            that.changeSpinning(true)
            this.emailService
                .queryPickingList(
                    new RequestParams(
                        { customer_id: this.currentUser },
                        {
                            page: this.pageService
                        }
                    )
                )
                .subscribe(
                    data => {
                        that.pickingDatas = data
                        if (that.pickingDatas.length > 0) {
                            that.selectedRowKeys.push(this.pickingDatas[0].id)
                            that.onTrClick(this.pickingDatas[0].id)
                            that.onTbSelectChange([this.pickingDatas[0].id])
                        }
                        that.changeSpinning(false)
                    },
                    err => {
                        that.changeSpinning(false)
                        that.$message.error(err.message)
                    }
                )
        } else if (key == '1') {
            this.changeactiveKey(key)
            this.currentId = false
        } else if (key == '3') {
            this.changeactiveKey(key)
            this.currentId = false
        } else {
            this.changeactiveKey(key)
            let record = this.pickingList.find(x => x.name == key)
            this.currentId = record.id
        }
    }

    private onEdit(targetKey, action) {
        this[action](targetKey)
    }

    private remove(targetKey) {
        let activeKey = this.activeKey
        if (targetKey == '3') {
            activeKey = '2'
            this.changeInvoiceId(0)
        } else {
            let lastIndex: any
            this.pickingList.forEach((pane, i) => {
                if (pane.name === targetKey) {
                    lastIndex = i - 1
                }
            })
            const panes = this.pickingList.filter(
                pane => pane.name !== targetKey
            )
            if (panes.length && activeKey === targetKey) {
                if (lastIndex >= 0) {
                    activeKey = panes[lastIndex].name
                } else {
                    activeKey = panes[0].name
                }
            } else if (panes.length == 0) {
                activeKey = '2'
            }
            this.replacePickingList(panes)
        }

        this.changeactiveKey(activeKey)
        this.getOrderList()
    }

    private onDelete(row) {}

    private calcStyle(row, f = false) {
        if (row.pick_pre_sale) {
            if (f) {
                return 'blue-text font-blod'
            } else {
                return 'blue-text'
            }
        } else if (row.state == 'cancel') {
            if (f) {
                return 'gray-text font-blod'
            } else {
                return 'gray-text'
            }
        } else {
            var today_end = this.get_endtime()
            var time_old =
                row.payment_date.substr(0, 10).replace(/-/g, '') + '235959'
            if (today_end == time_old) {
                if (f) {
                    return 'red-text font-blod'
                } else {
                    return 'red-text'
                }
            } else {
                if (f) {
                    return 'default-text font-blod'
                } else {
                    return 'default-text'
                }
            }
        }
    }

    private calcStyle2(row) {
        if (row.validate_s === 'ok') {
            return 'green-text'
        } else if (row.validate_s === 'error') {
            return 'red-text'
        } else {
            return 'blue-text'
        }
    }

    private get_endtime() {
        var time_end = new Date(
            new Date(new Date().toLocaleDateString()).getTime() +
                24 * 60 * 60 * 1000 -
                1
        )
        var time_format = this.format_date(time_end)
        return time_format
    }

    private format_date(now) {
        var year = now.getFullYear() //年
        var month = now.getMonth() + 1 //月
        var day = now.getDate() //日
        var hh = now.getHours() //时
        var mm = now.getMinutes() //分
        var ss = now.getSeconds() //秒

        var clock = year + ''
        if (month < 10) {
            clock += '0'
        }
        clock += month + ''

        if (day < 10) {
            clock += '0'
        }
        clock += day + ''

        if (hh < 10) {
            clock += '0'
        }
        clock += hh + ''

        if (mm < 10) {
            clock += '0'
        }
        clock += mm

        if (ss < 10) {
            clock += '0'
        }
        clock += ss

        return clock
    }

    private assignToUser() {
        this.$modal
            .open(
                AssignUser,
                {
                    picking_id_list: this.selectedRowKeys,
                    systemUsers: this.systemUsers,
                    changeSpinning: this.changeSpinning
                },
                {
                    title: 'Assign To User',
                    width: '60%'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.getOrderList()
                this.changeSpinning(false)
                this.$message.success(msg)
            })
    }

    private validateAddress() {
        this.changeSpinning(true)
        this.pickingService
            .validateAddress(
                new RequestParams({
                    picking_id_list: this.selectedRowKeys
                })
            )
            .subscribe(
                data => {
                    this.getOrderList()
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private showDetailPage() {
        this.getPickingInfo()
    }

    private batchSendEmail() {
        this.$modal
            .open(
                BatchSendEmail,
                { changeSpinning: this.changeSpinning },
                {
                    title: this.$t('action.batch_send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)
                this.getOrderList()
                this.changeSpinning(false)
            })
    }

    private cancelPicking() {
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys
        this.changeSpinning(true)
        this.pickingService
            .cancelPicking(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private setAsDraft() {
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys
        this.changeSpinning(true)
        this.pickingService
            .setAsDraft(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private forceAvailability() {
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        for (let i of this.selectedRowKeys) {
            let row = this.pickingDatas.find(x => x.id == i)
            if (!row || row.state !== 'confirmed') {
                this.$message.error('所选的picking的状态必须为等待可用')
                return
            }
        }
        this.changeSpinning(true)
        this.pickingService
            .force_available(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private setPresale() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .setPresale(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private deliveryMore() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        this.$modal
            .open(
                DeliveryMore,
                {
                    picking_id: this.selectedRowKeys[0],
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
                this.getOrderList()
                this.selectedRowKeys[0]
                this.getPickingInfo(data.new_picking_id)
                this.changeSpinning(false)
            })
    }

    private cancelPresale() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .cancelPresale(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private createReturn() {
        let param = this.currentId ? this.currentId : this.selectedRowKeys[0]

        this.$modal
            .open(
                CreateReturn,
                {
                    picking_id: param,
                    changeSpinning: this.changeSpinning
                },
                {
                    title: 'Create Return Shipment',
                    width: '80%'
                }
            )
            .subscribe(data => {
                this.getOrderList()
                this.changeSpinning(false)
            })
    }

    private createShipment() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .createShipmentsLines(new RequestParams({ picking_id_list: param }))
            .subscribe(
                () => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private createShipmentByType(type) {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys
        this.pickingService
            .create_shipment_lines_by_ship_type(
                new RequestParams({
                    picking_id_list: param,
                    ship_type: type
                })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private createGift() {
        this.changeSpinning(true)
        this.pickingService
            .create_dhl_dpd_gift(
                new RequestParams(
                    {
                        picking_ids: this.selectedRowKeys,
                    })
            )
            .subscribe(
                data => {
                    this.$message.success('创建成功!')
                    this.changeSpinning(false)                    
                },
                err => {
                    this.$message.error(err.message)
                    this.changeSpinning(false)                    
                }
            )
    }    

    private reserve() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .reserve(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private markSoldOut() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .markSoldOut(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private cancelSoldOut() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .cancelSoldOut(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private checkShipments() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .checkShipments(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private cancelCheckShipments() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .cancelCheckShipments(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private OnRefund() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        let row = this.pickingDatas.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            this.$modal
                .open(
                    RefundForm,
                    {
                        countryList: this.countryList,
                        order_id: row.order_id,
                        changeSpinning: this.changeSpinning
                    },
                    {
                        title: this.$t('action.refund'),
                        width: '1000px'
                    }
                )
                .subscribe(data => {
                    this.getOrderList()
                    this.changeSpinning(false)
                })
        }
    }

    private serviceProcess() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .serviceProcess(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private returnProcess() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.pickingService
            .returnProcess(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private productPart() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        this.$modal
            .open(
                ProductPart,
                {
                    picking_id: this.selectedRowKeys[0],
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
                this.getOrderList()
                this.changeSpinning(false)
            })
    }

    private donePickingGetLabel() {
        this.changeSpinning(true)
        let param = this.currentId ? [this.currentId] : this.selectedRowKeys

        this.shipmentService
            .donePickingGetLabel(new RequestParams({ picking_id_list: param }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private customer_service_stop_plz() {
        this.changeSpinning(true)
        this.pickingService
            .customer_service_stop_plz(
                new RequestParams({ picking_id_list: this.selectedRowKeys })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private cancel_stock_picking_for_order_refund() {
        this.changeSpinning(true)
        this.pickingService
            .cancel_stock_picking_for_order_refund(
                new RequestParams({ picking_id_list: this.selectedRowKeys })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private deletePicking() {
        this.changeSpinning(true)
        this.pickingService
            .deleteCancelPicking(
                new RequestParams({ picking_id_list: this.selectedRowKeys })
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                    this.changeSpinning(false)
                },
                err => {
                    this.changeSpinning(false)
                    this.$message.error(err.message)
                }
            )
    }

    private multiCreateInvoice() {
        let order_ids: any = []
        this.selectedRowKeys.forEach(value => {
            order_ids.push(
                this.pickingDatas.filter(item => value === item.id)[0].order_id
            )
        })
        this.accountService
            .createInvoice(new RequestParams({ order_id_list: order_ids }))
            .subscribe(
                data => {
                    let msg: any = this.$t('save_success')
                    this.$message.success(msg)
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private viewAmazonInvoicePDF() {
        let row = this.pickingDatas.find(x => x.id == this.selectedRowKeys[0])

        let order_name = row.origin

        let pattern = /^[0-9]{3}-[0-9]{7}-[0-9]{7}$/

        if (!pattern.test(order_name)) {
            this.$message.success('Only support Amazon Order to view invoice')
            return
        }

        let url =
            appConfig.server +
            '/account/create_invoice_pdf?order_name=' +
            order_name

        window.open(url, '_blank')
    }

    private onTbSelectChange(keys) {
        this.selectedRowKeys = keys
        if (keys.length) {
            this.currentPickingId = keys[0]
        }
    }
}
</script>

<style lang="less" scoped>
.font-blod {
    font-weight: bold;
}

.picking_btn {
    margin-left: 10px;
}

.split {
    width: 100%;
    height: 1px;
    background: rgb(200, 200, 200);
    width: 100%;
    height: 2px;
    padding: 2px 0;
    border: 2px;

    &:hover {
        cursor: row-resize;
    }
}

.chat-integration-container {
    background: #ffffff;
    height: 100%;
    width: 100%;
    min-height: 800px;
    min-width: 500px;
    overflow: hidden;
    display: grid;
    grid-template-columns: auto;
    grid-template-areas:
        'chat-message'
        'chat-input';

    &.moving {
        cursor: row-resize !important;
    }
}

.background {
    background-color: #a7a7a7;
}

.wrap {
    position: relative;
}

.user-order-wrap {
    grid-area: user-order;
}

.chat-message-wrap {
    grid-area: chat-message;
}

.chat-input-wrap {
    grid-area: chat-input;
}

.ant-tabs {
    font-size: inherit;
}

.overHeight {
    overflow: auto;
    padding: 10px;
}
</style>

<i18n>
{
    "en-us": {
        "Invoice": "Invoice",
        "more_actions": "More Actions",
        "no": "no",
        "save_success": "Success",
        "Picking Detail": "Picking Detail",
        "Pickings": "Pickings",
        "today": "Today",
        "Message Content": "Message Content",
        "Order Detail": "Order Detail",
        "Create CP": "Create CP",
        "Delivery More": "Delivery More",
        "Refund & Supplement": "Refund & Supplement",
        "Create RT": "Create RT",
        "Create & Send Invoice": "Create & Send Invoice",
        "Customer Email": "Customer Email",
        "Total Amount": "Total Amount",
        "Order Date": "Order Date",
        "Customer Service RT Rule": "Customer Service RT Rule",
        "Customer Service Supplement Scope": "Customer Service Supplement Scope",
        "Delivery No": "Delivery No",
        "Latest delivery date": "Latest delivery date",
        "Shipment No": "Shipment No",
        "Merge Time": "Merge Time",
        "Products shipped": "Products shipped",
        "Shipment Type": "Shipment Type",
        "Product Code": "Product Code",
        "Product Name": "Product Name",
        "Quantity": "Quantity",
        "Price": "Price",
        "DE Stock": "DE Stock",
        "Uk Stock": "Uk Stock",
        "Stock Arrival Time": "Stock Arrival Time",
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
            "showDetailPage": "Detail",
            "modify_memo": "Modify Memo",
            "shipment_product": "Shipment Product",
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
            "donePickingGetLabel": "Shipping Label",
            "deliveryMore": "Delivery More",
            "done_picking_get_label": "Shipping Label",
            "ProductPart": "Product Part",
            "refund": "Refund",
            "createCp": "Create Cp",
            "create_brief": "Create Brief",
            "assign_to_user": "Assign To User",
            "force_available": "Force Availability",
            "force_verify_address": "Force Verify Address",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "deletePicking": "Delete Picking",
            "reserved": "Reserved",
            "viewAmazonInvoicePDF": "view AMA PDF",
            "confirm_operate_refund_order": "Are you sure to cancel order for refund?"
        },
        "columns": {
            "status": "Status",
            "reference": "Reference",
            "product_name": "Product Name",
            "instance": "Instance",
            "partner": "Partner",
            "scheduled_date": "Scheduled Date",
            "order_id": "Order ID",
            "state": "State",
            "payment_date": "Payment Date",
            "latest_ship_date": "Latest Ship Date",
            "validate_state": "Validate State",
            "shipment_count": "Shipment Count",
            "shipment_num": "Shipment Num.",
            "shipment_time": "Shipment Time",
            "ebay_type": "Ebay Type",
            "amazon_type": "Amazon Type",
            "order_memo": "Memo",
            "operate": "Operate",
            "shipment_product": "Shipment Product"
        }
    },
    "zh-cn": {
        "Invoice": "发票",
        "more_actions": "更多按钮",
        "no": "无",
        "save_success": "操作成功",
        "Picking Detail": "发货详情",
        "Pickings": "发货列表",
        "today": "今天",
        "Message Content": "消息内容",
        "Order Detail": "订单详情",
        "Create CP": "创建CP",
        "Delivery More": "补发",
        "Refund & Supplement": "退款/折扣",
        "Create RT": "创建RT",
        "Create & Send Invoice": "创建发送发票",
        "Customer Email": "客户邮箱",
        "Total Amount": "总金额",
        "Order Date": "订单日期",
        "Customer Service RT Rule": "客服RT规则",
        "Customer Service Supplement Scope": "客服折扣范围",
        "Delivery No": "卡车号",
        "Latest delivery date": "最迟配送时间",
        "Shipment No": "运单号",
        "Merge Time": "合并时间",
        "Products shipped": "运送的产品",
        "Shipment Type": "配送类型",
        "Product Code": "产品编码",
        "Product Name": "产品名",
        "Quantity": "数量",
        "Price": "单价",
        "DE Stock": "DE库存",
        "UK Stock": "Uk库存",
        "Stock Arrival Time": "到库时间",
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
            "modify_address": "修正地址",
            "batch_send_email": "批量发邮件",
            "fake_shipment": "假单号",
            "upload_shipment": "上传单号",
            "upload_fake_shipment": "上传假单号",
            "createReturn": "创建回程单",
            "showDetailPage": "编辑详情",
            "modify_memo": "编辑Memo",
            "shipment_product": "运单产品",
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
            "donePickingGetLabel": "生成运单号",
            "deliveryMore": "创建补发",
            "done_picking_get_label": "生成运单号",
            "ProductPart": "补发零部件",
            "refund": "退款",
            "createCp": "创建CP",
            "create_brief": "创建Brief",
            "assign_to_user": "Assign To User",
            "force_available": "强制预留",
            "force_verify_address": "强制验证地址",
            "customer_service_stop_plz": "Wrong Address",
            "cancel_stock_picking_for_order_refund": "Cancel Order For Refund",
            "deletePicking": "删除",
            "reserved": "预留",
            "viewAmazonInvoicePDF": "查看AMA账单",
            "confirm_operate_refund_order": "确定要批量取消订单[直接退款]吗?"
        },
        "columns": {
            "status": "状态",
            "reference": "参数",
            "product_name": "产品名称",
            "instance": "实例",
            "partner": "客户",
            "scheduled_date": "约定日期",
            "order_id": "订单号",
            "state": "状态",
            "payment_date": "支付日期",
            "latest_ship_date": "到货时间",
            "validate_state": "有效状态",
            "shipment_count": "面单数量",
            "shipment_num": "物流单号",
            "shipment_time": "物流时间",
            "ebay_type": "Ebay类型",
            "amazon_type": "亚马逊类型",
            "order_memo": "Memo",
            "operate": "操作",
            "shipment_product": "面单产品"
        }
    }
}
</i18n>
