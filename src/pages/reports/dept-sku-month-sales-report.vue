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
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        style="width:200px;"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['z_category', { initialValue: '' }]"
                        :style="{ width: '90px' }"
                        @change="handleFatherCateChange"
                        placeholder="Please Select"
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
                        v-model="selectedList"
                        :style="{ width: '180px' }"
                        placeholder="Please Select"
                        v-decorator="['z_sub_category', { initialValue: '' }]"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
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
                    :label="$t('columns.order_month')"
                    style="height:35px;margin:0;"
                >
                    <a-month-picker
                        v-decorator="['order_month', { rules: rules.required }]"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.month_sales_more_50')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="[
                            'month_sales_more_50',
                            { initialValue: '' }
                        ]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button :value="true">
                            {{ $t('yes') }}
                        </a-radio-button>
                        <a-radio-button :value="false">
                            {{ $t('no') }}
                        </a-radio-button>
                    </a-radio-group>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.department')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['dept_id']"
                        :style="{ width: '180px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        :filterOption="filterSelectOption"
                        size="small"
                        mode="multiple"
                        allowClear
                    >
                        <a-select-option
                            v-for="i of topDepartmentList"
                            :key="i.id"
                            :value="i.id"
                            :title="i.dept_name"
                        >
                            {{ i.dept_name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <!--操作行为项-->
            <template #action>
                <a-button
                    type="primary"
                    :disabled="!selectedRowKeys.length"
                    @click="updateSKUPurchaseStatus()"
                >
                    {{ $t('action.updateSKUPurchaseStatus') }}
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
                        }
                    "
                    @tbchange="onTableChange"
                    :scroll="{ x: 800, y: 500 }"
                >
                    <span slot="department_render" slot-scope="text">
                        {{ getDepartName(text) }}
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
                <span slot="department_render" slot-scope="text">
                    {{ getDepartName(text) }}
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
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'dept-sku-month-sales-report'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class DeptSKUMonthSalesReport extends Vue {
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

    private topDepartmentList: any[] = []

    private current = null
    private orderBy: any = 'three_month_sales desc'

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private columnList: any = []

    private queryUrl: any = 'reports/query_all_dept_sku_month_sale'

    private vender_data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private get rules() {
        return {}
    }

    public created() {
        this.getSystemuser()

        this.getDepartmentList()

        this.topDepartmentList = this.departmentList.filter(
            x => x.dept_type == 30
        )

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
     * 获取数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            if (values['z_category']) {
                delete values['z_category']
            }

            if (this.selectedList.length > 0) {
                values['z_sub_category'] = this.selectedList
            }

            let sale_data_operator = '<'
            if (values['month_sales_more_50'] !== '') {
                values['bp_sale_num'] = 50

                if (values['month_sales_more_50']) {
                    sale_data_operator = '>='
                }

                delete values['month_sales_more_50']
            }

            if (values['order_month']) {
                values['order_month'] = values['order_month'].format('YYYY-MM')
            }

            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_=',
                z_sub_category: 'in',
                bp_sale_num: sale_data_operator,
                dept_id: 'in',
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

                            this.data = this.data.map(x => {
                                x.index = UUID.generate()
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

    private getDepartName(department) {
        let ret: any = department
        let item = this.departmentList.find(x => x.id == department)
        if (item) {
            ret = item.dept_name
        }
        return ret
    }

    private updateSKUPurchaseStatus() {
        if (!this.selectedRowKeys.length) {
            this.$message.info('请选择数据行')
            return
        }

        let params: any = []
        for (let index of this.selectedRowKeys) {
            let find_data = this.data.find(x => x.index == index)

            if (find_data) {
                params.push({
                    sku: find_data.default_code,
                    dept_id: find_data.dept_id
                })
            }
        }

        if (!params.length) {
            this.$message.info('请选择数据行')
            return
        }

        this.innerAction.setActionAPI(
            'reports/update_dept_sku_purchase_status',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { purchase_status: params },
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
            "replenish_split": "ReplenishSplit",
            "add_replenishment_contract": "Add Replenishment Contract",
            "purchase_return": "Purchase Return",
            "updateSKUPurchaseStatus": "Update Purchase Status As Separate Purchase"
        },
        "columns": {
            "z_sub_category": "Sub Category",
            "vendor_id": "Vendor",
            "order_month": "Month",
            "month_sales_more_50": "Month Sale more than 50"
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
            "replenish_split": "拆分补货需求",
            "return_purchase": "退回补货",
            "add_replenishment_contract": "新建采购合同",
            "purchase_return": "退回补货",
            "updateSKUPurchaseStatus": "更新产品补货状态为独立补货"
        },
        "columns": {
            "z_sub_category": "中文子类",
            "vendor_id": "供应商",
            "order_month": "月份",
            "month_sales_more_50": "月销量大于50"
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
