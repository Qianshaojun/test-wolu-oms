<template>
    <section class="component edit-customer">
        <data-form
            :extends="extendItems"
            ref="dataForm"
            @submit="getOrderList"
            :column="2"
            v-show="isShow"
            @heightChange="onHeightChange"
            :actions="true"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.orderID')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="[
                            'name',
                            {
                                initialValue: defaultOrigin
                            }
                        ]"
                        :style="{ width: '303px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['state', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                        @change="e => onStatusChange(e)"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.OrderStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                    :label="$t('forms.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 30 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('columns.orderID') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.ebay_buyer_id') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            Email
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('columns.sku') }}
                        </a-select-option>
                        <a-select-option
                            :value="50"
                            :title="$t('columns.eBay_payment_id')"
                        >
                            {{ $t('columns.eBay_payment_id') }}
                        </a-select-option>
                        <a-select-option
                            :value="60"
                            :title="$t('columns.sales_order_number')"
                        >
                            {{ $t('columns.sales_order_number') }}
                        </a-select-option>
                        <a-select-option :value="70">
                            {{ $t('columns.customer') }}
                        </a-select-option>
                        <a-select-option :value="80">
                            {{ $t('columns.zip') }}
                        </a-select-option>
                        <a-select-option :value="90">
                            {{ $t('columns.street') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', margin: '0 5px' }"
                        size="small"
                    ></a-input>
                    <a-select
                        v-decorator="[
                            'fuzzy_search_operator',
                            { initialValue: 20 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('forms.operator_like') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('forms.operator_equal') }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ebay_buyer_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['ebay_buyer_id']"
                        :style="{ width: '257px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        v-decorator="['default_code']"
                        :style="{ width: '303px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.eBay_payment_id')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['eBay_payment_id']"
                        :style="{ width: '257px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.platform')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'platform',
                            {
                                initialValue:
                                    page_flag === 'aliexpress' ? 60 : ''
                            }
                        ]"
                        :style="{ width: '303px' }"
                        size="small"
                        :disabled="page_flag === 'aliexpress'"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.SellerPlatform"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.date_order')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['date_order', { initialValue: [] }]"
                        :style="{ width: '257px' }"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                    <a-button
                        @click="fillToday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.today') }}
                    </a-button>
                    <a-button
                        @click="fillYestoday"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.yestoday') }}
                    </a-button>
                    <a-button
                        @click="fill3day"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3day') }}
                    </a-button>
                    <a-button
                        @click="fill3days"
                        size="small"
                        type="primary"
                        style="margin-left:5px;"
                        >{{ $t('action.3days') }}
                    </a-button>
                </a-form-item>
            </template>
            <template #collapse>
                <a-form-item
                    :label="$t('columns.seller_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['seller_code', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerCodeList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.instance_code')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['instance_code', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of sellerInstanceList"
                            :key="item.code"
                            >{{ $t(item.name) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.email')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['email']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.country')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'country_id',
                            { initialValue: '' },
                            {
                                rules: rules.required
                            }
                        ]"
                        :style="{ width: '240px' }"
                        size="small"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of countryList"
                            :key="item.code"
                            >{{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.sales_order_number')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['sales_order_number']"
                        :style="{ width: '240px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.customer')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['partner_name']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('split_query_condition')"
                    ></a-input>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button type="primary" @click="onCreate">
                    {{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="confirm"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.confirm_order') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="cancelOrder"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.cancel_order') }}
                </a-button>
                <a-button
                    @click="backToDraft"
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.back_to_draft') }}
                </a-button>
                <!-- <a-button
                    @click="modifyCP"
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    >{{ $t('action.modify_cp') }}</a-button
                > -->
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="multiCreateInvoice"
                >
                    {{ $t('action.create_invovice') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="deliveryMore"
                    >{{ $t('action.deliveryMore') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="onReturn2()"
                    >{{ $t('action.refund') }}
                </a-button>
                <a-dropdown :trigger="['click']">
                    <a-menu slot="overlay">
                        <a-menu-item
                            type="primary"
                            @click="markOrderAsPaid"
                            :disabled="!selectedRowKeys.length"
                        >
                            {{ $t('action.mark_order_as_paid') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="amaEbayDz"
                            :disabled="
                                !selectedRowKeys.length ||
                                    selectedRowKeys.length > 1
                            "
                        >
                            {{ $t('action.ama_ebay_dz') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="batchViewAmazonInvoicePDF"
                            :disabled="selectedRowKeys.length === 0"
                        >
                            {{ $t('action.viewAmazonInvoicePDF') }}
                        </a-menu-item>
                        <a-menu-item
                            type="primary"
                            @click="downloadAmazonInvoiceOther"
                            :disabled="selectedRowKeys.length === 0"
                        >
                            {{ $t('action.downloadAmazonInvoiceOther') }}
                        </a-menu-item>
                    </a-menu>
                    <a-button style="margin-left: 8px"
                        >{{ $t('action.more') }}
                        <a-icon type="down" />
                    </a-button>
                </a-dropdown>
            </template>
        </data-form>
        <DragArea :formShow="isDataFormShow" @traggle="onDragChange">
            <template #up>
                <div v-if="!groupbyList.length">
                    <AutoColumnTable
                        :stripe="true"
                        :data="data"
                        :page="pageService"
                        :queryNameAuth="allNameAuth"
                        rowKey="id"
                        :columns="columnList"
                        :rowSelection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: keys => (selectedRowKeys = keys)
                        }"
                        @on-page-change="getOrderList"
                        @onClick="
                            record => {
                                selectedRowKeys = [record]
                                onTrClick(record)
                            }
                        "
                        @tbchange="onTableChange"
                        :scroll="{ x: 1500, y: formDivHeight }"
                    >
                        <span slot="check_render" slot-scope="text"
                            ><a-checkbox disabled :checked="text" />
                        </span>
                        <template
                            slot="buyer_message"
                            slot-scope="text, row"
                            :title="row.buyer_checkout_message"
                        >
                            <a @click="showMessage(text)" :title="text">{{
                                text
                                    ? text.length > 20
                                        ? text.substr(0, 17) + '...'
                                        : text
                                    : ''
                            }}</a>
                        </template>
                        <span slot="date_render" slot-scope="text"
                            >{{ text | datetolocal }}
                        </span>
                        <template slot="name" slot-scope="text, row">
                            <a @click="onDetail(row)">{{
                                row.name ? row.name : ''
                            }}</a>
                        </template>
                        <template slot="sku" slot-scope="text, row">
                            <span style="color: red;">{{
                                row.sku ? row.sku : ''
                            }}</span>
                        </template>
                        <template slot="state" slot-scope="state">
                            <span :style="{ color: calcStateColor(state) }">{{
                                state | dict('OrderStatus') | translate
                            }}</span></template
                        >
                        <template slot="memo" slot-scope="text, row">
                            <a :title="row.memo" @click="onEditMemo(row)">
                                {{
                                    row.memo ? row.memo.substr(0, 10) : $t('no')
                                }}
                            </a>
                        </template>
                        <template
                            slot="buyer_message"
                            slot-scope="text, row"
                            :title="row.buyer_checkout_message"
                        >
                            <a @click="showMessage(text)" :title="text">{{
                                text
                                    ? text.length > 26
                                        ? text.substr(0, 23) + '...'
                                        : text
                                    : ''
                            }}</a>
                        </template>
                        <template
                            slot="instance_code"
                            slot-scope="instance_code"
                        >
                            <span>{{
                                instance_code
                                    ? sellerInstanceDict[instance_code]
                                    : ''
                            }}</span>
                        </template>
                        <template
                            slot="country_name_render"
                            slot-scope="country_id"
                        >
                            <span>{{ getCountryName(country_id) }}</span>
                        </template>
                        <template slot="amount_total" slot-scope="text, row">
                            {{ row.currency | getcurrency }}
                            {{ row.amount_total.toFixed(2) }}
                        </template>
                        <template slot="operation" slot-scope="row">
                            <a-dropdown>
                                <a-menu slot="overlay">
                                    <a-menu-item @click="onEdit(row)">
                                        {{ $t('action.edit') }}
                                    </a-menu-item>
                                    <a-menu-item @click="onDetail(row)">
                                        {{ $t('action.detail') }}
                                    </a-menu-item>
                                    <a-menu-item @click="onReturn(row)"
                                        >{{ $t('action.refund') }}
                                    </a-menu-item>
                                    <a-menu-item
                                        @click="createCPofAllProduct(row)"
                                        >{{ $t('action.createCPofAllProduct') }}
                                    </a-menu-item>
                                    <a-popconfirm
                                        :title="$t('delete')"
                                        :okText="$t('action.ok')"
                                        :cancelText="$t('action.cancel')"
                                        placement="left"
                                        @confirm="onDelete(row)"
                                    >
                                        <a-menu-item
                                            style="cursor:pointer;margin-left:12px;"
                                            class="btnDel"
                                            >{{ $t('action.delete') }}
                                        </a-menu-item>
                                    </a-popconfirm>
                                    <a-menu-item
                                        @click="viewAmazonInvoicePDF(row)"
                                        >{{ $t('action.viewAmazonInvoicePDF') }}
                                    </a-menu-item>
                                </a-menu>
                                <a-button>
                                    {{ $t('action.more') }}
                                    <a-icon type="down" />
                                </a-button>
                            </a-dropdown>
                        </template>
                    </AutoColumnTable>
                </div>
                <GroupbyTable
                    v-else
                    ref="groupbyTable"
                    :groupByColumn="groupbyList"
                    :oColumns="columnList"
                    :queryNameAuth="allNameAuth"
                    :urlStr="queryUrl"
                    @selectChange="onSelectChange"
                    :scrollX="1500"
                    :scrollY="formDivHeight"
                    @rowClick="onTrClick"
                >
                    <span slot="check_render" slot-scope="text"
                        ><a-checkbox disabled :checked="text" />
                    </span>
                    <span
                        slot="show_message_tips"
                        slot-scope="text"
                        :title="text"
                    >
                        {{
                            text
                                ? text.length > 26
                                    ? text.substr(0, 23) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="name" slot-scope="text, row">
                        <a @click="onDetail(row)">{{
                            row.name ? row.name : ''
                        }}</a>
                    </template>
                    <template slot="sku" slot-scope="text, row">
                        <span style="color: red;">{{
                            row.sku ? row.sku : ''
                        }}</span>
                    </template>
                    <template slot="state" slot-scope="state">
                        <span :style="{ color: calcStateColor(state) }">{{
                            state | dict('OrderStatus') | translate
                        }}</span></template
                    >
                    <template slot="memo" slot-scope="text, row">
                        <a :title="row.memo" @click="onEditMemo(row)">
                            {{ row.memo ? row.memo.substr(0, 10) : $t('no') }}
                        </a>
                    </template>
                    <template slot="instance_code" slot-scope="instance_code">
                        <span>{{
                            instance_code
                                ? sellerInstanceDict[instance_code]
                                : ''
                        }}</span>
                    </template>
                    <template
                        slot="country_name_render"
                        slot-scope="country_id"
                    >
                        <span>{{ getCountryName(country_id) }}</span>
                    </template>
                    <template slot="amount_total" slot-scope="text, row">
                        {{ row.currency | getcurrency }}
                        {{ row.amount_total.toFixed(2) }}
                    </template>
                    <template slot="operation" slot-scope="row">
                        <a-dropdown>
                            <a-menu slot="overlay">
                                <a-menu-item @click="onEdit(row)">
                                    {{ $t('action.edit') }}
                                </a-menu-item>
                                <a-menu-item @click="onDetail(row)">
                                    {{ $t('action.detail') }}
                                </a-menu-item>
                                <a-menu-item @click="onReturn(row)"
                                    >{{ $t('action.refund') }}
                                </a-menu-item>
                                <a-menu-item @click="createCPofAllProduct(row)"
                                    >{{ $t('action.createCPofAllProduct') }}
                                </a-menu-item>
                                <a-popconfirm
                                    :title="$t('delete')"
                                    :okText="$t('action.ok')"
                                    :cancelText="$t('action.cancel')"
                                    placement="left"
                                    @confirm="onDelete(row)"
                                >
                                    <a-menu-item
                                        style="cursor:pointer;margin-left:12px;"
                                        class="btnDel"
                                        >{{ $t('action.delete') }}
                                    </a-menu-item>
                                </a-popconfirm>
                                <a-menu-item @click="viewAmazonInvoicePDF(row)"
                                    >{{ $t('action.viewAmazonInvoicePDF') }}
                                </a-menu-item>
                            </a-menu>
                            <a-button>
                                {{ $t('action.more') }}
                                <a-icon type="down" />
                            </a-button>
                        </a-dropdown>
                    </template>
                </GroupbyTable>
            </template>
            <template #down>
                <OrderDetail
                    :detail="detailInfo"
                    :height="detailDivHeight"
                    :systemUsers="systemUsers"
                    :companyList="companyList"
                    :cnt="changeCnt"
                ></OrderDetail>
            </template>
        </DragArea>
    </section>
</template>

<style>
.components-table-demo-nested
    tr.ant-table-expanded-row
    td
    > .ant-table-wrapper {
    margin: -9px !important;
}
</style>

<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
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
import router from '../../router'
import moment from 'moment'
import { OrderService } from '../../services/order.service'
import { SellerInstanceService } from '~/services/seller-instance.service'
import { AccountService } from '../../services/account.service'
import DragArea from '~/shared/components/drag-area.vue'
import TestTable from '~/components/orders/test-table.vue'

import SendEmail from '~/components/common/send-email.vue'
import RefundForm from '~/components/common/refund-form.vue'
import CancelOrderForm from '~/components/orders/cancel-order-form.vue'
import { TaxesService } from '../../services/taxes.service'
import OrderModifyMemo from '~/components/orders//order-modify-memo.vue'
import DownloadInvoiceOther from '~/components/orders//download-invoice-other.vue'

import { EmailService } from '~/services/cs-email.service'
import DeliveryMore from '@/components/picking/delivery-more.vue'
import appConfig from '@/config/app.config'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import ShowTextMessage from '@/shared/components/show-text-message.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'order-manage'
})
@Component({
    components: {
        OrderDetail,
        CancelOrderForm,
        DragArea,
        OrderModifyMemo,
        DeliveryMore,
        GroupbyTable,
        AutoColumnTable,
        DownloadInvoiceOther
    }
})
export default class OrderManageContent extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    private page_flag

    private showSearch: any = true

    private showhideSearch(flag) {
        this.showSearch = flag
    }

    // 开启后页面的查询条件会出现‘更多’
    private get extendItems() {
        return formConfig.defaults()
    }

    // Loading服务
    private orderService = new OrderService()
    private accountService = new AccountService()

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private sellerInstanceService = new SellerInstanceService()

    private taxesService = new TaxesService()
    private emailService = new EmailService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private showBtn: any = false

    private sellerInstanceList: any[] = []

    private sellerInstanceDict: any = {}

    // 表格选择项
    private selectedRowKeys: any[] = []

    private sellerCodeList: any[] = []

    // 详情项
    private detailInfo: any = null

    private isShow: any = true

    private isDataFormShow: any = true

    private formDivHeight: any = 400

    private detailDivHeight: any = 300

    private defaultOrigin: any = ''

    private changeCnt: any = 0

    private orderBy: any = ''

    private defaultCondition: any = ''

    private hzData: any[] = []

    private showHz: any = false

    private defaultPlatform: any = ''

    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []

    private queryUrl: any = '/sale_order/query_all'

    @datasModule.State
    private countryList

    @datasModule.Action
    private getcountry

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.Mutation('changeOrder')
    private changeOrder

    private get rules() {
        return {}
    }

    @Watch('$route')
    onRouteChange(newRoute, oldRoute) {
        if (this.$route.params.origin || this.$route.query.origin) {
            let values = this.dataForm.getValues()
            for (let i in values) {
                values[i] = undefined
            }
            if (this.$route.params.origin) {
                values['name'] = this.$route.params.origin
            } else {
                values['name'] = this.$route.query.origin
            }
            this.dataForm.setValues(values)

            // if (this.data.length === 0) {
            this.getOrderList()
            // }
        }
    }

    private onDragChange(param) {
        this.formDivHeight = param[0] - 110 > 0 ? param[0] - 110 : 0
        this.detailDivHeight = param[1] - 97 > 0 ? param[1] - 97 : 0
    }

    private created() {
        this.getcountry()
        this.getcurrency()
        this.getSystemuser()
        this.getcompany()
        this.getSellerCodeList()
        this.getSellerInstanceList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth

        if (this.$route.params.origin || this.$route.query.origin) {
            if (this.$route.params.origin) {
                this.defaultOrigin = this.$route.params.origin
            } else {
                this.defaultOrigin = this.$route.query.origin
            }

            let values = this.dataForm.getValues()
            values['name'] = this.defaultOrigin
            this.dataForm.setValues(values)
            this.getOrderList()
        }
    }

    private onCreate() {
        this.$router.push({
            name: 'order-edit'
        })
    }

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

    private onHeightChange(key) {
        this.isDataFormShow = key
    }

    private getSellerInstanceList() {
        this.sellerInstanceService
            .queryInstanceList(new RequestParams())
            .subscribe(
                data => {
                    this.sellerInstanceList = data
                    for (let i of data) {
                        this.sellerInstanceDict[i.code] = i.name
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onSendMail() {
        let target = this.data.filter(x => x.id === this.selectedRowKeys[0])
        this.$modal
            .open(
                SendEmail,
                {
                    model: 'orderManage',
                    recordID: this.selectedRowKeys[0],
                    data: {
                        recipient: target[0].email,
                        orderId: this.selectedRowKeys[0]
                    }
                },
                {
                    title: this.$t('action.send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

    private onReturn(row) {
        this.$modal
            .open(
                RefundForm,
                {
                    countryList: this.countryList,
                    order_id: row.id
                },
                {
                    title: this.$t('action.refund_wizard'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.changeCnt += 1
            })
    }

    private onReturn2() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一条数据进行操作')
            return
        }
        let row = this.data.find(x => x.id == this.selectedRowKeys[0])
        if (row) {
            this.$modal
                .open(
                    RefundForm,
                    {
                        countryList: this.countryList,
                        order_id: row.id
                    },
                    {
                        title: this.$t('action.refund_wizard'),
                        width: '1000px'
                    }
                )
                .subscribe(data => {
                    this.changeCnt += 1
                })
        } else {
            this.$message.error('数据错误，请联系管理员')
        }
    }

    private moment = moment

    private initialDate: any = []

    private fillToday() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime())),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()

        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fillYestoday() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 24 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3day() {
        let day = new Date()
        let endDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD HH:mm'
        )
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
        this.dataForm.setValues(values)
    }

    private fill3days() {
        let day = new Date()
        let endDate = moment(this.formatDate(day), 'YYYY-MM-DD HH:mm')
        let startDate = moment(
            this.formatDate(new Date(day.getTime() - 48 * 60 * 60 * 1000)),
            'YYYY-MM-DD 00:00'
        )

        let values = this.dataForm.getValues()
        this.initialDate = [startDate, endDate]
        values['date_order'] = this.initialDate
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
        return `${y}-${m}-${d} 23:59`
    }

    /**
     * 获取订单数据
     */
    private getOrderList() {
        this.dataForm.validateFields().then((values: any) => {
            if (values['seller_code'] && values['seller_code'].length > 0) {
                values['seller_code'] = values['seller_code'].join(',')
            }

            if (values['instance_code'] && values['instance_code'].length > 0) {
                values['instance_code'] = values['instance_code'].join(',')
            }

            if (values['eBay_payment_id']) {
                values['eBay_payment_id'] = values[
                    'eBay_payment_id'
                ].toUpperCase()
            }

            let name_operator = 'in_or_='
            let ebay_buyer_id_operator = 'in_or_='
            let email_operator = 'like'
            let default_code_operator = 'in_or_='
            let sales_order_number_operator = 'suffix_like'
            let ebay_payment_id_operator = 'in_or_prefix_like'
            let customer_name_operator = 'in_or_like'
            let zip_operator = 'like'
            let street_operator = 'like'

            let fuzzy_search_operator = values['fuzzy_search_operator']
            let operator = 'like'
            if (fuzzy_search_operator == 20) {
                operator = '='
            }

            let fuzzy_search_value = values['fuzzy_search_value']
            if (fuzzy_search_value) {
                let fuzzy_search_code = values['fuzzy_search_code']
                let search_field_name = 'name'

                switch (fuzzy_search_code) {
                    case 10:
                        search_field_name = 'name'
                        name_operator = operator
                        break
                    case 20:
                        search_field_name = 'ebay_buyer_id'
                        ebay_buyer_id_operator = operator
                        break
                    case 30:
                        search_field_name = 'email'
                        email_operator = operator
                        break
                    case 40:
                        search_field_name = 'default_code'
                        default_code_operator = operator
                        break
                    case 50:
                        search_field_name = 'eBay_payment_id'
                        ebay_payment_id_operator = operator
                        fuzzy_search_value = fuzzy_search_value.toUpperCase()
                        break
                    case 60:
                        search_field_name = 'sales_order_number'
                        sales_order_number_operator = operator
                        break
                    case 70:
                        search_field_name = 'partner_name'
                        sales_order_number_operator = operator
                        break
                    case 80:
                        search_field_name = 'zip'
                        zip_operator = operator
                        break
                    case 90:
                        search_field_name = 'street'
                        street_operator = operator
                        break
                    default:
                        search_field_name = 'name'
                        name_operator = operator
                }

                values[search_field_name] = fuzzy_search_value
            }

            delete values['fuzzy_search_value']
            delete values['fuzzy_search_code']
            delete values['fuzzy_search_operator']

            let params: any = CommonService.createQueryCondition(values, {
                name: name_operator,
                default_code: default_code_operator,
                customer_code: 'like',
                ebay_buyer_id: ebay_buyer_id_operator,
                eBay_payment_id: ebay_payment_id_operator,
                sales_order_number: sales_order_number_operator,
                email: email_operator,
                seller_code: 'in_or_=',
                instance_code: 'in_or_=',
                partner_name: customer_name_operator,
                zip: zip_operator,
                street: street_operator,
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        let startDate: any = {}
                        for (let key in item.value[0]) {
                            startDate[key] = item.value[0][key]
                        }
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(startDate.utc())
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        let endDate: any = {}
                        for (let key in item.value[1]) {
                            endDate[key] = item.value[1][key]
                        }
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(endDate.utc())
                        })
                    }
                } else {
                    nowConditions.push(item)
                }
            }

            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(nowConditions)
            } else {
                params.query_condition = nowConditions
                if (this.orderBy) {
                    params['order_by'] = this.orderBy
                }
                this.innerAction.setActionAPI(
                    this.queryUrl,
                    CommonService.getMenuCode()
                )
                this.publicService
                    .queryPagination(
                        new RequestParams(params, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            this.data = data.map(item => {
                                for (var cty of this.countryList) {
                                    if (cty.code == item['country_id']) {
                                        item['country'] = cty.name
                                    }
                                }

                                for (var currency of this.currencyList) {
                                    if (currency.code == item['pricelist_id']) {
                                        item['currency'] = currency.name
                                    }
                                }
                                return item
                            })
                            this.selectedRowKeys = []
                            if (this.data.length > 0) {
                                this.selectedRowKeys.push(this.data[0].id)
                                this.onDetail(this.data[0])
                            }
                            this.changeCnt += 1
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onEdit(row) {
        this.orderService
            .queryOrderInfo(
                new RequestParams(
                    { order_id: row.id },
                    { loading: this.loadingService }
                )
            )
            .subscribe(data => {
                this.orderService
                    .getDetail(
                        new RequestParams(
                            { order_id: row.id },
                            { loading: this.loadingService }
                        )
                    )
                    .subscribe(list => {
                        data[0]['order_detail_list'] = list.order_lines
                        data[0]['id'] = row.id
                        data[0]['name'] = row.name
                        this.changeOrder(data)
                        router.push({
                            name: 'order-edit',
                            params: { order: data }
                        })
                    })
            })
    }

    private onDelete(row) {}

    private onBatchDelete() {}

    private onDetail(row) {
        row['taxList'] = []
        if (row.seller_code) {
            this.taxesService
                .queryAll(
                    new RequestParams(
                        {
                            seller_code: row.seller_code
                        },
                        { loading: this.loadingService }
                    )
                )
                .subscribe(data => {
                    row.taxList = data
                    this.detailInfo = row
                    // this.$nextTick(() => this.pageContainer.scrollToBottom())
                })
        } else {
            this.detailInfo = row
            // this.$nextTick(() => this.pageContainer.scrollToBottom())
        }
    }

    private onClose() {
        this.detailInfo = null
    }

    private onTrClick(record) {
        let info = this.data.find(x => x.id === record)
        if (info) {
            this.onDetail(info)
        } else if (this.groupbyList.length) {
            this.onDetail({ id: record })
        }
    }

    private onStatusChange(e) {
        this.$nextTick(function() {
            this.getOrderList()
        })
    }

    private onShow() {
        this.isShow = this.isShow ? false : true
    }

    private copy(e, email) {
        e.stopPropagation()
        // TODO
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private modifyCP() {
        router.push({
            name: 'modify-custom-problem',
            params: {
                orderList: JSON.stringify(this.selectedRowKeys)
            }
        })
    }

    private createCPofAllProduct(row) {
        router.push({
            name: 'modify-custom-problem',
            params: { orderId: row.id }
        })
    }

    private viewAmazonInvoicePDF(row) {
        let order_name = row.name

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

    private confirm() {
        this.orderService
            .confirm(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('订单生成picking成功')
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private autoConfirm() {
        this.orderService
            .confirm(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('订单自动生成picking成功')
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private multiCreateInvoice() {
        this.accountService
            .createInvoice(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('入账发票生成成功')
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private backToDraft() {
        this.orderService
            .setToDraft(
                new RequestParams(
                    { order_id_list: this.selectedRowKeys },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.getOrderList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancelOrder() {
        let compare_flag = ''
        for (let i of this.selectedRowKeys) {
            let item = this.data.find(x => x.id == i)

            let shop_type = ''
            if (item.shop_type) {
                shop_type = item.shop_type.toLowerCase()
            }
            let flag = ''
            switch (true) {
                case shop_type.indexOf('amazon') >= 0:
                    flag = 'amazon'
                    break
                case shop_type.indexOf('ebay') >= 0:
                    flag = 'ebay'
                    break
                case shop_type.indexOf('b2c') >= 0:
                    flag = 'b2c'
                    break
                case shop_type.indexOf('wish') >= 0:
                    flag = 'wish'
                    break
                case shop_type.indexOf('cdiscount') >= 0:
                    flag = 'cdiscount'
                    break
                case shop_type.indexOf('aliexpress') >= 0:
                    flag = 'aliexpress'
                    break
                case shop_type.indexOf('wayfair') >= 0:
                    flag = 'wayfair'
                    break
            }

            if (flag == '' && item.platform_type) {
                switch (item.platform_type) {
                    case 10:
                        flag = 'b2c'
                        break
                    case 20:
                        flag = 'amazon'
                        break
                    case 30:
                        flag = 'ebay'
                        break
                    case 40:
                        flag = 'wish'
                        break
                    case 50:
                        flag = 'cdiscount'
                        break
                    case 60:
                        flag = 'aliexpress'
                        break
                    case 100:
                        flag = 'wayfair'
                        break
                }
            }

            if (compare_flag != '') {
                if (compare_flag != flag) {
                    this.$message.error('请选择相同平台订单')
                    return
                }
            } else {
                compare_flag = flag
            }
        }

        if (compare_flag == '') {
            this.$message.info(
                'unknow platform of the order, pls contact admin./订单平台类型未知，请联系管理员'
            )
            return
        }

        this.innerAction.setActionAPI(
            'common/query_general_code_detail_by_group',
            CommonService.getMenuCode('code-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { group_name: 'platform_cancel_reason' },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let refundReasonList: any[] = []

                    for (let item of data) {
                        if (item.general_code.startsWith(compare_flag + '/')) {
                            refundReasonList.push({
                                code: item.general_code.replace(
                                    compare_flag + '/',
                                    ''
                                ),
                                name: item.general_name
                            })
                        }
                    }

                    if (refundReasonList.length == 0) {
                        let cancelReason: any = ''
                        if (compare_flag == 'amazon') {
                            cancelReason = 'BuyerCanceled'
                        }

                        let refundData = {
                            order_id_list: this.selectedRowKeys,
                            refund_reason: cancelReason
                        }

                        this.orderService
                            .cancelOrder(
                                new RequestParams(refundData, {
                                    loading: this.loadingService
                                })
                            )
                            .subscribe(
                                data => {
                                    this.$message.success('success')
                                    this.getOrderList()
                                },
                                err => {
                                    this.$message.error(err.message)
                                }
                            )
                    } else {
                        this.$modal
                            .open(
                                CancelOrderForm,
                                {
                                    order_id_list: this.selectedRowKeys,
                                    platform: compare_flag,
                                    refundReasonList: refundReasonList
                                },
                                {
                                    title: this.$t('action.cancel_order'),
                                    width: '500px'
                                }
                            )
                            .subscribe(data => {
                                this.orderService
                                    .cancelOrder(
                                        new RequestParams(data, {
                                            loading: this.loadingService
                                        })
                                    )
                                    .subscribe(
                                        data => {
                                            this.$message.success('success')
                                            this.getOrderList()
                                        },
                                        err => {
                                            this.$message.error(err.message)
                                        }
                                    )
                            })
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private markOrderAsPaid() {
        let order_id_list: any[] = []

        for (var i of this.selectedRowKeys) {
            let item = this.data.find(x => x.id === i)
            if (item) {
                order_id_list.push(item.id)
            }
        }
        this.orderService
            .markEbayOrderAsPaid(
                new RequestParams(
                    {
                        order_id_list: order_id_list
                    },
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

    private amaEbayDz() {
        if (this.selectedRowKeys.length === 0) {
            return
        } else if (this.selectedRowKeys.length > 1) {
            this.$message.error('只能选择一个订单')
            return
        }
        let row = this.data.find(x => x.id === this.selectedRowKeys[0])
        this.$modal
            .open(
                SendEmail,
                {
                    model: 'orderManage',
                    recordID: row.id,
                    data: { orderId: row.id, templateId: 260 }
                },
                {
                    title: this.$t('action.send_email'),
                    width: '1000px'
                }
            )
            .subscribe(data => {})
    }

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

    private calcStateColor(state) {
        let color = '#333;'
        if (state === 'cancel') {
            color = '#999'
        }
        return color
    }

    private onEditMemo(record) {
        this.$modal
            .open(
                OrderModifyMemo,
                {
                    memo: record.memo,
                    id: record.id,
                    systemUsers: this.systemUsers
                },
                {
                    title: this.$t('action.modify_memo'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.modifyMemo(record.id, data)
            })
    }

    private modifyMemo(order_id, memo) {
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
                },
                err => {
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
                    order_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.deliveryMore'),
                    width: '800px'
                }
            )
            .subscribe(data => {
                let msg: any = this.$t('save_success')
                this.$message.success(msg)

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

    private batchViewAmazonInvoicePDF() {
        let order_name_list: any[] = []
        for (var selected_code of this.selectedRowKeys) {
            let row = this.data.find(x => x.id === selected_code)

            let pattern = /^[0-9]{3}-[0-9]{7}-[0-9]{7}$/

            if (!pattern.test(row.name)) {
                this.$message.success(
                    'Only support Amazon Order to view invoice'
                )
                return
            }
            order_name_list.push(row.name)
        }

        let urlParams = encodeURIComponent(JSON.stringify(order_name_list))

        let url =
            appConfig.server +
            '/account/download_order_invoice_pdf?order_name_list=' +
            urlParams
        window.open(url, '_blank')
    }

    private downloadAmazonInvoiceOther() {
        if (this.selectedRowKeys.length > 1) {
            this.$message.error('只限选择一条')
            return
        }
        let row = this.data.find(x => x.id === this.selectedRowKeys[0])
        this.$modal
            .open(
                DownloadInvoiceOther,
                {
                    order_name: row.name
                },
                {
                    title: 'Download Amazon Invoice',
                    width: '800px'
                }
            )
            .subscribe(data => {
                let url =
                    appConfig.server +
                    '/account/download_order_invoice_pdf_other_instance?order_name=' +
                    row.name
                window.open(url, '_blank')
            })
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private getCountryName(id) {
        let ret: any = id
        let item = this.countryList.find(x => x.code == id)
        if (item) {
            ret = item.name
        }

        return ret
    }

    private showMessage(text) {
        this.$modal
            .open(
                ShowTextMessage,
                {
                    text: text
                },
                {
                    title: 'Woltu OMS',
                    width: '800px'
                }
            )
            .subscribe(data => {
                //
            })
    }
}
</script>

<i18n>
{
    "en-us": {
        "no": "no",
        "desc": "this is a Order Page1",
        "columns": {
            "status": "Status",
            "orderID": "Order ID",
            "date_order": "Order Date",
            "ebay_buyer_id": "Buyer ID",
            "email": "Email",
            "sku": "Sku",
            "country": "Country",
            "customer": "Customer",
            "transaction_code": "TransactionCode",
            "instance": "Instance",
            "ebay_type": "Ebay Type",
            "is_prime": "Prime",
            "payment_method": "PaymentMethod",
            "invoice_status": "Invoice Status",
            "qty": "QTY",
            "amount_total": "Amount",
            "memo": "Memo",
            "buyer_message": "BuyerMessage",
            "lastest_shipping_date": "Lastest Shipping Date",
            "latest_delivery_date": "Latest Delivery Date",
            "operate": "Operate",
            "platform": "Platform",
            "seller_code": "Seller",
            "instance_code": "Instance",
            "eBay_payment_id": "eBayPaymentID",
            "sales_order_number": "eBayOrderID",
            "zip": "Zip",
            "street": "Street"
        },
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
            "today": "Today",
            "yestoday": "Yestoday",
            "3day": "3 Day",
            "3days": "3 Days",
            "send_email": "Send Email",
            "refund_wizard": "Refund Supplement Wizard",
            "modify_cp": "Modify CP",
            "back_to_draft": "To Draft",
            "mark_order_as_paid": "Mark Order as Paid",
            "ama_ebay_dz": "AMA/EBAY DZ",
            "send_email": "Send Email",
            "more": "More",
            "modify_memo": "Modify Memo",
            "deliveryMore": "Delivery More",
            "refund": "Refund",
            "createCPofAllProduct": "Create CP(All Product)",
            "viewAmazonInvoicePDF": "view AMA PDF",
            "downloadAmazonInvoiceOther": "view AMA PDF WOWO",
            "operation": "Action"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "no": "无",
        "desc": "这是订单页面1",
        "columns": {
            "status": "状态",
            "orderID": "订单号",
            "date_order": "订单日期",
            "ebay_buyer_id": "买家ID",
            "email": "邮箱",
            "sku": "SKU",
            "country": "国家",
            "customer": "客户",
            "transaction_code": "交易号",
            "instance": "实例",
            "ebay_type": "eBay 类型",
            "is_prime": "Prime",
            "payment_method": "支付方式",
            "invoice_status": "发票状态",
            "qty": "数量",
            "amount_total": "总金额",
            "memo": "备注",
            "buyer_message": "买家留言",
            "lastest_shipping_date": "发货时间",
            "latest_delivery_date": "交货时间",
            "operate": "操作",
            "platform": "平台",
            "seller_code": "店铺",
            "instance_code": "实例",
            "eBay_payment_id": "付款码",
            "sales_order_number": "eBayOrderID",
            "zip": "邮编",
            "street": "街道"
        },
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
            "today": "今天",
            "yestoday": "昨天",
            "3day": "前天",
            "3days": "近3天",
            "send_email": "发送邮件",
            "refund_wizard": "退款管理",
            "modify_cp": "修改CP",
            "back_to_draft": "设为草稿",
            "mark_order_as_paid": "标为已付款",
            "ama_ebay_dz": "AMA/EBAY DZ",
            "send_email": "发送邮件",
            "more": "更多",
            "modify_memo": "编辑Memo",
            "deliveryMore": "补发",
            "refund": "退款",
            "createCPofAllProduct": "创建CP(全部产品)",
            "viewAmazonInvoicePDF": "查看AMA账单",
            "downloadAmazonInvoiceOther": "查看AMA账单WOWO店铺",
            "operation": "操作"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
