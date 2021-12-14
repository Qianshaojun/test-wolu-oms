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
                    :label="$t('columns.vendor_id')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['vendor_id', { initialValue: '' }]"
                        :style="{ width: '200px' }"
                        size="small"
                        placeholder="Please select"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option
                            v-for="item of vender_data"
                            :key="item.code"
                            :value="item.code"
                        >
                            {{ item.name }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['z_category', { initialValue: '' }]"
                        :style="{ width: '200px' }"
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
                        >
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
                <a-form-item
                    :label="$t('columns.z_sub_category')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-model="selectedList"
                        :style="{ width: '200px' }"
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
                        <a-select-option v-for="cate in sonCates" :key="cate">
                            {{ cate }}
                        </a-select-option>
                    </a-select>
                </a-form-item>
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
                    <template slot="warehouse_render" slot-scope="text">
                        <span v-if="text == 'de'">DE</span>
                        <span v-else-if="text == 'uk'">UK</span>
                        <span v-else>{{ text }}</span>
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
                <template slot="warehouse_render" slot-scope="text">
                    <span v-if="text == 'de'">DE</span>
                    <span v-else-if="text == 'uk'">UK</span>
                    <span v-else>{{ text }}</span>
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

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'product-vendor-report'
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

    private queryUrl: any = 'report_management/query_all_product_vendor_report'

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
     * 获取订单数据
     */
    private getDataList() {
        this.dataForm.validateFields().then((values: any) => {
            if (this.selectedList.length > 0) {
                values['z_sub_category'] = this.selectedList
            }

            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_=',
                z_sub_category: 'in',
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
            "purchase_return": "Purchase Return"
        },
        "columns": {
            "z_sub_category": "Sub Category",
            "vendor_id": "Vendor"
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
            "purchase_return": "退回补货"
        },
        "columns": {
            "z_sub_category": "中文子类",
            "vendor_id": "供应商"
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
