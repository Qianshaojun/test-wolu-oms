<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action>
            <a-button type="primary" @click="onCreateSaleTrend"
                >{{ $t('action.create') }}
            </a-button>
        </template>
        <data-form
            ref="dataForm"
            @submit="getProductPurchaseSchedualList"
            :column="2"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['sku']"
                        :style="{ width: '300px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('fuzzy_search')"
                        v-decorator="['z_sub_category']"
                        :style="{ width: '200px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['operator', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of systemUsers"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            >{{ $t(item.label) }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_name', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-select-option
                            :value="item.code"
                            v-for="item of vender_data"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.dept_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'dept_id',
                            {
                                initialValue: ''
                            }
                        ]"
                        :style="{ width: '200px' }"
                        size="small"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value
                            >{{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of departmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        v-decorator="['create_date']"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="10"
                            >{{ $t('forms.draft') }}
                        </a-radio-button>
                        <a-radio-button value="20">
                            采购提交
                        </a-radio-button>
                        <a-radio-button value="30">
                            库管提交
                        </a-radio-button>
                        <a-radio-button value="40">
                            运营提交
                        </a-radio-button>
                        <a-radio-button value="50">
                            完成
                        </a-radio-button>
                        <a-radio-button value="100">
                            退回
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    :disabled="!needSaveNotes.length"
                    @click="changeNote"
                    >{{ $t('action.save') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="update_requirement_schedule_state(30)"
                    >{{ $t('action.update_requirement_schedule_state_20') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="update_requirement_schedule_state(40)"
                    >{{ $t('action.update_requirement_schedule_state_30') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="schedualData"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="id"
                    :columns="columnList"
                    :rowSelection="{
                        selectedRowKeys: selectedRowKeys,
                        onChange: keys => (selectedRowKeys = keys)
                    }"
                    @on-page-change="getProductPurchaseSchedualList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onTrClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 1500, y: 400 }"
                >
                    <span slot="schedual_available_qty" slot-scope="row">
                        {{ row.unfinish_qty - row.factory_finish_qty }}
                    </span>
                    <span slot="increase_ratio_text" slot-scope="row">
                        {{
                            row.increase_ratio_text
                                ? row.increase_ratio_text.length > 17
                                    ? row.increase_ratio_text.substr(0, 17) +
                                      '...'
                                    : row.increase_ratio_text
                                : ''
                        }}</span
                    >
                    <span slot="status" slot-scope="text, row"
                        >{{ row.status | dict2(stateList) }}
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <template slot="user_render" slot-scope="text">
                        <span v-if="!text"></span>
                        <span v-else>{{ text | dict2(systemUsers) }}</span>
                    </template>
                    <template slot="stock_schedule_qty" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.id == row.id && row.status == 20"
                            :value="row.stock_schedule_qty"
                            :min="0"
                            @change="
                                e => onRowChange(e, row, 'stock_schedule_qty')
                            "
                        />
                        <span v-else>{{ row.stock_schedule_qty }}</span>
                    </template>
                    <template slot="sales_schedule_qty" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="
                                editRow.id == row.id &&
                                    [30, 100].includes(row.status)
                            "
                            :value="row.sales_schedule_qty"
                            :min="0"
                            @change="
                                e => onRowChange(e, row, 'sales_schedule_qty')
                            "
                        />
                        <span v-else>{{ row.sales_schedule_qty }}</span>
                    </template>
                    <template slot="dept_id" slot-scope="text">
                        <span>{{ getDeptName(text) }}</span>
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
                @rowClick="onTrClick"
            >
                <span slot="schedual_available_qty" slot-scope="row">
                    {{ row.unfinish_qty - row.factory_finish_qty }}
                </span>
                <span slot="increase_ratio_text" slot-scope="row">
                    {{
                        row.increase_ratio_text
                            ? row.increase_ratio_text.length > 17
                                ? row.increase_ratio_text.substr(0, 17) + '...'
                                : row.increase_ratio_text
                            : ''
                    }}</span
                >
                <span slot="status" slot-scope="text, row"
                    >{{ row.status | dict2(stateList) }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <template slot="user_render" slot-scope="text">
                    <span v-if="!text"></span>
                    <span v-else>{{ text | dict2(systemUsers) }}</span>
                </template>
                <template slot="stock_schedule_qty" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.id == row.id && row.status == 20"
                        :value="row.stock_schedule_qty"
                        :min="0"
                        @change="e => onRowChange(e, row, 'stock_schedule_qty')"
                    />
                    <span v-else>{{ row.stock_schedule_qty }}</span>
                </template>
                <template slot="sales_schedule_qty" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="
                            editRow.id == row.id &&
                                [30, 100].includes(row.status)
                        "
                        :value="row.sales_schedule_qty"
                        :min="0"
                        @change="e => onRowChange(e, row, 'sales_schedule_qty')"
                    />
                    <span v-else>{{ row.sales_schedule_qty }}</span>
                </template>
                <template slot="dept_id" slot-scope="text">
                    <span>{{ getDeptName(text) }}</span>
                </template>
            </GroupbyTable>
        </a-card>
        <a-card v-if="show_log_view">
            <LogView
                :object_name="object_name"
                :record_code="record_code"
            ></LogView>
        </a-card>
    </page-container>
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit, Ref } from 'vue-property-decorator'
import { Page } from '~/core/decorators'
import router from '../../router'
import { RequestParams } from '~/core/http'
import { PageService } from '~/bootstrap/services/page.service'
import { LoadingService } from '~/bootstrap/services/loading.service'
import { namespace } from 'vuex-class'
import DataForm from '~/shared/components/data-form.vue'
import PageContainer from '../../shared/components/page-container.vue'
import { CommonService } from '@/shared/utils/common.service'
import { ProductPurchaseService } from '../../services/product.purchase.service'
import { VendorService } from '../../services/vendor.service'
import appConfig from '../../config/app.config'
import LogView from '~/shared/common/log-view.vue'
import UploadExcel from '~/shared/common/upload-excel.vue'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-purchase-schedual'
})
@Component({
    components: {
        LogView,
        UploadExcel,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductPurchaseSchedual extends Vue {
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer
    private data: any[] = []

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private vendorService = new VendorService()
    private vender_data: any[] = []
    // 表格数据源
    private schedualData: any[] = []

    private selectedRows: any[] = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private orderBy: any = ''

    private show_log_view: any = false

    private object_name: any = 'purchase_requirement_schedule_list'

    private record_code: any = 0

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private need_save_data_list: any[] = []

    private editRow: any = {
        id: null
    }

    private productPurchaseService = new ProductPurchaseService()

    private innerAction = new InnerActionService()
    private publicService = new PublicService()
    private groupbyList: any = []

    private allNameAuth: any = []

    private columnList: any = []
    private queryUrl: any = 'product_management/query_all_requirement_schedule'

    private stateList = [
        {
            code: 10,
            name: '草稿'
        },
        {
            code: 20,
            name: '采购提交'
        },
        {
            code: 30,
            name: '库管提交'
        },
        {
            code: 40,
            name: '运营提交'
        },
        {
            code: 50,
            name: '完成'
        },
        {
            code: 100,
            name: '退回'
        }
    ]

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private created() {
        this.getSystemuser()
        this.getDepartmentList()

        this.vendorService
            .get_vendor_ref_list(
                new RequestParams(
                    {},
                    {
                        loading: this.loadingService
                    }
                )
            )
            .subscribe(
                data => {
                    data.push({ code: '未找到', name: '未找到' })
                    this.vender_data = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private onRowClick(row) {
        let info = this.schedualData.find(x => x.id === row)

        this.editRow = {
            id: row
        }

        this.record_code = row
    }

    private async getProductPurchaseSchedualList() {
        if (this.need_save_data_list.length > 0) {
            let dft: any = ''

            const result = await new Promise((reslove, reject) => {
                this.$confirm({
                    parentContext: dft,
                    title: '存在未保存数据，确定要查询吗？',
                    onOk: () => reslove(true),
                    onCancel: () => reslove(false)
                })
            })
            if (!result) {
                return
            }
        }

        this.dataForm
            .validateFields()
            .then((values: any) => {
                if (
                    values['vendor_name'] == '' ||
                    values['vendor_name'].length == 0
                ) {
                    delete values['vendor_name']
                }

                let params: any = CommonService.createQueryCondition(values, {
                    sku: 'like',
                    warehouse_id: '=',
                    operate: '=',
                    status: '=',
                    z_sub_category: 'like',
                    vendor_name: 'in'
                })

                var nowConditions: any[] = []

                for (var item of params.query_condition) {
                    if (
                        item.value.constructor == Array &&
                        item.operate !== 'in'
                    ) {
                        if (
                            item.value.length == 2 &&
                            item.value[0].constructor.name == 'Moment'
                        ) {
                            let startDate: any = {}
                            for (let key in item.value[0]) {
                                startDate[key] = item.value[0][key]
                            }
                            let vle = new Date(startDate.utc())

                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '>=',
                                value: vle
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
                            let vle = new Date(endDate.utc())

                            nowConditions.push({
                                query_name: item.query_name,
                                operate: '<=',
                                value: vle
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
                        'product_management/query_all_requirement_schedule',
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
                                this.schedualData = data

                                this.editRow = { id: null }
                                this.need_save_data_list = []
                            },
                            err => {
                                this.$message.error(err.message)
                            }
                        )
                }
            })
            .catch(err => {
                // 异常处理
            })
    }

    private onTableChange(sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getProductPurchaseSchedualList()
    }

    private onTrClick(id) {
        let info = this.schedualData.find(x => x.id === id)
        this.selectedRowKeys = [info.id]

        this.editRow = {
            id: info.id
        }

        this.record_code = id
    }

    private getEditTextChangedStyle(row, column) {
        if (column == 'schedule_qty') {
            if (row.hasOwnProperty(column + '_changed')) {
                return 'text-align:right;background-color:yellow;font-weight:bolder'
            }

            return 'text-align:right'
        }

        if (column == 'sales_schedule_qty') {
            if (row.hasOwnProperty(column + '_changed')) {
                return 'text-align:right;background-color:yellow;font-weight:bolder'
            }

            return 'text-align:right'
        }

        return 'text-align:right'
    }

    private confirm_schedual() {
        // for (var id in this.selectedRowKeys) {
        //     let info = this.schedualData.find(x => x.id === id)

        //     if (info.status != 10) {
        //         this.$message.error(info.sku + '为非草稿状态')
        //         return
        //     }
        // }

        this.productPurchaseService
            .confirm_requirement_schedule(
                new RequestParams(
                    {
                        schedule_id_list: this.selectedRowKeys
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

    private update_requirement_schedule_state(state) {
        this.innerAction.setActionAPI(
            'product_management/update_requirement_schedule_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        schedule_id_list: this.selectedRowKeys,
                        status: state
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.getProductPurchaseSchedualList()
                    this.selectedRowKeys = []
                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private cancel_schedual() {
        // for (var id in this.selectedRowKeys) {
        //     let info = this.schedualData.find(x => x.id === id)

        //     if (info.status != 10) {
        //         this.$message.error(info.sku + '为非草稿状态')
        //         return
        //     }
        // }

        this.productPurchaseService
            .cancel_requirement_schedule(
                new RequestParams(
                    {
                        schedule_id_list: this.selectedRowKeys
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

    private export_schedual() {
        let urlParams = encodeURIComponent(JSON.stringify(this.selectedRowKeys))

        window.open(
            appConfig.server +
                '/product_purchase/export_requirement_schedule?schedule_id_list=' +
                urlParams
        )
    }

    private save_changed_data() {
        if (this.need_save_data_list.length == 0) {
            this.$message.info('没有需要保存的数据。')
            return
        }

        this.productPurchaseService
            .change_requirement_schedule_qty(
                new RequestParams(
                    {
                        change_schedule_data_list: this.need_save_data_list
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    for (var index in this.need_save_data_list) {
                        var item = this.need_save_data_list[index]

                        var obj = this.schedualData.find(x => x.id === item.id)

                        if (obj && obj.hasOwnProperty('schedule_qty_changed')) {
                            delete obj.schedule_qty_changed
                        }

                        if (
                            obj &&
                            obj.hasOwnProperty('sales_schedule_qty_changed')
                        ) {
                            delete obj.sales_schedule_qty_changed
                        }
                    }

                    this.need_save_data_list = []

                    this.$message.success('操作成功')
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private needSaveNotes: any = []

    private onRowChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.id == row.id)
        if (item) {
            item[column] = e
        } else {
            let note: any = {
                id: row.id,
                save_flag: 1
            }
            note[column] = e
            this.needSaveNotes.push(note)
        }
    }

    private changeNote(row) {
        this.innerAction.setActionAPI(
            'product_management/update_requirement_schedule_qty',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        schedule_list: this.needSaveNotes
                    },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.$message.success(msg)
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    // private handleChange(target, row, column) {
    //     var value = target.value

    //     var reg = new RegExp('^[0-9]*$')

    //     if (value != '') {
    //         if (!reg.test(value)) {
    //             this.$message.info('请输入数字!')
    //             return
    //         }
    //     } else {
    //         this.$message.info('请输入数字!')
    //         return
    //     }

    //     var new_value = Number(value)
    //     var max_value = row.unfinish_qty - row.factory_finish_qty
    //     if (max_value < new_value) {
    //         this.$message.info('最多只能输入' + max_value)
    //         return
    //     }

    //     if (row[column] != value) {
    //         row[column] = new_value

    //         if (column == 'schedule_qty') {
    //             row.schedule_qty_changed = true
    //             var exists_item_1 = this.need_save_data_list.find(
    //                 x => x.id == row.id
    //             )
    //             if (exists_item_1) {
    //                 exists_item_1['schedule_qty'] = new_value
    //             } else {
    //                 this.need_save_data_list.push({
    //                     id: row.id,
    //                     schedule_qty: new_value
    //                 })
    //             }
    //         } else if (column == 'sales_schedule_qty') {
    //             row.sales_schedule_qty_changed = true

    //             var exists_item_2 = this.need_save_data_list.find(
    //                 x => x.id == row.id
    //             )
    //             if (exists_item_2) {
    //                 exists_item_2['sales_schedule_qty'] = new_value
    //             } else {
    //                 this.need_save_data_list.push({
    //                     id: row.id,
    //                     sales_schedule_qty: new_value
    //                 })
    //             }
    //         }
    //     }

    //     let newdata = {
    //         ...this.editRow
    //     }
    //     newdata[column] = value
    //     this.editRow = newdata
    // }

    private view_logs(row) {
        this.show_log_view = !this.show_log_view
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private calculate_increase_ratio() {
        if (this.selectedRowKeys.length == 0) {
            this.$message.info('请选择需要计算的行。')
            return
        }

        this.productPurchaseService
            .calculate_category_increase_ratio(
                new RequestParams(
                    {
                        calculate_ids: this.selectedRowKeys
                    },
                    { loading: this.loadingService }
                )
            )
            .subscribe(
                data => {
                    this.getProductPurchaseSchedualList()
                },
                err => {
                    this.$message.error(err.message)
                    return
                }
            )
    }

    private getDeptName(id) {
        let ret = ''
        let item = this.departmentList.find(x => x.id === id)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }
}
</script>
<i18n>
{
    "en-us": {
        "desc": "Product Purchase Schedual",
        "columns": {
            "warehouse_id": "Warehouse",
            "calculate_date": "Calculate Date",
            "finish_calculate": "Calculate Finish",
            "stock_qty": "Stock",
            "fba_stock_qty": "FBA Stock",
            "cur_month_transit_qty": "Currenct Month",
            "next_month_transit_qty": "Next Month",
            "last_month_transit_qty": "Last Month",
            "unfinish_qty": "Unfinish QTY",
            "scheduled_qty": "Schedualed QTY",
            "factory_finish_qty": "Factory Finish QTY",
            "schedual_available_qty": "Schedual Available QTY",
            "will_12_sales": "12 Week",
            "will_11_sales": "11 Week",
            "will_10_sales": "10 Week",
            "will_9_sales": "9 Week",
            "will_8_sales": "8 Week",
            "will_7_sales": "7 Week",
            "will_6_sales": "6 Week",
            "will_5_sales": "5 Week",
            "will_4_sales": "4 Week",
            "will_3_sales": "3 Week",
            "will_2_sales": "2 Week",
            "will_1_sales": "1 Week",
            "schedule_qty": "Schedual QTY",
            "sales_schedule_qty": "Sales Schedual QTY",
            "finish_calculate": "Calcuate Finish",
            "length": "Length",
            "width": "Width",
            "height": "Height",
            "weight": "Weight",
            "z_sub_category": "Sub Category",
            "size_info": "Size",
            "vendor_name": "Vendor",
            "increase_ratio_text": "Increase Ratio",
            "draft": "Draft",
            "complete": "Complete",
            "cancel": "Cancel",
            "vendor_name": "Vendor Name",
            "create_date": "schedule date",
            "dept_id": "Department"
        },
        "forms": {
            "draft": "Draft",
            "complete": "Complete",
            "cancel": "Cancel"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Ok",
            "save": "Save",
            "cancel": "Cancel",
            "confirm": "Confirm",
            "export": "Export Excel",
            "import": "Import Excel",
            "view_logs": "Logs",
            "calculate_increase_ratio": "Calculate Ratio",
            "more": "More",
            "update_requirement_schedule_state_20": "Update State by Warehouse",
            "update_requirement_schedule_state_30": "Update State by Yunying"
        },
        "rules": {
        },
        "delete": "Are you sure delete?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "采购排单计划",
        "columns": {
            "warehouse_id": "仓库",
            "calculate_date": "计算日期",
            "finish_calculate": "统计完成",
            "stock_qty": "库存",
            "fba_stock_qty": "FBA库存",
            "cur_month_transit_qty": "当月",
            "next_month_transit_qty": "下月",
            "last_month_transit_qty": "尾月",
            "unfinish_qty": "工厂数量",
            "scheduled_qty": "已排期",
            "factory_finish_qty": "工厂完成",
            "schedual_available_qty": "可排期数",
            "will_12_sales": "近12周",
            "will_11_sales": "近11周",
            "will_10_sales": "近10周",
            "will_9_sales": "近9周",
            "will_8_sales": "近8周",
            "will_7_sales": "近7周",
            "will_6_sales": "近6周",
            "will_5_sales": "近5周",
            "will_4_sales": "近4周",
            "will_3_sales": "近3周",
            "will_2_sales": "近2周",
            "will_1_sales": "近1周",
            "schedule_qty": "排期",
            "sales_schedule_qty": "运营排期",
            "finish_calculate": "计算完成",
            "length": "长",
            "width": "宽",
            "height": "高",
            "weight": "重量",
            "z_sub_category": "子类",
            "size_info": "尺寸",
            "vendor_name": "供应商",
            "increase_ratio_text": "环比",
            "draft": "草稿",
            "complete": "完成",
            "cancel": "取消",
            "vendor_name": "供应商",
            "create_date": "排期时间",
            "dept_id": "部门"
        },
        "forms": {
            "draft": "草稿",
            "complete": "完成",
            "cancel": "取消"
        },
        "action": {
            "create": "新建",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "save": "保存",
            "cancel": "取消",
            "confirm": "确认",
            "export": "导出Excel",
            "import": "导入Excel",
            "view_logs": "日志",
            "calculate_increase_ratio": "计算环比",
            "more": "更多操作",
            "update_requirement_schedule_state_20": "库管提交",
            "update_requirement_schedule_state_30": "运营提交"
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
