<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.req_name')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['req_name']"
                        style="width:240px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        style="width:240px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.date_expected')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['date_expected']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.sales_expected_give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['sales_expected_give_date']"
                        :style="{ width: '240px' }"
                        format="YYYY-MM-DD"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.vendor_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of vendorFullNameList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['warehouse_id', { initialValue: '' }]"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of $dict.WarehouseId"
                            :key="item.value"
                            :value="item.value"
                        >
                            {{ $t(item.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.user_purchase')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['user_purchase']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.merchandiser')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['merchandiser']"
                        :style="{ width: '240px' }"
                        size="small"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of systemUsers"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
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
                    @click="onCreate"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    v-auth="'new'"
                    >{{ $t('action.create') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="returnPurchase"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    v-auth="'return'"
                    >{{ $t('action.return_purchase') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="syncSupplierProductSupplierInfo"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.syncSupplierProductSupplierInfo') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="changePurchaseInfo"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    v-auth="'edit'"
                    >{{ $t('action.changePurchaseInfo') }}
                </a-button>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
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
                    @on-page-change="getDataList"
                    @onClick="
                        record => {
                            selectedRowKeys = [record]
                            onRowClick(record)
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 400 }"
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
                                ? text.length > 20
                                    ? text.substr(0, 17) + '...'
                                    : text
                                : ''
                        }}
                    </span>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="vendor" slot-scope="text"
                        >{{ getVendorName(text) }}
                    </span>
                    <template slot="date_approve" slot-scope="text, row">
                        <span :id="'id' + row.id"
                            >{{ text ? text : '' }} {{ calcStyle(row) }}</span
                        >
                    </template>
                    <template slot="warehouse_render" slot-scope="text">
                        <span v-if="text == 'de'">DE</span>
                        <span v-else-if="text == 'uk'">UK</span>
                        <span v-else>{{ text }}</span>
                    </template>
                    <template slot="no_process_note" slot-scope="text, row">
                        <a-textarea
                            size="small"
                            rows="2"
                            cols="40"
                            style="width:90%;margin: 3px 0;"
                            v-if="editRow.id == row.id"
                            :value="
                                row.no_process_note ? row.no_process_note : ''
                            "
                            @change="
                                e => handleChange(e, row, 'no_process_note')
                            "
                        />
                        <span :title="row.no_process_note" v-else>{{
                            row.no_process_note
                                ? row.no_process_note.length > 24
                                    ? row.no_process_note.substr(0, 27) + '...'
                                    : row.no_process_note
                                : ''
                        }}</span>
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
                @rowClick="onRowClick"
            >
                <span slot="check_render" slot-scope="text"
                    ><a-checkbox disabled :checked="text" />
                </span>
                <span slot="show_message_tips" slot-scope="text" :title="text">
                    {{
                        text
                            ? text.length > 20
                                ? text.substr(0, 17) + '...'
                                : text
                            : ''
                    }}
                </span>
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="vendor" slot-scope="text"
                    >{{ getVendorName(text) }}
                </span>
                <template slot="date_approve" slot-scope="text, row">
                    <span :id="'id' + row.id"
                        >{{ text ? text : '' }} {{ calcStyle(row) }}</span
                    >
                </template>
                <template slot="warehouse_render" slot-scope="text">
                    <span v-if="text == 'de'">DE</span>
                    <span v-else-if="text == 'uk'">UK</span>
                    <span v-else>{{ text }}</span>
                </template>
                <template slot="no_process_note" slot-scope="text, row">
                    <a-textarea
                        size="small"
                        rows="2"
                        cols="40"
                        style="width:90%;margin: 3px 0;"
                        v-if="editRow.id == row.id"
                        :value="row.no_process_note ? row.no_process_note : ''"
                        @change="e => handleChange(e, row, 'no_process_note')"
                    />
                    <span :title="row.no_process_note" v-else>{{
                        row.no_process_note
                            ? row.no_process_note.length > 24
                                ? row.no_process_note.substr(0, 27) + '...'
                                : row.no_process_note
                            : ''
                    }}</span>
                </template>
            </GroupbyTable>
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
import AddReplenishContract from '~/components/purchase/add-replenish-contract.vue'
import PurchaseReturn from '~/components/purchase/purchase-return.vue'
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import PurchaseModifyPurchaseInfo from '@/components/purchase/purchase-modify-purchase-info.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-pre-make-order'
})
@Component({
    components: {
        AddReplenishContract,
        PurchaseReturn,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class PurchasePreMakeOrder extends Vue {
    // 表格组件
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    // Loading服务
    private loadingService = new LoadingService()
    // 分页服务
    private pageService = new PageService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private reasonList: any = []

    private groupbyList: any = []

    private allNameAuth: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null
    private orderBy: any = 'create_date desc'

    @datasModule.State
    private companyList

    @datasModule.Action
    private getcompany

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private vendorFullNameList

    @datasModule.Action
    private getVendorFullNameList

    private columnList: any = []

    private editRow: any = {
        id: null
    }

    private queryUrl: any = '/purchase_requirement/pre_make_order'

    private get rules() {
        return {}
    }

    public created() {
        this.getcompany()
        this.getSystemuser()
        this.getVendorFullNameList()
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_like',
                req_name: 'in_or_like',
                ...formConfig.condition
            })

            var nowConditions: any[] = []
            for (var item of params.query_condition) {
                if (item.value.constructor == Array && item.operate !== 'in') {
                    if (
                        item.value.length == 2 &&
                        item.value[0].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '>=',
                            value: new Date(
                                item.value[0].format('YYYY-MM-DD') + ' 00:00:00'
                            )
                        })
                    }
                    if (
                        item.value.length == 2 &&
                        item.value[1].constructor.name == 'Moment'
                    ) {
                        nowConditions.push({
                            query_name: item.query_name,
                            operate: '<=',
                            value: new Date(
                                item.value[1].format('YYYY-MM-DD') +
                                    ' 23:59:59.999999'
                            )
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
                            let msg: any = this.$t('tips.save_success')
                            this.data = data
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onCreate() {
        this.innerAction.setActionAPI(
            'purchase_requirement/query_pre_make_order_lines',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let item = this.data.find(
                        x => x.id == this.selectedRowKeys[0]
                    )
                    this.$modal
                        .open(
                            AddReplenishContract,
                            {
                                info: data,
                                systemUsers: this.systemUsers,
                                vendorList: this.vendorFullNameList
                            },
                            {
                                title: this.$t(
                                    'action.add_replenishment_contract'
                                ),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                                this.getDataList()
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

    private returnPurchase() {
        this.innerAction.setActionAPI(
            'purchase_requirement/query_pre_make_order_lines',
            CommonService.getMenuCode()
        )
        this.publicService
            .query(
                new RequestParams(
                    { line_ids: this.selectedRowKeys },
                    {
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    this.$modal
                        .open(
                            PurchaseReturn,
                            {
                                info: data
                            },
                            {
                                title: this.$t('action.purchase_return'),
                                width: '1000px'
                            }
                        )
                        .subscribe(
                            data => {
                                this.$message.success('操作成功')
                                this.getDataList()
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

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getVendorName(code) {
        let cd = typeof code == 'object' ? code[0] : code
        let ret: any = cd
        let item = this.vendorFullNameList.find(x => x.code == cd)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private getCompanyName(code) {
        let ret: any = code
        let item = this.companyList.find(x => x.code == code)
        if (item) {
            ret = item.name
        }
        return ret
    }

    private filterSelectOption(input, option) {
        return (
            option.componentOptions.children[0].text
                .toLowerCase()
                .indexOf(input.toLowerCase()) >= 0
        )
    }

    private onTableChange(pagination, filters, sorter) {
        if (sorter.order) {
            let column = sorter.columnKey
            let order = sorter.order.replace('end', '')
            this.orderBy = column + ' ' + order
        } else {
            this.orderBy = ''
        }
        this.getDataList()
    }

    private onSelectChange(rowkeys) {
        this.selectedRowKeys = rowkeys
    }

    private calcStyle(row) {
        this.$nextTick(() => {
            if (row.date_approve && !row.new_product) {
                let no_order_7day: any = row.no_order_7day
                let no_order_3day: any = row.no_order_3day

                let sp: any = document.getElementById('id' + row.id)
                let tr = sp.parentNode.parentNode
                if (no_order_7day) {
                    tr.style.color = 'red'
                } else if (no_order_3day) {
                    tr.style.color = '#f90'
                }
            }
        })
    }

    private onRowClick(row) {
        this.editRow = {
            id: row
        }
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e.target.value
        let item = this.needSaveNotes.find(x => x.id == row.id)
        if (item) {
            item.no_process_note = e.target.value
        } else {
            this.needSaveNotes.push({
                id: row.id,
                no_process_note: e.target.value
            })
        }
    }

    private changeNote(row) {
        this.innerAction.setActionAPI(
            'purchase_management/save_pre_make_order_purchase_line',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        req_line_list: this.needSaveNotes
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
                    this.needSaveNotes = []
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private changePurchaseInfo() {
        this.$modal
            .open(
                PurchaseModifyPurchaseInfo,
                {
                    ids: this.selectedRowKeys,
                    userList: this.systemUsers
                },
                {
                    title: this.$t('action.changePurchaseInfo'),
                    width: '1000px'
                }
            )
            .subscribe(
                data => {
                    this.$message.success('Update Success')
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private syncSupplierProductSupplierInfo() {
        this.innerAction.setActionAPI(
            'purchase_requirement/sync_supplier_product_supplier_info',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        line_id_list: this.selectedRowKeys
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
                    this.needSaveNotes = []
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
        "columns": {
            "date_approve": "date_approve",
            "date_expected": "date_expected",
            "default_code": "default_code",
            "ist_box_qty": "ist_box_qty",
            "merchandiser": "merchandiser",
            "new_product": "new_product",
            "pack_material": "pack_material",
            "product_color": "product_color",
            "product_id": "product_id",
            "product_min_order": "product_min_order",
            "product_qty": "product_qty",
            "product_ve": "product_ve",
            "req_id": "req_id",
            "sales_expected_give_date": "sales_expected_give_date",
            "state": "state",
            "stock_onhand_quantity": "stock_onhand_quantity",
            "user_purchase": "user_purchase",
            "user_require": "user_require",
            "vendor_id": "vendor_id",
            "warehouse_id": "warehouse_id",
            "z_sub_category": "z_sub_category",
            "req_name": "Req Name"
        },
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "return_purchase": "Return Purchase",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "save": "Save",
            "changePurchaseInfo": "Change Purchase Info",
            "syncSupplierProductSupplierInfo": "Sync Supplier Product/Info"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "date_approve": "运营下单日期",
            "date_expected": "期望入库",
            "default_code": "产品",
            "ist_box_qty": "是否箱数",
            "merchandiser": "跟单员",
            "new_product": "新品",
            "pack_material": "包裹材质",
            "product_color": "产品颜色",
            "product_id": "产品id",
            "product_min_order": "最小订购数量",
            "product_qty": "产品数量",
            "product_ve": "装箱率",
            "req_id": "req_id",
            "sales_expected_give_date": "运营期望交期",
            "state": "状态",
            "stock_onhand_quantity": "实际库存",
            "user_purchase": "采购员",
            "user_require": "需求人",
            "vendor_id": "供货商",
            "warehouse_id": "仓库",
            "z_sub_category": "中文子类",
            "req_name": "需求编号"
        },
        "action": {
            "create": "新建采购合同",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "save": "保存",
            "changePurchaseInfo": "修改待补货信息",
            "syncSupplierProductSupplierInfo": "同步供应商产品"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
