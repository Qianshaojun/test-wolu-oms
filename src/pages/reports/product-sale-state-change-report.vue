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
                    :label="$t('forms.sku')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="[
                            'sku_type',
                            { initialValue: 'default_code' }
                        ]"
                        :style="{ width: '120px' }"
                        size="small"
                    >
                        <a-select-option value="default_code">
                            {{ $t('forms.base_sku') }}
                        </a-select-option>
                        <a-select-option value="common_sku">
                            {{ $t('forms.common_sku') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['sku']"
                        style="width:200px;"
                        size="small"
                    />
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
                    :label="$t('columns.cn_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['z_category', { initialValue: '' }]"
                        :style="{ width: '90px' }"
                        @change="handleFatherCateChange"
                        :placeholder="$t('columns.z_category')"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in fatherCates"
                            :key="cate"
                            :title="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                    <a-select
                        showSearch
                        :style="{ width: '180px' }"
                        :placeholder="$t('columns.z_sub_category')"
                        v-decorator="['z_sub_category', { initialValue: '' }]"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in sonCates"
                            :key="cate"
                            :title="cate"
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.month')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'month',
                            { initialValue: [currentMonth] }
                        ]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option
                            v-for="month in monthData"
                            :key="month.value"
                        >
                            {{ month.value }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.warehouse_id')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['warehouse', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value
                            >{{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button value="DE" key="DE">DE</a-radio-button>
                        <a-radio-button value="UK" key="UK">UK</a-radio-button>
                    </a-radio-group>
                </a-form-item>

                <a-form-item
                    :label="$t('columns.operator')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['operator']"
                        style="width:200px;"
                        size="small"
                        placeholder="模糊查询"
                    />
                </a-form-item>

                <a-form-item
                    :label="$t('columns.leader')"
                    style="height:35px;margin:0;"
                >
                    <a-input
                        v-decorator="['leader']"
                        style="width:200px;"
                        size="small"
                        placeholder="模糊查询"
                    />
                </a-form-item>

                <a-form-item
                    :label="$t('columns.origin_prod_status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="[
                            'product_origin_state',
                            { initialValue: '' }
                        ]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.final_result')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['final_result', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        placeholder="Please Select"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="cate in $dict.SaleState"
                            :key="cate.value"
                        >
                            {{ $t(cate.label) }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #collapse>
                <a-form-item
                    :label="$t('columns.prod_status_is_change')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'prod_status_is_change',
                            { initialValue: 0 }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button :value="-1">
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="0"
                            >{{ $t('forms.prod_status_change') }}
                        </a-radio-button>
                        <a-radio-button :value="1"
                            >{{ $t('forms.prod_status_not_change') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="exportReport()"
                >
                    {{ $t('action.export_report') }}
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
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 2000, y: 500 }"
                >
                    <span slot="state_range" slot-scope="text"
                        >{{ text | dict('SaleState') | translate }}
                    </span>
                    <template slot="approve_state" slot-scope="text, row">
                        {{
                            row.approve_state
                                | dict('UnsalableApproveState')
                                | translate
                        }}
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
            >
                <span slot="state_range" slot-scope="text"
                    >{{ text | dict('SaleState') | translate }}
                </span>
                <template slot="approve_state" slot-scope="text, row">
                    {{
                        row.approve_state
                            | dict('UnsalableApproveState')
                            | translate
                    }}
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
import { formConfig } from '@/config/form.config'
import { PublicService } from '@/services/public.service'
import { InnerActionService } from '@/bootstrap/services/inner.action.service'
import GroupbyTable from '~/components/common/groupby-table.vue'
import AutoColumnTable from '~/shared/components/auto-column-table.vue'
import { VendorService } from '../../services/vendor.service'
import { ReportService } from '../../services/report.service'
import moment from 'moment'
import appConfig from '@/config/app.config'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-sale-state-change-report'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductSaleStateChangeReport extends Vue {
    // 表格组件
    // 表格组件
    @Ref()
    readonly dataForm!: DataForm

    @Ref()
    readonly pageContainer!: PageContainer

    @Prop()
    private page_flag

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

    private queryConsition: any = []

    private current = null
    private orderBy: any = ''

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private vendorList

    @datasModule.Action
    private getVendorList

    private columnList: any = []

    private menu_code: any = ''

    private editRow: any = {
        id: null
    }

    private queryUrl: any = '/report/query_product_unsalable_approved_report'

    private vender_data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}

    private yearPickShow = false
    private moment = moment

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private handleOpenChange(status) {
        this.yearPickShow = status
    }

    // 得到年份选择器的值
    private handlePanelChange(value) {
        let values = this.dataForm.getValues()
        values['years'] = value.format('YYYY')
        this.dataForm.setValues(values)
        this.yearPickShow = false
    }

    private get rules() {
        return {}
    }

    private topDepartmentList: any[] = []
    private currentMonth: any = ''
    private monthData: any[] = []

    public created() {
        this.getSystemuser()
        this.getVendorList()
        this.getDepartmentList()

        this.generateMonth()
        this.reportService.query_category_dict(new RequestParams()).subscribe(
            data => {
                this.cateDict = data[0]
                let cateData = data[0]
                for (let i in cateData) {
                    this.fatherCates.push(i)
                }
            },
            error => {
                this.$message.error(error.message)
            }
        )

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
        this.menu_code = CommonService.getMenuCode()
    }

    private onRowClick(row) {
        this.editRow = {
            id: row
        }
    }

    private onGroupbyListChange() {
        this.groupbyList = this.dataForm.checkedGroupbyList
    }

    private generateMonth() {
        var cur_year = new Date().getFullYear()
        var last_year = cur_year - 1
        var cur_month = new Date().getMonth()
        if (cur_month < 10) {
            this.currentMonth = cur_year + '-' + '0' + cur_month.toString()
        } else {
            this.currentMonth = cur_year + '-' + cur_month.toString()
        }
        var month_list = [
            '12',
            '11',
            '10',
            '09',
            '08',
            '07',
            '06',
            '05',
            '04',
            '03',
            '02',
            '01'
        ]
        for (let i of month_list) {
            this.monthData.push({
                code: cur_year.toString() + '-' + i,
                value: cur_year.toString() + '-' + i
            })
        }
        for (let i of month_list) {
            this.monthData.push({
                code: last_year.toString() + '-' + i,
                value: last_year.toString() + '-' + i
            })
        }
    }

    private exportReport() {
        this.dataForm.validateFields().then((values: any) => {
            let sku_type = values['sku_type']
            values[sku_type] = values['sku']
            delete values['sku_type']
            delete values['sku']

            let fuzzy_search_operator = values['fuzzy_search_operator']
            let operator = 'like'
            if (fuzzy_search_operator == 20) {
                operator = '='
            }
            delete values['fuzzy_search_operator']

            let params: any = CommonService.createQueryCondition(values, {
                default_code: operator,
                common_sku: operator,
                z_category: 'like',
                z_sub_category: 'like',
                operator: 'like',
                leader: 'like',
                month:'in',
                final_result:'in',
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
            this.queryConsition = nowConditions
            let query_condition = encodeURI(
                JSON.stringify(params.query_condition)
            )

            window.open(
                appConfig.server +
                    '/product/export_product_sale_state_change_report?query_condition=' +
                    query_condition
            )
        })
    }

    /**
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            let sku_type = values['sku_type']
            values[sku_type] = values['sku']
            delete values['sku_type']
            delete values['sku']

            let fuzzy_search_operator = values['fuzzy_search_operator']
            let operator = 'like'
            if (fuzzy_search_operator == 20) {
                operator = '='
            }
            delete values['fuzzy_search_operator']

            let params: any = CommonService.createQueryCondition(values, {
                default_code: operator,
                common_sku: operator,
                z_category: 'like',
                z_sub_category: 'like',
                operator: 'like',
                leader: 'like',
                month:'in',
                final_result:'in',                
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

            for (let i of nowConditions) {
                if (i.query_name == 'unsalable_judgment') {
                    i.operate =
                        i.value == 'null'
                            ? 'null'
                            : i.value == 'not_null'
                            ? 'not null'
                            : '='
                    if (i.operate != '=') {
                        i.value = ''
                    }
                }
            }

            this.queryConsition = nowConditions

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

    private handleFatherCateChange(value) {
        this.sonCates = this.cateDict[value]
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
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "apply_discount": "Apply For Discount",
            "save": "Save",
            "approve": "Approve",
            "null": "Null",
            "importUnsaleable": "Import",
            "directApprove":"Directly Approve",
            "confirm_cancel": "Are you sure aprrove?",
            "ok": "Ok",
            "cancel": "Cancel",
            "export_report": "Export Report"            
        },
        "columns": {
            "cn_sub_category": "CN Category",
            "z_category": "Category",
            "z_sub_category": "Sub Category",
            "warehouse_id": "Warehouse",
            "year": "Year",
            "month": "Month",
            "week": "Week",
            "order_id": "Order No.",
            "contact_no": "Contact No.",
            "default_code": "Default Code",
            "operator": "Operator",
            "is_need_manual_intervetion": "Need Manual Intervetion",
            "origin_prod_status": "Product Origin State",
            "final_result": "Final Result",
            "approve_state": "Approve State",
            "unsalable_judgment": "Unsalable Judgment",
            "leader": "Leader",
            "final_result": "Product Changed State",
            "prod_status_is_change": "Origin Data Compare State"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search",
            "sku": "SKU",
            "common_sku": "Common SKU",
            "base_sku": "Base SKU",
            "yes": "Yes",
            "no": "No",
            "prod_status_change": "Status Changed",
            "prod_status_not_change": "Status Not Changed"            
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
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "apply_discount": "折扣申请",
            "save": "保存",
            "approve": "审批",
            "null": "无",
            "importUnsaleable": "导入",
            "directApprove":"一键审批",
            "confirm_cancel": "确认审批吗?",
            "ok": "确认",
            "cancel": "取消",
            "export_report": "下载当前变更报表"
        },
        "columns": {
            "cn_sub_category": "中文分类",
            "z_category": "二级分类",
            "z_sub_category": "三级分类",
            "warehouse_id": "仓库",
            "year": "年度",
            "month": "月度",
            "week": "周次",
            "order_id": "订单号",
            "contact_no": "合同号",
            "default_code": "货号",
            "operator": "运营",
            "is_need_manual_intervetion": "是否需要人工干预",
            "origin_prod_status": "产品原状态",
            "final_result": "最终结果",
            "approve_state": "审批状态",
            "unsalable_judgment": "该月滞销判断(运营)",
            "leader": "运营主管",
            "final_result": "产品变更后状态",
            "prod_status_is_change": "原数据对比状态"            
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询",
            "sku": "货号",
            "common_sku": "通用货号",
            "base_sku": "基础货号",
            "yes": "是",
            "no": "否",
            "prod_status_change": "状态变更数据",
            "prod_status_not_change": "状态未变更数据"            
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功"
    }
}
</i18n>
