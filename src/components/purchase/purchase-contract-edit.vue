<template>
    <section class="component edit-customer">
        <div
            style="padding:0 20px 10px 20px;;min-height:40px;display:inline-block;"
            v-if="order.id"
        >
            <a-button
                @click="editChange"
                v-if="order.state == 'draft'"
                type="default"
                size="small"
                ><span v-if="!editAble">{{ $t('action.edit') }}</span
                ><span v-else>{{ $t('action.discard') }}</span>
            </a-button>
            <a-button
                type="primary"
                v-if="editAble"
                @click="onSubmit()"
                style="margin-left:5px;"
                >{{ $t('action.save') }}
            </a-button>
            <a-button
                @click="onBatchDelete"
                type="default"
                size="small"
                style="margin-left:5px;"
                :disabled="!selectedRowKeys.length"
                ><span>{{ $t('action.delete') }}</span>
            </a-button>
            <a-button
                @click="onSyncProduct"
                type="default"
                size="small"
                style="margin-left:5px;"
                ><span>{{ $t('action.sync_product_info') }}</span>
            </a-button>
            <a-button
                @click="onChangeGiveDate"
                type="default"
                size="small"
                style="margin-left:5px;"
                :disabled="!selectedRowKeys.length"
                ><span>{{ $t('action.change_give_date') }}</span>
            </a-button>
            <a-button
                @click="verifyWithMemo('approved')"
                v-if="order.state == 'confirm'"
                style="margin-left:5px;"
            >
                {{ $t('action.verify') }}
            </a-button>
            <a-button
                @click="onVerify('draft')"
                v-if="order.state == 'refuse'"
                style="margin-left:5px;"
            >
                {{ $t('action.reset') }}
            </a-button>
            <a-button
                @click="onVerify('confirm')"
                v-if="order.state == 'draft'"
                style="margin-left:5px;"
            >
                {{ $t('action.confirm') }}
            </a-button>
            <!-- <a-button
                @click="onVerify('cancel')"
                v-if="order.state == 'confirm'"
                style="margin-left:5px;"
            >
                {{ $t('action.cancel') }}
            </a-button> -->
            <a-button
                @click="verifyWithMemo('refuse')"
                v-if="order.state == 'confirm'"
                style="margin-left:5px;"
            >
                {{ $t('action.refuse') }}
            </a-button>
            <div style="position:absolute;top:10px;right:10px;">
                <div class="progress-bar">
                    <li
                        :value="item.value"
                        v-for="item of $dict.PurchaseContractState"
                        :key="item.value"
                        :class="{ active: order.state == item.value }"
                        style="font-size: 12px;"
                    >
                        <span>{{ $t(item.label) }}</span>
                    </li>
                </div>
            </div>
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
                            <a-form-item :label="$t('columns.name')">
                                <label>{{ order.name }}</label>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.source_doc1')"
                                required
                            >
                                <a-input
                                    v-decorator="[
                                        `source_doc1`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    size="small"
                                    style="width: 200px;"
                                    :disabled="!editAble"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.vendor_id')"
                                required
                            >
                                <a-select
                                    showSearch
                                    v-model="order.vendor_id"
                                    v-decorator="[
                                        `vendor_id`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    style="width: 300px"
                                    size="small"
                                    :filterOption="filterSelectOption"
                                    :disabled="!editAble"
                                >
                                    <a-select-option
                                        :value="item.code"
                                        v-for="item of vendorFullNameList"
                                        :key="item.code"
                                    >
                                        {{ item.name }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.order_date')"
                                required
                            >
                                <a-date-picker
                                    :disabled="!editAble"
                                    v-decorator="[`order_date`]"
                                    format="YYYY-MM-DD"
                                    size="small"
                                    style="width: 200px;"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.order_company_id')"
                                required
                            >
                                <a-select
                                    show-search
                                    v-model="order.order_company_id"
                                    v-decorator="[
                                        `order_company_id`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    style="width: 300px"
                                    size="small"
                                    :disabled="!editAble"
                                >
                                    <a-select-option value="woltu" key="woltu">
                                        Woltu
                                    </a-select-option>
                                    <a-select-option value="eugad" key="eugad">
                                        EUGAD
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.give_date')"
                                required
                            >
                                <a-date-picker
                                    :disabled="!editAble"
                                    v-decorator="[
                                        `give_date`,
                                        {
                                            rules: rules.required
                                        }
                                    ]"
                                    format="YYYY-MM-DD"
                                    size="small"
                                    style="width: 200px;"
                                    @change="e => onFormChange(e, 'give_date')"
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.make_user')">
                                <label>{{
                                    order.make_user | dict2(systemUsers)
                                }}</label>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.change_give_date')"
                            >
                                <a-date-picker
                                    :disabled="!editAble"
                                    v-decorator="[`change_give_date`]"
                                    format="YYYY-MM-DD"
                                    size="small"
                                    style="width: 200px;"
                                    @change="
                                        e => onFormChange(e, 'change_give_date')
                                    "
                                />
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.merchandiser')">
                                <label>{{
                                    order.merchandiser | dict2(systemUsers)
                                }}</label>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item
                                :label="$t('columns.change_give_date_memo')"
                            >
                                <a-textarea
                                    :disabled="!editAble"
                                    rows="1"
                                    v-decorator="[`change_give_date_memo`]"
                                    size="small"
                                    @change="
                                        e =>
                                            onFormChange(
                                                e,
                                                'change_give_date_memo'
                                            )
                                    "
                                >
                                </a-textarea>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.user_purchase')">
                                <label>{{
                                    order.user_purchase | dict2(systemUsers)
                                }}</label>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.approved_user')">
                                <label>{{
                                    order.approved_user | dict2(systemUsers)
                                }}</label>
                            </a-form-item>
                        </a-col>
                        <a-col :span="12">
                            <a-form-item :label="$t('columns.approve_memo')">
                                <p>{{ order.approve_memo }}</p>
                            </a-form-item>
                        </a-col>
                    </a-row>
                </a-card>
                <a-card class="margin-top">
                    <a-table
                        :dataSource="orderDetail"
                        :pagination="false"
                        rowKey="id"
                        :columns="detailColumns"
                        :rowSelection="{
                            selectedRowKeys: selectedRowKeys,
                            onChange: keys => (selectedRowKeys = keys)
                        }"
                        :customRow="
                            record => ({
                                on: {
                                    click: () => {
                                        this.selectedRowKeys = [record.id]
                                        //onRowClick(record)
                                    }
                                }
                            })
                        "
                        style="table-layout:fixed;"
                        :scroll="{ x: 2000, y: 600 }"
                        bordered
                    >
                        <template slot="ist_box_qty" slot-scope="text, row">
                            <a-checkbox
                                :checked="row.ist_box_qty"
                                disabled
                                v-if="row.id != 'summary'"
                            />
                        </template>
                        <template
                            slot="product_purchase_price"
                            slot-scope="text"
                        >
                            {{ text ? text.toFixed(2) : '' }}
                        </template>
                        <template slot="manual_code" slot-scope="text, row">
                            <a
                                v-if="row.product_manual_url"
                                :href="row.product_manual_url"
                                target="_blank"
                                >{{ row.product_manual_code }}</a
                            >
                            <span v-else></span>
                        </template>
                        <template
                            slot="specification_code"
                            slot-scope="text, row"
                        >
                            <a
                                v-if="row.product_specification_url"
                                :href="row.product_specification_url"
                                target="_blank"
                                >{{ row.specification_code }}</a
                            >
                            <span v-else></span>
                        </template>
                        <template slot="action" slot-scope="row">
                            <a-popconfirm
                                :title="$t('delete')"
                                :okText="$t('action.ok')"
                                :cancelText="$t('action.cancel')"
                                placement="left"
                                @confirm="onDelete(row)"
                            >
                                <a class="btnDel" v-if="row.id != 'summary'">{{
                                    $t('action.delete')
                                }}</a>
                            </a-popconfirm>
                        </template>
                    </a-table>
                </a-card>
            </a-form>
        </section>
    </section>
</template>

<style>
.order-edit-page .ant-form-item {
    margin-bottom: 0 !important;
}

.order-edit-page .ant-form-item .ant-form-item-control,
.order-edit-page .ant-form-item .ant-form-item-label {
    line-height: 2em !important;
}

.progress-bar li {
    padding: 0px 10px;
    line-height: 25px;
    background: #ababab;
    display: inline-block;
    color: #fff;
    position: relative;
    width: initial;
    text-align: center;
}

.progress-bar li:after {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #ababab;
    position: absolute;
    right: -12px;
    top: 0;
    z-index: 10;
}

.progress-bar li:before {
    content: '';
    display: block;
    border-top: 12px solid transparent;
    border-bottom: 12px solid transparent;
    border-left: 12px solid #fff;
    position: absolute;
    left: 0px;
    top: 0;
}

.progress-bar li {
    padding-left: 25px;
}

.progress-bar li:first-child {
    border-radius: 4px 0 0 4px;
}

.progress-bar li:first-child:before {
    display: none;
}

.progress-bar li.active {
    background-color: #50abe4;
}

.progress-bar li.active:after {
    border-left-color: #50abe4;
}

.bar-date {
    position: absolute;
    color: #000;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
}

.bar-date span {
    font-size: 12px;
    color: #999;
}
</style>
<script lang="ts">
import { Component, Vue, Ref, Watch, Prop } from 'vue-property-decorator'
import { Form } from 'ant-design-vue'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { CommonService } from '../../shared/utils/common.service'
import { formConfig } from '../../config/form.config'
import { Mutation, namespace } from 'vuex-class'
import router from '../../router'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import ChangeGiveDateForm from '@/components/purchase/change-give-date-form.vue'
import ModifyMemo from '@/components/cs_email_return/chat-modify-memo.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {}
})
export default class PurchaseContractEdit extends Vue {
    @Prop()
    info: any

    private form: any

    private moment = moment

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()
    // 表格数据源
    private order: any = []

    private orderDetail: any[] = []

    private save_flag: any = 0

    private originData: any = []

    private isShowDetail: any = false //是否只是详情展示

    private menu_code: any = ''

    private editAble: any = false

    private detailColumns: any = []
    private selectedRowKeys: any = []
    private currencyList: any = []

    private summaryList: any = ['product_qty', 'price_subtotal']

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    purchaseContractParams

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @pageParamsModule.State
    private commonPageInfo

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    @userModule.State
    private id

    @Watch('info')
    onInfoChange() {
        if (this.info) {
            this.editAble = false
            this.updateOrder(this.info)
        }
    }

    private updateOrder(order) {
        this.originData = order
        this.$nextTick(() => {
            this.order = order[0]
            this.save_flag = 1
            this.editAble = false
            if (this.order.order_line.length) {
                this.orderDetail = this.order.order_line.map(x => {
                    return x
                })
            } else {
                this.orderDetail = []
            }

            if (
                this.summaryList != undefined &&
                this.summaryList.length &&
                this.orderDetail.length
            ) {
                let sm = this.orderDetail.find(x => x.id == 'summary')
                let ret: any = CommonService.getSummaryData(
                    this.orderDetail,
                    this.summaryList
                )

                // ret['product_purchase_price'] = this.orderDetail.reduce(
                //     (total, x) => {
                //         return total + x.product_qty * x.product_purchase_price
                //     },
                //     0
                // )
                if (sm) {
                    for (let i of this.summaryList) {
                        sm[i] = ret[i]
                    }
                } else {
                    ret['id'] = 'summary'
                    ret['index'] = 'summary'

                    this.orderDetail.push(ret)

                    this.$nextTick(() => {
                        let querySelector = 'tr[data-row-key="summary"]'
                        let tr: any = document.querySelector(querySelector)
                        tr.style.background = '#fdfdfd'
                        let checkboxItem: any = tr.querySelector(
                            '.ant-table-selection-column .ant-checkbox-inner'
                        )
                        checkboxItem.style.display = 'none'
                        let span: any = document.createElement('span')
                        span.innerText = '汇总'
                        tr.querySelector('td').appendChild(span)
                    })
                }
            }

            this.form.setFieldsValue(this.order)
            this.selectedRowKeys = []
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcurrency()
        this.getcompany()
        this.getSystemuser()
        this.getVendorFullNameList()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.save_flag == 0) {
            this.editAble = true
        }
        if (this.info) {
            this.updateOrder(this.info)
        }
        if (!this.menu_code) {
            this.menu_code = CommonService.getMenuCode('replenishment-demand')
        }

        this.detailColumns = [
            {
                key: 'default_code',
                title: this.$t('columns.default_code'),
                dataIndex: 'default_code',
                width: 100
            },
            {
                key: 'product_manual_version',
                title: this.$t('columns.product_manual_version'),
                dataIndex: 'product_manual_version',
                width: 100
            },
            {
                key: 'product_manual_code',
                title: this.$t('columns.manual_code'),
                dataIndex: 'product_manual_code',
                width: 100,
                scopedSlots: { customRender: 'manual_code' }
            },
            {
                key: 'specification_version',
                title: this.$t('columns.product_specification_version'),
                dataIndex: 'specification_version',
                width: 100
            },
            {
                key: 'product_specification_code',
                title: this.$t('columns.specification_code'),
                dataIndex: 'product_specification_code',
                width: 100,
                scopedSlots: { customRender: 'specification_code' }
            },
            {
                key: 'product_qty',
                title: this.$t('columns.product_qty'),
                dataIndex: 'product_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'product_purchase_price',
                title: this.$t('columns.product_purchase_price'),
                dataIndex: 'product_purchase_price',
                align: 'right',
                width: 100,
                scopedSlots: { customRender: 'product_purchase_price' }
            },
            {
                key: 'product_purchase_currency',
                title: this.$t('columns.product_purchase_currency'),
                dataIndex: 'product_purchase_currency',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getCurrencyName(value)
                    }
                    return value
                }
            },
            {
                key: 'buyer_change_give_date',
                title: this.$t('columns.buyer_change_give_date'),
                dataIndex: 'buyer_change_give_date',
                width: 100
            },
            {
                key: 'buyer_change_give_date_memo',
                title: this.$t('columns.buyer_change_give_date_memo'),
                dataIndex: 'buyer_change_give_date_memo',
                width: 100
            },
            {
                key: 'date_expected',
                title: this.$t('columns.date_expected'),
                dataIndex: 'date_expected',
                width: 100
            },
            {
                key: 'description_purchase',
                title: this.$t('columns.description_purchase'),
                dataIndex: 'description_purchase',
                ellipsis: true,
                width: 100
            },
            {
                key: 'give_date',
                title: this.$t('columns.give_date'),
                dataIndex: 'give_date',
                width: 100
            },
            {
                key: 'ist_box_qty',
                title: this.$t('columns.ist_box_qty'),
                dataIndex: 'ist_box_qty',
                width: 100,
                align: 'center',
                scopedSlots: { customRender: 'ist_box_qty' }
            },
            {
                key: 'warehouse_id',
                title: this.$t('columns.warehouse_id'),
                dataIndex: 'warehouse_id',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getWarehouseName(value)
                    }
                    return value
                }
            },
            {
                key: 'note',
                title: this.$t('columns.note'),
                dataIndex: 'note',
                width: 100
            },
            {
                key: 'price_subtotal',
                title: this.$t('columns.price_subtotal'),
                dataIndex: 'price_subtotal',
                align: 'right',
                width: 100
            },
            {
                key: 'product_basic_size',
                title: this.$t('columns.product_basic_size'),
                dataIndex: 'product_basic_size',
                width: 100
            },
            {
                key: 'product_color',
                title: this.$t('columns.product_color'),
                dataIndex: 'product_color',
                width: 100
            },
            {
                key: 'product_package_size',
                title: this.$t('columns.product_package_size'),
                dataIndex: 'product_package_size',
                width: 100
            },
            {
                key: 'product_sub_cate',
                title: this.$t('columns.product_sub_cate'),
                dataIndex: 'product_sub_cate',
                width: 100
            },
            {
                key: 'product_uom',
                title: this.$t('columns.product_uom'),
                dataIndex: 'product_uom',
                width: 100
            },
            {
                key: 'product_ve',
                title: this.$t('columns.product_ve'),
                dataIndex: 'product_ve',
                width: 100
            },
            {
                key: 'product_weight',
                title: this.$t('columns.product_weight'),
                dataIndex: 'product_weight',
                align: 'right',
                width: 100
            },
            {
                key: 'product_weight1',
                title: this.$t('columns.product_weight1'),
                dataIndex: 'product_weight1',
                align: 'right',
                width: 100
            },
            {
                key: 'state',
                title: this.$t('columns.state'),
                dataIndex: 'state',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.$t(
                            this.$dict.ReplenishmentState.find(
                                x => x.value == value
                            ).label
                        )
                    }
                    return value
                }
            },
            {
                key: 'user_purchase',
                title: this.$t('columns.user_purchase'),
                dataIndex: 'user_purchase',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getUserName(value)
                    }
                    return value
                }
            },
            {
                key: 'merchandiser',
                title: this.$t('columns.merchandiser'),
                dataIndex: 'merchandiser',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getUserName(value)
                    }
                    return value
                }
            },
            {
                key: 'user_require',
                title: this.$t('columns.user_require'),
                dataIndex: 'user_require',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getUserName(value)
                    }
                    return value
                }
            },
            {
                key: 'vendor_id',
                title: this.$t('columns.vendor_id'),
                dataIndex: 'vendor_id',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return this.getVendorName(value)
                    }
                    return value
                }
            },
            {
                key: 'action',
                title: this.$t('action.action'),
                width: 80,
                fixed: 'right',
                scopedSlots: { customRender: 'action' }
            }
        ]
    }

    private getcurrency() {
        this.innerAction.setActionAPI(
            '/vendor/get_currency_list',
            CommonService.getMenuCode('vendor-product-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.currencyList = data
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

    private updateDetailInfo() {
        this.innerAction.setActionAPI(
            'purchase_management/query_purchase_order_info',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .query(
                new RequestParams(
                    { order_id: this.info[0].id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(data => {
                this.orderDetail = data[0].order_line
            })
    }

    private onSubmit() {
        this.form.validateFields().then((values: any) => {
            values['id'] = this.order.id
            values['save_flag'] = 1
            this.innerAction.setActionAPI(
                'purchase_management/save_purchase_order_info',
                CommonService.getMenuCode('purchase-contract-manage')
            )
            if (values.give_date && typeof values.give_date == 'object') {
                values.give_date = values.give_date
                    .format('YYYY-MM-DD')
                    .toString()
            }
            if (
                values.change_give_date &&
                typeof values.change_give_date == 'object'
            ) {
                values.change_give_date = values.change_give_date
                    .format('YYYY-MM-DD')
                    .toString()
            }
            if (values.order_date && typeof values.order_date == 'object') {
                values.order_date = values.order_date
                    .format('YYYY-MM-DD')
                    .toString()
            }
            let order_lines: any = []
            if (this.orderDetail) {
                order_lines = this.orderDetail.map(x => {
                    return {
                        id: parseInt(x.id),
                        order_date: values.order_date,
                        give_date: values.give_date,
                        buyer_change_give_date: values.change_give_date,
                        buyer_change_give_date_memo:
                            values.change_give_date_memo
                    }
                })
            }
            values['order_lines'] = order_lines
            this.publicService
                .modify(
                    new RequestParams(values, {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    })
                )

                .subscribe(
                    data => {
                        let msg: any = this.$t('tips.save_success')
                        this.$message.success(msg)
                    },
                    err => {
                        this.$message.error(err.message)
                    }
                )
        })
    }

    private editChange() {
        let pageId = 'purchasecontractedit' + this.order.id
        let item = this.commonPageInfo.find(x => x.index == pageId)
        if (item) {
            if (this.editAble) {
                item.edit = 1
            } else {
                item.edit = 0
            }
        }
        this.editAble = !this.editAble
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getVendorName(code) {
        let ret: any = code
        let item = this.vendorFullNameList.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getCurrencyName(code) {
        let ret: any = code
        let item = this.currencyList.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getWarehouseName(code) {
        let ret: any = code
        let item = this.$dict.WarehouseId.find(x => x.value == code)
        if (item) {
            ret = this.$t(item.label)
        }
        return ret
    }

    private onDelete(row) {
        this.innerAction.setActionAPI(
            'purchase_management/delete_purchase_order_line',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_id_list: [row.id] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.orderDetail = this.orderDetail.filter(
                        x => x.id != row.id
                    )
                    //更新缓存
                    let pageId = 'purchasecontractedit' + this.order.id
                    let item = this.commonPageInfo.find(x => x.index == pageId)
                    if (item) {
                        item.info[0].order_line = this.orderDetail
                    }
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onBatchDelete() {
        this.innerAction.setActionAPI(
            'purchase_management/delete_purchase_order_line',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { line_id_list: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
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

    private onSyncProduct() {
        this.innerAction.setActionAPI(
            'purchase_management/sync_purchase_order_product_info',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: [this.order.id] },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.updateDetailInfo()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onChangeGiveDate() {
        this.$modal
            .open(
                ChangeGiveDateForm,
                {},
                {
                    title: this.$t('action.change_give_date')
                }
            )
            .subscribe(
                data => {
                    this.innerAction.setActionAPI(
                        'purchase_management/update_purchase_order_line_give_date',
                        CommonService.getMenuCode('purchase-contract-manage')
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    line_id_list: this.selectedRowKeys,
                                    change_give_date: data.change_give_date,
                                    change_give_date_memo:
                                        data.change_give_date_memo
                                },
                                {
                                    loading: this.loadingService,
                                    innerAction: this.innerAction
                                }
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
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onVerify(state) {
        this.innerAction.setActionAPI(
            'purchase_management/update_purchase_order_state',
            CommonService.getMenuCode('purchase-contract-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { order_id_list: [this.order.id], state: state },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$message.success('操作成功')
                    this.order.state = state
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private verifyWithMemo(state) {
        this.$modal
            .open(
                ModifyMemo,
                {},
                {
                    title: this.$t('action.verify_mome')
                }
            )
            .subscribe(
                data => {
                    this.innerAction.setActionAPI(
                        'purchase_management/update_purchase_order_state',
                        CommonService.getMenuCode('purchase-contract-manage')
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    order_id_list: [this.order.id],
                                    state: state,
                                    approve_memo: data
                                },
                                {
                                    loading: this.loadingService,
                                    innerAction: this.innerAction
                                }
                            )
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                                this.order.state = state
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onFormChange(e, field) {
        let value: any = ''
        let key = ''
        if (field == 'give_date') {
            key = 'give_date'
            value = e.format('YYYY-MM-DD').toString()
        } else if (field == 'change_give_date') {
            key = 'buyer_change_give_date'
            value = e.format('YYYY-MM-DD').toString()
        } else if (field == 'change_give_date_memo') {
            key = 'buyer_change_give_date_memo'
            value = e.target.value
        }

        this.orderDetail.map(x => {
            x[key] = value
        })
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "columns": {
            "amount_total": "amount_total",
            "approve_memo": "approve_memo",
            "approved_user": "approved_user",
            "change_give_date": "change_give_date",
            "change_give_date_memo": "change_give_date_memo",
            "end_order_number": "end_order_number",
            "give_date": "give_date",
            "make_user": "make_user",
            "merchandiser": "merchandiser",
            "name": "name",
            "order_company_id": "order_company_id",
            "order_date": "order_date",
            "percent": "percent",
            "user_purchase": "user_purchase",
            "vendor_id": "vendor_id",
            "alerts": "alerts",
            "buyer_change_give_date": "buyer_change_give_date",
            "buyer_change_give_date_memo": "buyer_change_give_date_memo",
            "date_expected": "date_expected",
            "default_code": "default_code",
            "description_purchase": "description_purchase",
            "give_date": "give_date",
            "id": "id",
            "ist_box_qty": "ist_box_qty",
            "merchandiser": "merchandiser",
            "note": "note",
            "price_subtotal": "price_subtotal",
            "product_basic_size": "product_basic_size",
            "product_color": "product_color",
            "product_id": "product_id",
            "product_manual_code": "product_manual_code",
            "product_manual_url": "product_manual_url",
            "product_manual_version": "product_manual_version",
            "product_package_size": "product_package_size",
            "product_purchase_currency": "product_purchase_currency",
            "product_purchase_price": "product_purchase_price",
            "product_qty": "product_qty",
            "product_specification_url": "product_specification_url",
            "product_specification_version": "product_specification_version",
            "product_sub_cate": "product_sub_cate",
            "product_uom": "product_uom",
            "product_ve": "product_ve",
            "product_weight": "product_weight",
            "product_weight1": "product_weight1",
            "req_id": "req_id",
            "state": "state",
            "user_purchase": "user_purchase",
            "user_require": "user_require",
            "vendor_id": "vendor_id",
            "warehouse_id": "Warehouse",
            "specification_code": "Specification Code",
            "manual_code": "Manual Code"
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
            "save": "Save",
            "sync_product_info": "Synchronize Product",
            "change_give_date": "Change Give Date",
            "verify": "Verify",
            "reset": "Reset",
            "confirm": "Confirm",
            "refuse": "Refuse",
            "verify_mome": "Memo"
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
        "desc": "这是订单页面1",
        "columns": {
            "amount_total": "amount_total",
            "approve_memo": "审批意见",
            "approved_user": "审批人",
            "change_give_date": "变更交期",
            "change_give_date_memo": "变更交期说明",
            "end_order_number": "单据编号",
            "give_date": "合同交期",
            "make_user": "制单员",
            "merchandiser": "跟单员",
            "name": "需求编号",
            "order_company_id": "公司",
            "order_date": "订单日期",
            "percent": "percent",
            "source_doc1": "实际采购合同号",
            "user_purchase": "采购员",
            "vendor_id": "供应商",
            "alerts": "alerts",
            "buyer_change_give_date": "采购变更交期",
            "buyer_change_give_date_memo": "采购变更交期备注",
            "date_expected": "期望入库",
            "default_code": "货号",
            "description_purchase": "采购描述",
            "give_date": "合同交期",
            "id": "id",
            "ist_box_qty": "是否箱数",
            "merchandiser": "跟单员",
            "note": "备注",
            "price_subtotal": "价格汇总",
            "product_basic_size": "产品基础尺寸",
            "product_color": "产品颜色",
            "product_id": "产品",
            "product_manual_code": "说明书编号",
            "product_manual_url": "说明书url",
            "product_manual_version": "说明书版本号",
            "product_package_size": "包裹尺寸",
            "product_purchase_currency": "币种",
            "product_purchase_price": "采购价",
            "product_qty": "产品数量",
            "product_specification_url": "工艺单地址",
            "product_specification_version": "工艺单版本号",
            "product_sub_cate": "产品子分类",
            "product_uom": "产品计量单位",
            "product_ve": "装箱率",
            "product_weight": "净重",
            "product_weight1": "毛重",
            "req_id": "需求ID",
            "state": "状态",
            "user_purchase": "采购员",
            "user_require": "需求人",
            "vendor_id": "供应商",
            "warehouse_id": "仓库",
            "specification_code": "工艺单编号",
            "manual_code": "说明书编号"
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
            "save": "保存",
            "sync_product_info": "同步产品信息",
            "change_give_date": "修改采购交期",
            "verify": "审核",
            "reset": "重置",
            "confirm": "确认",
            "refuse": "确认拒绝",
            "verify_mome": "备注"
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
