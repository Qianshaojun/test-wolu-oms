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
                    :label="$t('forms.quick_search')"
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
                            {{ $t('columns.package_name') }}
                        </a-select-option>
                        <a-select-option :value="20">
                            {{ $t('columns.ship_name') }}
                        </a-select-option>
                        <a-select-option :value="30">
                            {{ $t('columns.real_pre_purchase_order') }}
                        </a-select-option>
                        <a-select-option :value="40">
                            {{ $t('columns.sku') }}
                        </a-select-option>
                        <a-select-option :value="50">
                            {{ $t('columns.common_sku') }}
                        </a-select-option>
                        <a-select-option :value="60">
                            {{ $t('columns.purchase_name') }}
                        </a-select-option>
                    </a-select>
                    <a-input
                        v-decorator="['fuzzy_search_value']"
                        :style="{ width: '195px', 'margin-left': '5px' }"
                        size="small"
                    ></a-input>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.create_date')"
                    style="height:35px;margin:0;"
                >
                    <a-range-picker
                        show-time
                        v-decorator="['create_date']"
                        format="YYYY-MM-DD HH:mm"
                        size="small"
                    />
                </a-form-item>
                <a-form-item
                    :label="$t('columns.exception_status')"
                    style="height:35px;margin:0;"
                >
                    <a-radio-group
                        v-decorator="['exception_status', { initialValue: '' }]"
                        size="small"
                        :style="{ height: '20px' }"
                        buttonStyle="solid"
                    >
                        <a-radio-button value>
                            {{ $t('dict.all') }}
                        </a-radio-button>
                        <a-radio-button
                            :value="item.value"
                            v-for="item of $dict.PurchasePriceChangeReportStatus"
                            :key="item.value"
                            >{{ $t(item.label) }}</a-radio-button
                        >
                    </a-radio-group>
                </a-form-item>
            </template>
            <template #action>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onMarkHandled(20)"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.mark_handled') }}
                </a-button>
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onMarkHandled(30)"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.mark_changed_price') }}
                </a-button>
                <!-- <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onMarkHandled(10)"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.mark_pre_handled') }}
                </a-button> -->
                <a-button
                    type="primary"
                    style="margin-left: 2px"
                    @click="onMarkHandled(40)"
                    :disabled="!selectedRowKeys.length"
                >
                    {{ $t('action.mark_no_handled') }}
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
                    <template slot="state_render" slot-scope="text">
                        {{
                            text
                                | dict('PurchasePriceChangeReportStatus')
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
                <template slot="state_render" slot-scope="text">
                    {{
                        text
                            | dict('PurchasePriceChangeReportStatus')
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
import { ReportService } from '../../services/report.service'
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'purchase-price-change-report'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable
    }
})
export default class ProductVendorReport extends Vue {
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

    private reportService = new ReportService()

    private innerAction = new InnerActionService()
    private publicService = new PublicService()

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

    private queryUrl: any = '/report/query_purchase_price_change'

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
                let search_field_name = 'package_name'

                switch (fuzzy_search_code) {
                    case 10:
                        search_field_name = 'package_name'
                        break
                    case 20:
                        search_field_name = 'ship_name'
                        break
                    case 30:
                        search_field_name = 'real_pre_purchase_order'
                        break
                    case 40:
                        search_field_name = 'sku'
                        break
                    case 50:
                        search_field_name = 'common_sku'
                        break
                    case 60:
                        search_field_name = 'purchase_name'
                        break
                    default:
                        search_field_name = 'package_name'
                }

                values[search_field_name] = fuzzy_search_value
            }

            delete values['fuzzy_search_value']
            delete values['fuzzy_search_code']

            let params: any = CommonService.createQueryCondition(values, {
                package_name: '=',
                ship_name: '=',
                real_pre_purchase_order: '=',
                sku: '=',
                common_sku: '=',
                purchase_name: '=',
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
                            this.data = data.map(x => {
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

    private onMarkHandled(type) {
        if (!this.selectedRowKeys.length) {
            this.$message.error('请先选择要标记的列')
            return
        }
        this.innerAction.setActionAPI(
            'report_management/update_purchase_price_change_state',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    {
                        exception_status: type,
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
                    this.$message.success('Succeess')
                    this.getDataList()
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
            "mark_handled": "Mark to Handled",
            "mark_no_handled": "Mark to No Handled",
            "mark_pre_handled": "Mark to Pre Handled",
            "mark_changed_price": "Mark Changed Price"
        },
        "columns": {
            "package_name": "Package Name",
            "ship_name": "Ship Name",
            "real_pre_purchase_order": "real_pre_purchase_order",
            "sku": "Sku",
            "common_sku": "Common Sku",
            "purchase_name": "Purchase Name",
            "create_date": "Package Create Date",
            "exception_status": "Exception Status"
        },
        "rules": {
            "date_range_error": "start date can't later start date"
        },
        "delete": "Are you sure delete?",
        "cancel": "Are you sure cancel?",
        "fuzzy_search": "Fuzzy Search",
        "save_success": "Save Success",
        "delete_success": "Delete Success",
        "forms": {
            "quick_search": "Quick Search",
            "operator_like": "Fuzzy Search",
            "operator_equal": "Match Search",
            "operator_list": "Multi Search"
        }
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
            "mark_handled": "标记已处理",
            "mark_no_handled": "标记已忽略",
            "mark_pre_handled": "标记未处理",
            "mark_changed_price": "标记已调价"
        },
        "columns": {
            "package_name": "货柜号",
            "ship_name": "发货合同号",
            "real_pre_purchase_order": "外箱合同号",
            "sku": "Sku",
            "common_sku": "通用Sku",
            "purchase_name": "采购合同号",
            "create_date": "货柜创建时间",
            "exception_status": "处理状态"
        },
        "rules": {
            "date_range_error": "开始日期不能大于结束日期"
        },
        "delete": "是否确认删除?",
        "cancel": "是否确认取消?",
        "fuzzy_search": "模糊搜索",
        "save_success": "操作成功",
        "delete_success": "删除成功",
        "forms": {
            "quick_search": "快速查找",
            "operator_like": "模糊查找",
            "operator_equal": "精确查找",
            "operator_list": "批量查询"
        }
    }
}
</i18n>
