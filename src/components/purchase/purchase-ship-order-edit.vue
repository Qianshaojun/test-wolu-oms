<template>
    <section class="component edit-customer">
        <a-card class="margin-y" style="margin:0 !important">
            <div
                style="padding:0 20px 10px 20px;;min-height:40px;display:inline-block;"
            >
                <a-button
                    @click="editChange"
                    type="default"
                    size="small"
                    v-if="order.id && order.state == 'draft'"
                    ><span v-if="!editAble">{{ $t('action.edit') }}</span
                    ><span v-else>{{ $t('action.discard') }}</span>
                </a-button>
                <a-button
                    type="primary"
                    v-if="editAble"
                    @click="onSubmit()"
                    style="margin-left:5px;"
                    size="small"
                    >{{ $t('action.save') }}</a-button
                >
                <a-button
                    @click="onVerify('approved')"
                    v-if="order.id && order.state == 'confirm'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.verify') }}
                </a-button>
                <a-button
                    @click="onVerify('draft')"
                    v-if="order.id && order.state == 'confirm'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.reset') }}
                </a-button>
                <a-button
                    @click="onVerify('confirm')"
                    v-if="order.id && order.state == 'draft'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.confirm') }}
                </a-button>
                <!-- <a-button
                    @click="onVerify('cancel')"
                    v-if="
                        order.id &&
                            (order.state == 'confirm' || order.state == 'draft')
                    "
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.cancel') }}
                </a-button>
                <a-button
                    @click="verifyWithMemo('refuse')"
                    v-if="order.id && order.state == 'confirm'"
                    style="margin-left:5px;"
                    size="small"
                >
                    {{ $t('action.refuse') }}
                </a-button> -->
                <div style="position:absolute;top:10px;right:10px;">
                    <div class="progress-bar">
                        <li
                            :value="item.value"
                            v-for="item of $dict.PurchaseShipOrderState"
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
                    class="data-form"
                    layout="inline"
                    :form="form"
                    :labelCol="{ span: 6 }"
                    :wrapperCol="{ span: 16, offset: 2 }"
                >
                    <a-card class="margin-top order-edit-page">
                        <a-row :gutter="24">
                            <a-col :span="12" v-show="save_flag">
                                <a-form-item :label="$t('columns.name')">
                                    <a-input
                                        v-decorator="[`name`]"
                                        size="small"
                                        style="width: 200px;"
                                        disabled
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.source_doc')"
                                    required
                                >
                                    <a-input
                                        v-decorator="[
                                            `source_doc`,
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
                                        show-search
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
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.order_date')"
                                    required
                                >
                                    <a-date-picker
                                        :disabled="!editAble"
                                        v-decorator="[
                                            `order_date`,
                                            {
                                                rules: rules.required
                                            }
                                        ]"
                                        format="YYYY-MM-DD"
                                        size="small"
                                        style="width: 200px;"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    :label="$t('columns.actual_give_date_memo')"
                                >
                                    <a-textarea
                                        :disabled="!editAble"
                                        rows="1"
                                        v-decorator="[`actual_give_date_memo`]"
                                        size="small"
                                    >
                                    </a-textarea>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item :label="$t('columns.make_user')">
                                    <a-select
                                        v-decorator="[`make_user`]"
                                        style="width: 300px"
                                        size="small"
                                        disabled
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                            <a-col :span="12" v-show="save_flag">
                                <a-form-item
                                    :label="$t('columns.approved_user')"
                                >
                                    <a-select
                                        v-decorator="[`approved_user`]"
                                        style="width: 300px"
                                        size="small"
                                        disabled
                                    >
                                        <a-select-option
                                            :value="item.code"
                                            v-for="item of systemUsers"
                                            :key="item.code"
                                        >
                                            {{ item.name }}
                                        </a-select-option>
                                    </a-select>
                                </a-form-item>
                            </a-col>
                        </a-row>
                    </a-card>
                </a-form>
                <a-card class="margin-top">
                    <div
                        style="margin:10px;"
                        v-if="this.order.state == 'draft'"
                    >
                        <a-button @click="importInfo">
                            {{ $t('action.import') }}
                        </a-button>
                    </div>
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
                        :scroll="{ x: 3000, y: 600 }"
                        bordered
                    >
                        <template slot="product_volume" slot-scope="text, row">
                            <span v-if="row.id != 'summary'">{{
                                text / 1000000
                            }}</span>
                            <span v-else>{{ text }}</span>
                        </template>
                        <template slot="check_render" slot-scope="text"
                            ><a-checkbox disabled :checked="text" />
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
            </section>
        </a-card>
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
import UploadExcel from '@/shared/common/upload-excel.vue'
import ModifyMemo from '@/components/cs_email_return/chat-modify-memo.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')
const userModule = namespace('userModule')

@Component({
    components: {}
})
export default class PurchaseShipOrderEdit extends Vue {
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
    private order: any = {}

    private orderDetail: any[] = []

    private save_flag: any = 0

    private originData: any = []

    private isShowDetail: any = false //是否只是详情展示

    private menu_code: any = ''

    private editAble: any = false

    private detailColumns: any = []
    private selectedRowKeys: any = []
    private summaryList: any = [
        'box_qty',
        'pack_qty',
        'product_qty',
        'product_volume'
    ]

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @pageParamsModule.State
    shipContractParams

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
    onShipContractParamsChange() {
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
            this.orderDetail = this.order.order_lines.map(x => {
                return x
            })

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
                if (sm) {
                    for (let i of this.summaryList) {
                        sm[i] = ret[i]
                    }
                } else {
                    ret['id'] = 'summary'
                    ret['index'] = 'summary'

                    if (ret.product_volume) {
                        ret.product_volume = this.originData[0].product_volume
                    }
                    this.orderDetail.push(ret)

                    this.$nextTick(() => {
                        let querySelector = 'tr[data-row-key="summary"]'
                        let tr: any = document.querySelector(querySelector)
                        tr.style.background = '#fdfdfd'
                    })
                }
            }

            this.selectedRowKeys = []
        })
    }

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    private created() {
        this.getcompany()
        this.getSystemuser()
        this.getVendorFullNameList()
        this.form = this.$form.createForm(this)
    }

    private mounted() {
        if (this.save_flag == 0) {
            this.editAble = true
        }
        this.order.state = 'draft'
        if (this.info.length) {
            this.form.setFieldsValue(this.info[0])
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
                key: 'warehouse_id',
                title: this.$t('columns.warehouse_id'),
                dataIndex: 'warehouse_id',
                width: 100
            },
            {
                key: 'box_qty',
                title: this.$t('columns.box_qty'),
                dataIndex: 'box_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'container_group',
                title: this.$t('columns.container_group'),
                dataIndex: 'container_group',
                width: 100
            },
            {
                key: 'pack_qty',
                title: this.$t('columns.pack_qty'),
                dataIndex: 'pack_qty',
                align: 'right',
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
                key: 'price_unit',
                title: this.$t('columns.price_unit'),
                dataIndex: 'price_unit',
                align: 'center',
                width: 100,
                customRender: (value, row, index) => {
                    if (value) {
                        return row.id && row.id != 'summary' ? 'Units' : ''
                    }
                    return row.id && row.id != 'summary' ? 'Units' : ''
                }
            },
            {
                key: 'prod_name',
                title: this.$t('columns.prod_name'),
                dataIndex: 'prod_name',
                width: 200
            },
            {
                key: 'z_category',
                title: this.$t('columns.product_cate'),
                dataIndex: 'z_category',
                width: 100
            },
            {
                key: 'product_qty',
                title: this.$t('columns.product_qty'),
                dataIndex: 'product_qty',
                align: 'right',
                width: 100
            },
            {
                key: 'product_volume',
                title: this.$t('columns.product_volume'),
                dataIndex: 'product_volume',
                align: 'right',
                width: 100,
                scopedSlots: { customRender: 'product_volume' }
            },
            {
                key: 'product_weight',
                title: this.$t('columns.product_weight'),
                dataIndex: 'product_weight',
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
                        let item = this.$dict.ReplenishmentState.find(
                            x => x.value == value
                        )
                        return item ? this.$t(item.label) : value
                    }
                    return value
                }
            },
            {
                key: 'actual_give_date',
                title: this.$t('columns.actual_give_date'),
                dataIndex: 'actual_give_date',
                width: 100
            },
            {
                key: 'actual_give_date_memo',
                title: this.$t('columns.actual_give_date_memo'),
                dataIndex: 'actual_give_date_memo',
                width: 100
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
                key: 'width',
                title: this.$t('columns.width'),
                dataIndex: 'width',
                align: 'right',
                width: 100
            },
            {
                key: 'currency_unit',
                title: this.$t('columns.currency_unit'),
                dataIndex: 'currency_unit',
                width: 100
            },
            {
                key: 'gewicht',
                title: this.$t('columns.gewicht'),
                dataIndex: 'gewicht',
                align: 'right',
                width: 100
            },
            {
                key: 'height',
                title: this.$t('columns.height'),
                dataIndex: 'height',
                align: 'right',
                width: 100
            },
            {
                key: 'is_fba',
                title: this.$t('columns.is_fba'),
                dataIndex: 'is_fba',
                width: 100
            },
            {
                key: 'length',
                title: this.$t('columns.length'),
                dataIndex: 'length',
                align: 'right',
                width: 100
            },
            {
                key: 'name',
                title: this.$t('columns.name'),
                dataIndex: 'name',
                width: 100
            },
            {
                key: 'note',
                title: this.$t('columns.note'),
                dataIndex: 'note',
                width: 100
            },
            {
                key: 'out_number',
                title: this.$t('columns.out_number'),
                dataIndex: 'out_number',
                align: 'right',
                width: 100
            },
            {
                key: 'is_change_sku',
                title: this.$t('columns.is_change_sku'),
                dataIndex: 'is_change_sku',
                align: 'center',
                width: 80,
                scopedSlots: { customRender: 'check_render' }
            },
            {
                key: 'change_no',
                title: this.$t('columns.change_no'),
                dataIndex: 'change_no',
                align: 'left',
                width: 120
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

    public setFormValues() {
        let vl = this.form.getFieldsValue()
        vl.give_date = '2020-01-01'
        this.form.setFieldsValue(this.order)
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onSubmit() {
        this.form.validateFields({}, (err, values) => {
            if (!err) {
                if (this.save_flag) {
                    values['id'] = this.order.id
                    values['save_flag'] = 1
                } else {
                    values['id'] = 0
                    values['save_flag'] = 0
                }

                if (values.give_date) {
                    values.give_date = moment(values.give_date).format(
                        'YYYY-MM-DD'
                    )
                }
                if (values.order_date) {
                    values.order_date = moment(values.order_date).format(
                        'YYYY-MM-DD'
                    )
                }
                this.innerAction.setActionAPI(
                    'ship_order/save_ship_order',
                    CommonService.getMenuCode('purchase-ship-order')
                )
                this.publicService
                    .modify(
                        new RequestParams(values, {
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )

                    .subscribe(
                        data => {
                            this.order['id'] = data.message.order_id
                            this.save_flag = 1
                            this.order['name'] = data.message.order_name
                            this.setFormValues()
                            let msg: any = this.$t('tips.save_success')
                            this.$message.success(msg)
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private editChange() {
        this.editAble = !this.editAble
        let pageId = 'purchaseshiporderedit' + this.order.id
        let item = this.commonPageInfo.find(x => x.index == pageId)
        if (item) {
            if (this.editAble) {
                item.edit = 1
            } else {
                item.edit = 0
            }
        }
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

    private onDelete(row) {
        this.innerAction.setActionAPI(
            'ship_order/delete_ship_order_items',
            CommonService.getMenuCode('purchase-ship-order')
        )
        this.publicService
            .modify(
                new RequestParams(
                    { ids: [row.id] },
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
                    let pageId = 'purchaseshiporderedit' + this.order.id
                    let item = this.commonPageInfo.find(x => x.index == pageId)
                    if (item) {
                        item.info[0].order_lines = this.orderDetail
                    }
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

    private importInfo() {
        if (!this.order.id) {
            this.$message.success(
                'Please save first then upload product information.'
            )
            return
        }

        this.form.validateFields({}, (err, values) => {
            if (!err) {
                values['id'] = this.order.id

                let param: any = {}
                for (let i in values) {
                    if (values[i]) {
                        if (values[i]._isAMomentObject) {
                            values[i] = values[i].format('YYYY-MM-DD')
                        }
                        param[i] = values[i]
                    }
                }
                param['save_flag'] = this.save_flag

                this.$modal
                    .open(
                        UploadExcel,
                        {
                            urlPath:
                                '/system_api/upload?inner_action=ship_order/upload_ship_order_items&menu_code=' +
                                CommonService.getMenuCode(
                                    'purchase-ship-order'
                                ),
                            uploadParams: { ship_order: JSON.stringify(param) },
                            attachmentUrlPath:
                                '/system/download_import_template?type=ShipOrderImport'
                        },
                        {
                            title: 'Import',
                            width: '1000px'
                        }
                    )
                    .subscribe(
                        data => {
                            this.$message.success('操作成功')
                            if (data.message.create_msg) {
                                this.$message.warning(data.message.create_msg)
                            }
                            this.refreshLline()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onVerify(state) {
        if (state == 'confirm' && this.order.state == 'draft') {
            if (this.orderDetail.length < 1) {
                this.$message.error('明细行不能为空')
                return
            }
        }
        this.innerAction.setActionAPI(
            'ship_order/change_ship_order_state',
            CommonService.getMenuCode('purchase-ship-order')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        order_ids: [this.order.id],
                        old_state: this.order.state,
                        new_state: state
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
                        'ship_order/change_ship_order_state',
                        CommonService.getMenuCode('purchase-ship-order')
                    )
                    this.publicService
                        .modify(
                            new RequestParams(
                                {
                                    order_ids: [this.order.id],
                                    old_state: this.order.state,
                                    new_state: state,
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

    private refreshLline() {
        this.innerAction.setActionAPI(
            'ship_order/query_one_ship_orders',
            CommonService.getMenuCode('purchase-ship-order')
        )
        this.publicService
            .query(
                new RequestParams(
                    { order_id: this.order.id },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    if (data[0].order_lines.length) {
                        for (let i in data[0].order_lines) {
                            this.orderDetail.push(data[0].order_lines[i])
                        }
                    }
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
    "desc": "this is a Order Page1",
    "columns":{
        "actual_give_date":"Actual Give Date",
        "actual_give_date_memo":"Actual Give Date Memo",
        "box_qty":"Box Qty",
        "container_group":"Container Group",
        "currency_unit":"Currency Unit",
        "default_code":"Default Code",
        "gewicht":"Gewicht",
        "height":"Height",
        "id":"Id",
        "is_fba":"Is Fba",
        "length":"Length",
        "name":"Name",
        "note":"Note",
        "out_number":"Out Number",
        "pack_qty":"Pack Qty",
        "price_subtotal":"Price Subtotal",
        "price_unit":"Price Unit",
        "prod_name":"Prod Name",
        "product_cate":"Product Cate",
        "product_qty":"Product Qty",
        "product_volume":"Product Volume(m³)",
        "product_weight":"Product Weight",
        "state":"State",
        "user_purchase":"User Purchase",
        "warehouse_id":"Warehouse Id",
        "width":"Width",
        "warehouse_id":"warehouse_id",
        "source_doc":"Source Doc",
        "give_date":"Give Date",
        "vendor_id":"vendor",
        "order_date":"Order Date",
        "make_user":"Make User",
        "approved_user":"Approved User",
        "is_change_sku":"Is Change SKU",
        "change_no":"Change No."
    },
    "action":{
      "order_detail":"Order Detail",
      "other_form":"Other Form",
      "edit":"Edit",
      "delete":"Delete",
      "ok":"Yes",
      "cancel":"Cancel",
      "more":"More",
      "confirm_order":"Confirm Order",
      "cancel_order":"Cancel Order",
      "create_invovice":"Create Invovice",
      "detail":"Detail",
      "today":"Today",
      "yestoday":"Yestoday",
      "3day":"3 Day",
      "send_email":"Send Email",
      "refund":"Refund Supplement Wizard",
      "modify_cp":"Modify CP",
      "order_detail":"Order Detail",
      "other_info":"Other Info",
      "save":"Save",
      "sync_product_info":"Synchronize Product",
      "change_give_date":"Change Give Date",
      "import":"Import",
      "verify":"Verify",
      "reset":"Reset",
      "confirm":"Confirm",
      "refuse":"Refuse",
      "verify_mome":"Memo"
    },
    "rules":{
       "date_range_error":"start date can't later start date"
    },
    "delete":"Are you sure delete?",
    "fuzzy_search":"Fuzzy Search",
    "save_success": "Save Success",
    "delete_success":"Delete Success"
  },
  "zh-cn": {
    "desc": "这是订单页面1",
    "columns":{
        "actual_give_date":"实际交期",
        "actual_give_date_memo":"实际交期说明",
        "box_qty":"箱数",
        "container_group":"Container Group",
        "currency_unit":"币种",
        "default_code":"货号",
        "gewicht":"毛重",
        "height":"高",
        "id":"Id",
        "is_fba":"是否Fba",
        "length":"长",
        "name":"Name",
        "note":"Note",
        "out_number":"Out Number",
        "pack_qty":"Pack Qty",
        "price_subtotal":"Price Subtotal",
        "price_unit":"Price Unit",
        "prod_name":"产品名称",
        "product_cate":"产品分类",
        "product_qty":"产品数量",
        "product_volume":"产品体积(m³)",
        "product_weight":"产品宽度",
        "state":"状态",
        "user_purchase":"采购员",
        "warehouse_id":"仓库",
        "width":"宽",
         "warehouse_id":"仓库",
        "source_doc":"实际发货合同号",
        "give_date":"合同交期",
        "vendor_id":"供应商",
        "order_date":"订单日期",
        "make_user":"制单员",
        "approved_user":"审核人",
        "is_change_sku":"是否变更SKU",
        "change_no":"变更单号"
    },
    "action":{
      "order_detail":"订单详情",
      "other_form":"其它信息",
      "edit":"编辑",
      "delete":"删除",
      "ok":"确定",
      "cancel":"取消",
      "more":"更多操作",
      "confirm_order":"确认订单",
      "cancel_order":"取消订单",
      "create_invovice":"创建发票",
      "detail":"详情",
      "today":"前一天",
      "yestoday":"前两天",
      "3day":"前三天",
      "send_email":"发送邮件",
      "refund":"退款管理",
      "modify_cp":"修改CP",
      "order_detail":"订单明细",
      "other_info":"其它信息",
      "save":"保存",
      "sync_product_info":"同步产品信息",
      "change_give_date":"修改采购交期",
      "import":"导入",
      "verify":"审核",
      "reset":"重置",
      "confirm":"确认",
      "refuse":"确认拒绝",
      "verify_mome":"备注"
    },
    "rules":{
      "date_range_error":"开始日期不能大于结束日期"
    },
    "delete":"是否确认删除?",
    "fuzzy_search":"模糊搜索",
    "save_success": "操作成功",
    "delete_success":"删除成功"
  }
}
</i18n>
