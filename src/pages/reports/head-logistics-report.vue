<template>
    <page-container ref="pageContainer" :showHeader="false">
        <template #header-action></template>
        <data-form
            ref="dataForm"
            @submit="getDataList"
            :column="2"
            :labelCol="{ span: 5 }"
            :wrapperCol="{ span: 16, offset: 1 }"
        >
            <!--默认显示项-->
            <template #default>
                <a-form-item
                    :label="$t('columns.quick_search')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'fuzzy_search_code',
                            { initialValue: 10 }
                        ]"
                        :style="{ width: '100px' }"
                        size="small"
                    >
                        <a-select-option :value="10">
                            {{ $t('columns.name') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.common_sku') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('columns.fba_shipment_id') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('columns.purchase_number') }}
                        </a-select-option>
                        <a-select-option :value="50">
                            {{ $t('columns.shipment_number') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', 'margin-left': '5px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.from_warehouse')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['from_warehouse', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of warehouseList"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.to_warehouse')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['to_warehouse']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.ship_aging')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['ship_aging', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="i of $dict.LogisticsProviderAging"
                            :key="i.value"
                            :value="i.value"
                        >
                            {{ $t(i.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.payment_state')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['payment_state']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="importLogisticsInfo()"
                    >{{ $t('action.importLogisticsInfo') }}
                </a-button>
                <a-button
                    type="primary"
                    @click="showLogisticsInfo()"
                    :disabled="selectedRowKeys.length != 1"
                    >{{ $t('action.showLogisticsInfo') }}
                </a-button>
                <a-button
                    type="primary"
                    :disabled="!needSaveNotes.length"
                    @click="changeNote()"
                >
                    {{ $t('action.save') }}
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
                    :scroll="{ x: 2000, y: 500 }"
                >
                    <template slot="abnormal_situation" slot-scope="text, row">
                        <a-textarea
                            size="small"
                            rows="2"
                            cols="40"
                            style="width:90%;margin: 3px 0;"
                            v-if="editRow.id == row.id"
                            :value="
                                row.abnormal_situation
                                    ? row.abnormal_situation
                                    : ''
                            "
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'abnormal_situation'
                                    )
                            "
                        />
                        <span :title="row.abnormal_situation" v-else>{{
                            row.abnormal_situation
                                ? row.abnormal_situation.length > 24
                                    ? row.abnormal_situation.substr(0, 27) +
                                      '...'
                                    : row.abnormal_situation
                                : ''
                        }}</span>
                    </template>
                    <template slot="shipment_number" slot-scope="text, row">
                        <a-input
                            size="small"
                            rows="2"
                            cols="40"
                            style="width:90%;margin: 3px 0;"
                            v-if="editRow.id == row.id"
                            :value="
                                row.shipment_number ? row.shipment_number : ''
                            "
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'shipment_number'
                                    )
                            "
                        />
                        <span :title="row.shipment_number" v-else>{{
                            row.shipment_number
                        }}</span>
                    </template>
                    <template slot="assigned_qty" slot-scope="text, row">
                        <a-input-number
                            size="small"
                            rows="2"
                            cols="40"
                            style="width:90%;margin: 3px 0;"
                            v-if="editRow.id == row.id"
                            :value="row.assigned_qty ? row.assigned_qty : 0"
                            @change="
                                e =>
                                    handleChange(
                                        e.target.value,
                                        row,
                                        'assigned_qty'
                                    )
                            "
                        />
                        <span :title="row.assigned_qty" v-else>{{
                            row.assigned_qty
                        }}</span>
                    </template>
                    <template slot="except_date" slot-scope="text, row">
                        <a-date-picker
                            showTime
                            v-if="editRow.id == row.id"
                            valueFormat="YYYY-MM-DD HH:mm:ss"
                            :value="row.except_date | datetolocal"
                            @change="e => handleChange(e, row, 'except_date')"
                        />
                        <span v-else>{{ text | datetolocal }}</span>
                    </template>
                    <span slot="date_render" slot-scope="text"
                        >{{ text | datetolocal }}
                    </span>
                    <span slot="ship_aging" slot-scope="text"
                        >{{ text | dict('LogisticsProviderAging') | translate }}
                    </span>
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
            >
                <span slot="date_render" slot-scope="text"
                    >{{ text | datetolocal }}
                </span>
                <span slot="ship_aging" slot-scope="text"
                    >{{ text | dict('LogisticsProviderAging') | translate }}
                </span>
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
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { VendorService } from '../../services/vendor.service'
import { ReportService } from '../../services/report.service'
import ModifyHeadLogisticsInfo from '@/components/purchase/modify-head-logistics-info.vue'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'head-logistics-report'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class HeadLogisticsReport extends Vue {
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

    private vendorService = new VendorService()
    private reportService = new ReportService()

    private publicService = new PublicService()
    private innerAction = new InnerActionService()

    // 表格数据源
    private data: any[] = []

    private groupbyList: any = []

    private allNameAuth: any = []

    // 表格选择项
    private selectedRowKeys: any[] = []

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    private columnList: any = []

    private queryUrl: any = '/report/query_head_logistics_report'

    private warehouseList: any[] = [
        {
            code: 'de',
            name: 'de'
        },
        {
            code: 'uk',
            name: 'uk'
        },
        {
            code: 'uk_own',
            name: 'uk_own'
        },
        {
            code: 'zqlc',
            name: 'zqlc'
        }
    ]
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []
    private editRow: any = {
        id: null
    }

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()
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
            let fuzzy_search_value = values['fuzzy_search_value']
            if (fuzzy_search_value) {
                let fuzzy_search_code = values['fuzzy_search_code']
                let search_field_name = 'name'

                switch (fuzzy_search_code) {
                    case 10:
                        search_field_name = 'name'
                        break
                    case 20:
                        search_field_name = 'common_sku'
                        break
                    case 30:
                        search_field_name = 'fba_shipment_id'
                        break
                    case 40:
                        search_field_name = 'purchase_number'
                        break
                    case 50:
                        search_field_name = 'shipment_number'
                        break
                    default:
                        search_field_name = 'name'
                }

                values[search_field_name] = fuzzy_search_value
            }

            delete values['fuzzy_search_value']
            delete values['fuzzy_search_code']

            let params: any = CommonService.createQueryCondition(values, {
                name: '=',
                common_sku: '=',
                fba_shipment_id: '=',
                purchase_number: 'ilike',
                shipment_number: 'ilike',
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

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
    }

    private onRowClick(row) {
        this.editRow = {
            id: row
        }
    }

    private needSaveNotes: any = []

    private handleChange(e, row, column) {
        row[column] = e
        let item = this.needSaveNotes.find(x => x.id == row.id)
        if (item) {
            item[column] = e
        } else {
            let param: any = {
                id: row.id
            }
            param[column] = e
            this.needSaveNotes.push(param)
        }
    }

    private changeNote() {
        this.innerAction.setActionAPI(
            '/report/modify_head_logistics_report',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        update_data: this.needSaveNotes
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

    private importLogisticsInfo() {}

    private showLogisticsInfo() {
        this.$modal
            .open(
                ModifyHeadLogisticsInfo,
                {
                    inbound_line_id: this.selectedRowKeys[0]
                },
                {
                    title: this.$t('action.showLogisticsInfo'),
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
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "action": {
            "create": "Create",
            "edit": "Edit",
            "delete": "Delete",
            "ok": "Yes",
            "cancel": "Cancel",
            "more": "More",
            "export": "Export",
            "import": "Import",
            "importLogisticsInfo": "importLogisticsInfo",
            "showLogisticsInfo": "showLogisticsInfo",
            "save": "save"
        },
        "columns": {
            "quick_search": "quick_search",
            "name": "name",
            "common_sku": "common_sku",
            "fba_shipment_id": "fba_shipment_id",
            "purchase_number": "purchase_number",
            "shipment_number": "shipment_number",
            "from_warehouse": "from_warehouse",
            "to_warehouse": "to_warehouse",
            "ship_aging": "ship_aging",
            "payment_state": "payment_state"
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
        "action": {
            "create": "新建采购合同",
            "edit": "编辑",
            "delete": "删除",
            "ok": "确定",
            "cancel": "取消",
            "more": "更多操作",
            "export": "导出",
            "import": "导入",
            "importLogisticsInfo": "物流详情导入",
            "showLogisticsInfo": "物流详情查看",
            "save": "保存"
        },
        "columns": {
            "quick_search": "快速查询",
            "name": "调拨单号",
            "common_sku": "通用SKU",
            "fba_shipment_id": "fba_shipment_id",
            "purchase_number": "对应采购订单号",
            "shipment_number": "对应出货合同",
            "from_warehouse": "调出仓库",
            "to_warehouse": "调入仓库",
            "ship_aging": "选择时效",
            "payment_state": "付款状态"
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
