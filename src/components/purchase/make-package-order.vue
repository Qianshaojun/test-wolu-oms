<template>
    <section class="component order-base-detail">
        <a-card class=" order-edit-page">
            <a-form
                :form="form"
                :labelCol="{ span: 7 }"
                :wrapperCol="{ span: 16, offset: 1 }"
                class="customForm"
            >
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('ship_date')" required>
                            <a-date-picker
                                v-decorator="[
                                    `ship_date`,
                                    {
                                        initialValue: moment(Date.now())
                                    },
                                    {
                                        rule: rules.required
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('document_date')">
                            <a-date-picker
                                v-decorator="[
                                    `doc_date`,
                                    {
                                        initialValue: moment(Date.now())
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('eta_date')" required>
                            <a-date-picker
                                v-decorator="[
                                    `land_date`,
                                    {
                                        initialValue: moment(Date.now())
                                    },
                                    {
                                        rule: rules.required
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('receive_date')">
                            <a-date-picker
                                v-decorator="[
                                    `recv_date`,
                                    {
                                        initialValue: moment(Date.now())
                                    }
                                ]"
                                format="YYYY-MM-DD"
                                size="small"
                                style="width: 200px;"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('ref_no')" required>
                            <a-input
                                v-decorator="[
                                    `source_doc1`,
                                    {
                                        rule: rules.required
                                    }
                                ]"
                                :placeholder="$t('plzInput')"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('boat_company')" required>
                            <a-input
                                v-decorator="[
                                    `carrier_name`,
                                    {
                                        rule: rules.required
                                    }
                                ]"
                                :placeholder="$t('plzInput')"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('company_id')" required>
                            <a-select
                                showSearch
                                v-decorator="[
                                    'company_name',
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                size="small"
                                :placeholder="$t('plzSelect')"
                            >
                                <a-select-option value="woltu" key="woltu">
                                    Woltu
                                </a-select-option>
                                <a-select-option value="eugad" key="eugad">
                                    EUGAD
                                </a-select-option>
                                <a-select-option value="situ" key="situ">
                                    Situ
                                </a-select-option>
                                <a-select-option value="elight" key="elight">
                                    Elight
                                </a-select-option>
                                <a-select-option value="wowo" key="wowo">
                                    Wowo
                                </a-select-option>
                                <a-select-option
                                    value="meteorsrain"
                                    key="meteorsrain"
                                >
                                    Meteorsrain
                                </a-select-option>
                                <a-select-option
                                    value="brichimon"
                                    key="brichimon"
                                >
                                    BRICHIMON LIMITED
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('bl_mode')" required>
                            <a-select
                                showSearch
                                v-decorator="[
                                    'bl_xingshi',
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                size="small"
                                :placeholder="$t('plzSelect')"
                            >
                                <a-select-option value="zs" key="zs">
                                    OBL
                                </a-select-option>
                                <a-select-option value="df" key="df">
                                    TR
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('ship_company_id')">
                            <a-select
                                showSearch
                                v-decorator="['ship_company_id']"
                                :style="{
                                    width: '100%'
                                }"
                                size="small"
                                :placeholder="$t('plzSelect')"
                            >
                                <a-select-option value="tnt" key="tnt">
                                    TNT
                                </a-select-option>
                                <a-select-option value="dhl" key="dhl">
                                    DHL
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12" required>
                        <a-form-item :label="$t('bl_no')">
                            <a-input
                                v-decorator="[
                                    `bl_code`,
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                size="small"
                                :placeholder="$t('plzInput')"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12">
                        <a-form-item :label="$t('shipment_no')">
                            <a-input
                                v-decorator="[`shipment_no`]"
                                size="small"
                                :placeholder="$t('plzInput')"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('port_of_origin')" required>
                            <a-input
                                v-decorator="[
                                    `port_start`,
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                :placeholder="$t('plzInput')"
                                size="small"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row>
                    <a-col :span="12" class="height35">
                        <a-form-item :label="$t('batch_create')">
                            <a-checkbox
                                v-decorator="[
                                    `batch_create`,
                                    { initialValue: false }
                                ]"
                                v-model="batchCreate"
                            />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item :label="$t('port_of_arrival')" required>
                            <a-select
                                showSearch
                                v-decorator="[
                                    'port_end',
                                    {
                                        rules: rules.required
                                    }
                                ]"
                                size="small"
                                :placeholder="$t('plzSelect')"
                            >
                                <a-select-option value="Felix" key="Felix">
                                    Felix
                                </a-select-option>
                                <a-select-option
                                    value="Rotterdam"
                                    key="Rotterdam"
                                >
                                    Rotterdam
                                </a-select-option>
                                <a-select-option
                                    value="southampton"
                                    key="southampton"
                                >
                                    SOUTHAMPTON
                                </a-select-option>

                                <a-select-option
                                    value="Duisburg"
                                    key="Duisburg"
                                >
                                    Duisburg
                                </a-select-option>

                                <a-select-option value="Neuss" key="Neuss">
                                    Neuss
                                </a-select-option>
                                <a-select-option
                                    value="longBeach"
                                    key="longBeach"
                                >
                                    Long Beach
                                </a-select-option>
                                <a-select-option
                                    value="losAngeles"
                                    key="losAngeles"
                                >
                                    Los Angeles
                                </a-select-option>
                            </a-select>
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
            <p style="margin:3px;color:red;">
                选择批量创建会根据Container Group(1000除外)不同批量创建货柜
            </p>
        </a-card>
        <a-card class="margin-top">
            <p>
                Container Group:
                <a-input
                    v-decorator="['group']"
                    v-model="container_group"
                    size="small"
                    style="width:200px;"
                    ref="group"
                    :placeholder="$t('plzInput')"
                />
                <a-button
                    type="primary"
                    size="small"
                    style="margin-left:3px;"
                    @click="getLinesByGroup"
                    >Search
                </a-button>
            </p>
            <a-table
                :dataSource="data"
                :pagination="false"
                rowKey="id"
                :columns="detailColumns"
                style="table-layout:fixed;"
                :scroll="{ x: 900, y: 300 }"
            >
                <template slot="product_qty" slot-scope="row">
                    <a-input-number
                        v-decorator="[`product_qty`]"
                        :value="row.product_qty"
                        size="small"
                        @change="e => onRowChange(row, 'product_qty', e)"
                        :style="{
                            width: '100%',
                            background: '#ecc5e9'
                        }"
                    />
                </template>
                <template slot="is_change_sku" slot-scope="row">
                    <a-checkbox
                        v-decorator="[`is_change_sku`]"
                        :checked="row.is_change_sku"
                        size="small"
                        @change="
                            e =>
                                onRowChange(
                                    row,
                                    'is_change_sku',
                                    e.target.checked
                                )
                        "
                    />
                </template>
                <template slot="package_code" slot-scope="row">
                    <a-input
                        v-model="row.package_code"
                        size="small"
                        :style="{
                            width: '100%',
                            background: '#ecc5e9'
                        }"
                    />
                </template>
                <template slot="box_qty" slot-scope="row">
                    <a-input-number
                        v-decorator="[`box_qty`]"
                        :value="row.box_qty"
                        size="small"
                        @change="e => onRowChange(row, 'box_qty', e)"
                        :style="{
                            width: '100%'
                        }"
                    />
                </template>
                <!--                <template slot="package_qty" slot-scope="row">-->
                <!--                    <a-input-number-->
                <!--                        v-decorator="[`package_qty`]"-->
                <!--                        :value="row.package_qty"-->
                <!--                        size="small"-->
                <!--                        @change="e => onRowChange(row, 'package_qty', e)"-->
                <!--                        :style="{-->
                <!--                            width: '100%'-->
                <!--                        }"-->
                <!--                    />-->
                <!--                </template>-->
                <template slot="container_group" slot-scope="row">
                    <a-input
                        v-decorator="[`container_group`]"
                        :value="row.container_group"
                        size="small"
                        @change="e => onRowChange(row, 'container_group', e)"
                        :style="{
                            width: '100%'
                        }"
                    />
                </template>
                <template slot="action" slot-scope="row">
                    <a-popconfirm
                        :title="$t('delete')"
                        :okText="$t('action.ok')"
                        :cancelText="$t('action.cancel')"
                        placement="left"
                        @confirm="onDel(row)"
                    >
                        <a class="btnDel">
                            <a-icon type="delete" />
                        </a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-card>

        <div class="flex-row justify-content-end" style="margin-top: 20px">
            <a-button class="margin-right" @click="cancel"
                >{{ $t('action.cancel') }}
            </a-button>
            <a-button type="primary" @click="onSubmit"
                >{{ $t('action.submit') }}
            </a-button>
        </div>
    </section>
</template>

<style lang="less">
.ant-select-auto-complete.ant-select-sm .ant-input {
    background-color: #ecc5e9;
}

.height35 {
    height: 35px;
}

.required .ant-calendar-picker-input,
.required .ant-select-selection--single {
    background-color: #ecc5e9;
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch, Emit } from 'vue-property-decorator'
import { ProductService } from '@/services/product.service'
import { RequestParams } from '@/core/http'
import { CommonService } from '@/shared/utils/common.service'
import { formConfig } from '@/config/form.config'
import SearchProduct from '@/components/product/search-product.vue'
import { PickingService } from '../../services/picking.service'
import { LoadingService } from '@/bootstrap/services/loading.service'
import UUID from 'uuidjs'
import moment from 'moment'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'

@Component({
    components: {}
})
export default class MakePackageOrder extends Vue {
    @Emit('modal.submit')
    private submit() {
        return true
    }

    @Emit('modal.cancel')
    private cancel() {
        return
    }

    @Prop()
    lines: any

    @Prop()
    ids: any

    private form: any

    private currentRow: any = ''

    private editable: any = true

    private data: any[] = []

    private skuSource: any[] = []

    private skuQueryResult: any[] = []

    private productService = new ProductService()

    private pickingService = new PickingService()

    private loadingService = new LoadingService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    private operateCnt: any = 0

    private giveDate: any = null

    private batchCreate: any = false

    private detailColumns: any = []

    private currentLi: any = ''

    private moment = moment

    private selectedRowKeys: any = []

    private container_group: any = ''

    private rules = {
        required: [{ required: true, message: '必填项' }]
    }

    public created() {
        this.form = this.$form.createForm(this)
    }

    public setFormValues() {
        this.form.setFieldsValue(this.data)
    }

    private mounted() {
        this.detailColumns = [
            {
                key: 'prod_name',
                title: this.$t('columns.prod_name'),
                dataIndex: 'prod_name',
                width: 150
            },
            {
                key: 'out_number',
                title: this.$t('columns.out_number'),
                dataIndex: 'out_number',
                width: 100
            },
            {
                key: 'product_qty',
                title: this.$t('columns.product_qty'),
                width: 90,
                scopedSlots: { customRender: 'product_qty' }
            },
            {
                key: 'package_code',
                title: this.$t('columns.package_code'),
                width: 80,
                scopedSlots: { customRender: 'package_code' }
            },
            {
                key: 'name',
                title: this.$t('columns.name'),
                dataIndex: 'order2_name',
                width: 85
            },
            {
                key: 'box_qty',
                title: this.$t('columns.box_qty'),
                width: 70,
                scopedSlots: { customRender: 'box_qty' }
            },
            {
                key: 'note',
                title: this.$t('columns.note'),
                dataIndex: 'note',
                width: 90
            },
            {
                key: 'is_change_sku',
                title: this.$t('columns.is_change_sku'),
                width: 70,
                scopedSlots: { customRender: 'is_change_sku' }
            },
            {
                key: 'package_qty',
                title: this.$t('columns.package_qty'),
                width: 90,
                dataIndex: 'package_qty',
                scopedSlots: { customRender: 'package_qty' }
            },
            {
                key: 'container_group',
                title: this.$t('columns.container_group'),
                width: 70,
                scopedSlots: { customRender: 'container_group' }
            },
            {
                key: 'warehouse_id',
                title: this.$t('columns.warehouse_id'),
                dataIndex: 'warehouse_id',
                width: 80
            },
            {
                key: 'action',
                title: this.$t('columns.action'),
                width: 40,
                scopedSlots: { customRender: 'action' }
            }
        ]
        if (this.lines) {
            this.data = this.lines.map(x => {
                x['is_change_sku'] = false
                return x
            })
            this.setFormValues()
        }
    }

    @Watch('lines')
    private onLinesChange() {
        if (this.lines) {
            this.data = this.lines.map(x => {
                x['is_change_sku'] = false
                return x
            })
            this.setFormValues()
        }
    }

    private onRowChange(row, column, value) {
        if (
            Object.prototype.toString.call(value) === '[object InputEvent]' ||
            Object.prototype.toString.call(value) === '[object Event]' ||
            Object.prototype.toString.call(value) === '[object Object]'
        ) {
            if (value.target != undefined && value.target.value != undefined) {
                row[column] = value.target.value
            } else {
                row[column] = value
            }
        } else {
            row[column] = value
        }

        if (column == 'package_code') {
            this.data
                .filter(x => x.container_group == row.container_group)
                .map(y => {
                    y.package_code = value.target.value
                })
        }
    }

    private onDel(row) {
        if (this.currentRow == row.id) {
            this.currentRow = -1
        }

        this.data = this.data.filter(x => x.id != row.id)
    }

    private onSubmit() {
        //save

        this.form.validateFields({}, (err, values) => {
            if (!err) {
                if (!this.data.length) {
                    this.$message.error('至少添加一条明细信息')
                    return false
                }
                for (let i in this.data) {
                    if (!this.data[i].product_qty) {
                        this.$message.error('请输入product_qty')
                        return
                    }
                    if (!this.data[i].package_code) {
                        this.$message.error(
                            '请先完善明细中的信息,深色背景为必填项'
                        )
                        this.currentLi = this.data[i].id
                        return false
                    }
                }
                values['package_lines'] = this.data.map(x => {
                    return {
                        order2_id: x.order2_id,
                        product_id: x.product_id,
                        warehouse_id: x.warehouse_id,
                        id: x.id,
                        container_group: x.container_group,
                        package_code: x.package_code,
                        product_qty: x.product_qty,
                        package_qty: x.package_qty,
                        box_qty: x.box_qty,
                        is_change_sku: x.is_change_sku ? true : false
                    }
                })

                values.ship_date = moment(values.ship_date)
                    .format('YYYY-MM-DD')
                    .toString()
                values.doc_date = moment(values.doc_date)
                    .format('YYYY-MM-DD')
                    .toString()
                values.land_date = moment(values.land_date)
                    .format('YYYY-MM-DD')
                    .toString()
                values.recv_date = moment(values.recv_date)
                    .format('YYYY-MM-DD')
                    .toString()

                this.innerAction.setActionAPI(
                    'purchase_management/create_package_order',
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
                            this.submit()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onTbRowClick(row) {
        this.currentLi = row.id
    }

    private getLinesByGroup() {
        if (!this.container_group) {
            this.$message.error('Please input Container Group')
            let group: any = this.$refs.group
            group.focus()
        }
        this.innerAction.setActionAPI(
            'ship_order/query_ship_order_items',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    {
                        order_ids: this.ids,
                        container_group: this.container_group
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.data = data
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
        "ship_date": "Ship Date",
        "company_id": "Company",
        "document_date": "Document Date",
        "eta_date": "Eta Date",
        "receive_date": "Receive Date",
        "ref_no": "Ref No.",
        "boat_company": "Carrier Company",
        "bl_mode": "BL Mode",
        "ship_company_id": "快递公司",
        "bl_no": "BL No.",
        "shipment_no": "快递单号",
        "port_of_origin": "Prot Of Origin",
        "port_of_arrival": "Port Of Arrival",
        "batch_create": "Batch Create",
        "delete": "Are you sure delete?",
        "plzSelect": "Please Select",
        "plzInput": "Please Input",
        "columns": {
            "prod_name": "Prod Name",
            "out_number": "Out Number",
            "product_qty": "Product Qty",
            "name": "Name",
            "box_qty": "Box Qty",
            "note": "Note",
            "package_qty": "Package Qty",
            "container_group": "Container Group",
            "warehouse_id": "Warehouse",
            "package_code": "Package Code",
            "is_change_sku": "SKU Changed",
            "action": "Action"
        },
        "action": {
            "add": "Add",
            "action": "Action",
            "save": "Save",
            "delete": "Delete",
            "cancel": "Cancel",
            "ok": "OK"
        }
    },
    "zh-cn": {
        "ship_date": "发船日期",
        "company_id": "公司",
        "document_date": "Document Date",
        "eta_date": "Eta Date",
        "receive_date": "接收日期",
        "ref_no": "Ref No.",
        "boat_company": "船公司",
        "bl_mode": "BL Mode",
        "ship_company_id": "快递公司",
        "bl_no": "BL No.",
        "shipment_no": "快递单号",
        "port_of_origin": "始发港",
        "port_of_arrival": "到达港",
        "batch_create": "批量创建",
        "delete": "确定要删除吗？",
        "plzSelect": "请选择",
        "plzInput": "请输入",
        "columns": {
            "prod_name": "产品",
            "out_number": "Out Number",
            "product_qty": "Product Qty",
            "name": "Name",
            "box_qty": "箱数",
            "note": "Note",
            "package_qty": "Package Qty",
            "container_group": "Container Group",
            "warehouse_id": "仓库",
            "package_code": "集装箱号",
            "is_change_sku": "SKU变更",
            "action": "操作"
        },
        "action": {
            "add": "新增",
            "action": "操作",
            "save": "保存",
            "delete": "删除",
            "cancel": "取消",
            "ok": "确定"
        }
    }
}
</i18n>
