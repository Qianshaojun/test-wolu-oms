<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 6 }"
            :wrapperCol="{ span: 15, offset: 0 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.common_sku')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['common_sku']"
                        style="width:200px;"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.code')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['code']"
                        style="width:300px;"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_date')"
                    style="height:35px;margin:0;"
                >
                    <a-date-picker
                        v-decorator="['ship_date']"
                        format="YYYY-MM-DD"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.logistics_proveder_name')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['logistics_id', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                        :filterOption="filterSelectOption"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.code"
                            v-for="item of providerList"
                            :key="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.give_date')"
                    style="height:35px;margin:0;"
                >
                    <a-date-picker
                        v-decorator="['give_date']"
                        format="YYYY-MM-DD"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.purchase_num')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['purchase_num']"
                        style="width:300px;"
                        :placeholder="$t('plzInput')"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.state')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['state', { initialValue: '' }]"
                        :style="{
                            width: '100%',
                            'max-width': '300px'
                        }"
                        size="small"
                        placeholder="Please Select"
                        mode="multiple"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            :value="item.value"
                            v-for="item of $dict.ShippingPlanState"
                            :key="item.value"
                        >
                            {{ $t(item.label) }}
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
                    @click="onAssignProvider"
                    :disabled="!selectedRowKeys.length"
                    style="margin-left: 2px"
                    >{{ $t('action.assign_provider') }}
                </a-button>
                <a-popconfirm
                    :title="$t('delete')"
                    :okText="$t('action.ok')"
                    :cancelText="$t('action.cancel')"
                    placement="left"
                    @confirm="onDelete()"
                    :disabled="!selectedRowKeys.length"
                >
                    <a-button type="primary" :disabled="!selectedRowKeys.length"
                        >{{ $t('action.delete') }}
                    </a-button>
                </a-popconfirm>
            </template>
        </data-form>
        <a-card class="margin-y autoFlex" style="margin:0 !important;">
            <div v-if="!groupbyList.length">
                <AutoColumnTable
                    :stripe="true"
                    :data="data"
                    :page="pageService"
                    :queryNameAuth="allNameAuth"
                    rowKey="index"
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
                    <template slot="available_ship_qty" slot-scope="text, row">
                        {{ Math.max(0, row.product_qty - row.shipped_qty) }}
                    </template>
                    <span slot="date_ranger" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="user_ranger" slot-scope="text"
                        >{{ text | dict2(systemUsers) }}
                    </span>
                    <span slot="ship_aging" slot-scope="text"
                        >{{ text | dict('LogisticsProviderAging') | translate }}
                    </span>
                    <template slot="product_name" slot-scope="text, row">
                        <span :title="row.product_name">{{
                            row.product_name
                                ? row.product_name.length > 24
                                    ? row.product_name.substr(0, 27) + '...'
                                    : row.product_name
                                : ''
                        }}</span>
                    </template>
                    <template slot="ship_qty" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            v-if="editRow.index == row.index"
                            :value="row.ship_qty"
                            :min="1"
                            @change="e => handleChange(e, row, 'ship_qty')"
                        />
                        <span v-else>{{ row.ship_qty }}</span>
                    </template>
                    <template slot="state" slot-scope="text, row">
                        {{ row.state | dict('ShippingPlanState') | translate }}
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
                <template slot="available_ship_qty" slot-scope="text, row">
                    {{ Math.max(0, row.product_qty - row.shipped_qty) }}
                </template>
                <span slot="date_ranger" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="user_ranger" slot-scope="text"
                    >{{ text | dict2(systemUsers) }}
                </span>
                <template slot="product_name" slot-scope="text, row">
                    <span :title="row.product_name">{{
                        row.product_name
                            ? row.product_name.length > 24
                                ? row.product_name.substr(0, 27) + '...'
                                : row.product_name
                            : ''
                    }}</span>
                </template>
                <template slot="ship_qty" slot-scope="text, row">
                    <a-input-number
                        size="small"
                        v-if="editRow.index == row.index"
                        :value="row.ship_qty"
                        @change="e => handleChange(e, row, 'ship_qty')"
                    />
                    <span v-else>{{ row.ship_qty }}</span>
                </template>
                <template slot="state" slot-scope="text, row">
                    {{ row.state | dict('ShippingPlanState') | translate }}
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
import UUID from 'uuidjs'
import UploadExcel from '@/shared/common/upload-excel.vue'
import AssignProvider from '@/components/purchase/assign_provider.vue'

const datasModule = namespace('datasModule')
const pageParamsModule = namespace('pageParamsModule')

@Page({
    layout: 'workspace',
    name: 'shipping-plan-manage'
})
@Component({
    components: {
        AddReplenishContract,
        PurchaseReturn,
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ShippingPlanManage extends Vue {
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

    private stateList: any = [
        {
            code: 'active',
            name: 'Active'
        },
        {
            code: 'inactive',
            name: 'Inactive'
        }
    ]

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private currencyList

    @datasModule.Action
    private getcurrency

    @pageParamsModule.Mutation('addCommonPageInfo')
    private addCommonPageInfo

    private columnList: any = []

    private editRow: any = {
        index: null
    }

    private providerList: any = []

    private queryUrl: any = '/shipping_plan/query_all'

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
        this.getcurrency()
        this.getProviders()
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
                name: 'in_or_like',
                code: 'like',
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
                            this.data = data.map(x => {
                                x['index'] = UUID.generate()
                                return x
                            })
                            this.selectedRowKeys = []
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            }
        })
    }

    private onAssignProvider() {
        let info = this.data.filter(x => this.selectedRowKeys.includes(x.index))
        this.$modal
            .open(
                AssignProvider,
                {
                    info: info,
                    systemUsers: this.systemUsers
                },
                {
                    title: this.$t('action.assign_provider'),
                    width: '1000px'
                }
            )
            .subscribe(data => {
                this.getDataList()
            })
    }

    private getUserName(code) {
        let ret: any = code
        let item = this.systemUsers.find(x => x.code == code)
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
            index: row
        }
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.index == row.index)
        if (item) {
            item[column] = e
        } else {
            let note: any = {
                index: row.index,
                id: row.id
            }
            note[column] = e
            this.needSaveNotes.push(note)
        }
    }

    private changeNote(row) {
        let data_list: any = []
        let params = JSON.parse(
            JSON.stringify(
                this.needSaveNotes.filter(x =>
                    this.selectedRowKeys.includes(x.index)
                )
            )
        )

        if (!params.length) {
            this.$message.error('请先选择要保存的行')
            return
        }

        for (let i of params) {
            delete i.index
        }

        this.innerAction.setActionAPI(
            '/shipping_plan/confirm_action',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        data_list: params
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

    private onDelete() {
        let ids: any = []
        for (let i of this.selectedRowKeys) {
            let item = this.data.find(x => x.index == i)
            if (item) {
                ids.push(item.id)
            }
        }
        this.innerAction.setActionAPI(
            '/shipping_plan/delete_shipping_plan',
            CommonService.getMenuCode('shipping-plan-manage')
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        id_list: ids
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
                    this.data = this.data.filter(
                        x => !this.selectedRowKeys.includes(x.index)
                    )
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private getProviders() {
        this.innerAction.setActionAPI(
            '/logistics_providers/query_logistics_code',
            CommonService.getMenuCode('shipping-plan-manage')
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
                    this.providerList = data
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
            "common_sku": "SKU",
            "ship_date": "Ship Date",
            "give_date": "Give Date",
            "code": "Ship Plan Code",
            "purchase_num": "Purchase No.",
            "logistics_proveder_name": "Logistics Provider",
            "state": "State"
        },
        "action": {
            "create": "Add Item",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "save": "Save",
            "import": "Import",
            "assign_provider": "Assign Provider"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "page_name": "Logistics Provider Detail"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "columns": {
            "common_sku": "SKU",
            "ship_date": "发货日期",
            "give_date": "订单交期",
            "code": "发货计划编号",
            "purchase_num": "采购订单编号",
            "logistics_proveder_name": "物流商",
            "state": "状态"
        },
        "action": {
            "create": "新建",
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
            "import": "导入",
            "assign_provider": "分配物流商"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "page_name": "物流商详情"
    }
}
</i18n>
