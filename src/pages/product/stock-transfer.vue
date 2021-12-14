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
                <a-form-item label="SKU" style="height:35px;margin:0;">
                    <a-input
                        :placeholder="$t('split_query_condition')"
                        v-decorator="['default_code']"
                        style="width:240px;"
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
                        :style="{ width: '100px' }"
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
                        :style="{ width: '240px' }"
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
                    :label="$t('columns.src_department')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['src_dept_id']"
                        :style="{ width: '240px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        :filterOption="filterSelectOption"
                        :placeholder="$t('plzSelect')"
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
                <a-form-item
                    :label="$t('columns.dst_department')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        showSearch
                        v-decorator="['dest_dept_id']"
                        :style="{ width: '340px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        :filterOption="filterSelectOption"
                        :placeholder="$t('plzSelect')"
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
                <a-form-item
                    :label="$t('columns.status')"
                    style="height:35px;margin:0;"
                >
                    <a-select
                        v-decorator="['status']"
                        :style="{ width: '240px' }"
                        :dropdown-match-select-width="false"
                        :dropdown-style="{ width: '200px' }"
                        :placeholder="$t('plzSelect')"
                        :filterOption="filterSelectOption"
                        size="small"
                    >
                        <a-select-option value>
                            {{ $t('dict.all') }}
                        </a-select-option>
                        <a-select-option :key="10" :value="10">
                            草稿
                        </a-select-option>
                        <a-select-option :key="50" :value="50">
                            确认
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </template>
            <template #action>
                <a-button type="primary" @click="onCreate(0)"
                    >{{ $t('action.add_stock_transfer') }}
                </a-button>
                <a-button type="primary" @click="onCreate(1)"
                    >{{ $t('action.edit_stock_transfer') }}
                </a-button>
                <a-button type="primary" @click="confirmTransferSKU()"
                    >{{ $t('action.confirm_transfer_sku') }}
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
                    <template slot="status_render" slot-scope="text">
                        {{ text | dict('PredictStatus') | translate }}
                    </template>
                    <template slot="user_render" slot-scope="text">
                        {{ text | dict2(systemUsers) }}
                    </template>
                    <template slot="date_render" slot-scope="text">
                        {{ text | datetolocal }}
                    </template>
                    <span slot="warehouse_render" slot-scope="text">
                        {{ getWarehouseName(text) }}
                    </span>
                    <span slot="split_type_render" slot-scope="text">
                        <span v-if="text == 10">
                            {{ $t('split_type_split') }}</span
                        ><span v-else-if="text == 20">{{
                            $t('split_type_update')
                        }}</span
                        ><span v-else-if="text == 30">{{
                            $t('split_type_multi')
                        }}</span>
                        <span v-else>
                            {{ text }}
                        </span>
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
                <template slot="status_render" slot-scope="text">
                    {{ text | dict('PredictStatus') | translate }}
                </template>
                <template slot="user_render" slot-scope="text">
                    {{ text | dict2(systemUsers) }}
                </template>
                <template slot="date_render" slot-scope="text">
                    {{ text | datetolocal }}
                </template>
                <span slot="warehouse_render" slot-scope="text">
                    {{ getWarehouseName(text) }}
                </span>
                <span slot="split_type_render" slot-scope="text">
                    <span v-if="text == 10"> {{ $t('split_type_split') }}</span
                    ><span v-else-if="text == 20">{{
                        $t('split_type_update')
                    }}</span
                    ><span v-else-if="text == 30">{{
                        $t('split_type_multi')
                    }}</span>
                    <span v-else>
                        {{ text }}
                    </span>
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
import StockTransferEdit from '~/components/product/stock-transfer-edit.vue'
import UUID from 'uuidjs'

const datasModule = namespace('datasModule')

@Page({
    layout: 'workspace',
    name: 'stock-transfer'
})
@Component({
    components: {
        GroupbyTable,
        AutoColumnTable,
        StockTransferEdit
    }
})
export default class StockTransfer extends Vue {
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
    private orderBy: any = 'id desc'

    @datasModule.State
    private systemUsers

    @datasModule.Action
    private getSystemuser

    @datasModule.State
    private departmentList

    @datasModule.Action
    private getDepartmentList

    private columnList: any = []

    private queryUrl: any =
        'warehouse_management/query_all_stock_transfer_record'

    private vender_data: any[] = []
    private fatherCates: any = []
    private sonCates: any = []
    private cateDict: any = {}
    private selectedList: any = []

    private warehouseList: any[] = []

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

        this.innerAction.setActionAPI(
            'common_management/query_all_warehouse_location',
            CommonService.getMenuCode()
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
                    this.warehouseList = data
                },
                err => {
                    this.$message.error(err.message)
                }
            )
    }

    private mounted() {
        this.groupbyList = this.dataForm.checkedGroupbyList
        this.columnList = this.dataForm.tableColumns
        this.allNameAuth = this.dataForm.queryNameAuth
    }

    private onCreate(editMode) {
        let save_flag: any = 0
        let curData: any = {}

        if (editMode && this.selectedRowKeys.length == 0) {
            this.$message.info('请选择一条记录编辑')
            return
        }

        if (this.selectedRowKeys.length > 1 && editMode) {
            this.$message.info('只能选择一条记录编辑')
            return
        } else if (editMode) {
            save_flag = 1
            curData = this.data.find(x => x.index == this.selectedRowKeys[0])

            if (curData && curData.status == 50) {
                this.$message.info('已经确认转移库存无法修改')
                return
            }
        }

        let title = '新增部门库存转移'
        if (editMode == 1) {
            title = '编辑部门库存转移'
        }

        this.$modal
            .open(
                StockTransferEdit,
                {
                    saveFlag: save_flag,
                    curData: curData,
                    departmentList: this.topDepartmentList,
                    warehouseList: this.warehouseList
                },
                {
                    title: title,
                    width: '390px'
                }
            )
            .subscribe(values => {
                this.innerAction.setActionAPI(
                    'warehouse_management/save_stock_transfer_record',
                    CommonService.getMenuCode()
                )
                this.publicService
                    .modify(
                        new RequestParams(values, {
                            page: this.pageService,
                            loading: this.loadingService,
                            innerAction: this.innerAction
                        })
                    )
                    .subscribe(
                        data => {
                            let msg: any = this.$t('tips.save_success')
                            this.getDataList()
                        },
                        err => {
                            this.$message.error(err.message)
                        }
                    )
            })
    }

    private confirmTransferSKU() {
        let ids: any[] = []
        if (this.selectedRowKeys.length == 0) {
            this.$message.info('请选择一条记录进行确认')
            return
        }

        for (let index of this.selectedRowKeys) {
            let row = this.data.find(x => x.index == index)
            if (row) {
                if (row.status == 50) {
                    this.$message.info('存在已经确认数据！！！')
                    return
                }

                ids.push(row.id)
            }
        }

        this.innerAction.setActionAPI(
            'warehouse_management/transfer_stock_quant',
            CommonService.getMenuCode()
        )
        this.publicService
            .modify(
                new RequestParams(
                    { record_id_list: ids },
                    {
                        page: this.pageService,
                        loading: this.loadingService,
                        innerAction: this.innerAction
                    }
                )
            )
            .subscribe(
                data => {
                    let msg: any = this.$t('tips.save_success')
                    this.getDataList()
                },
                err => {
                    this.$message.error(err.message)
                }
            )
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

            let params: any = CommonService.createQueryCondition(values, {
                default_code: 'in_or_=',
                z_sub_category: 'in',
                src_dept_id: 'in',
                dest_dept_id: 'in',
                ...formConfig.condition
            })

            if (this.groupbyList.length) {
                let groupbyTable: any = this.$refs.groupbyTable
                groupbyTable.getFirstTableData(params.query_condition)
            } else {
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

    private getWarehouseName(whs_id) {
        let ret: any = whs_id
        let item = this.warehouseList.find(x => x.code == whs_id)
        if (item) {
            ret = item.name
        }
        return ret
    }
}
</script>

<i18n>
{
    "en-us": {
        "desc": "this is a Order Page1",
        "action": {
            "add_stock_transfer": "Add",
            "edit_stock_transfer": "Edit",
            "confirm_transfer_sku": "Confirm"
        },
        "columns": {
            "src_department": "Source Department",
            "dst_department": "Destion Department"
        },
        "delete": "Are you sure delete?",
        "split_type_split": "Split Line",
        "split_type_update": "Update Line",
        "split_type_multi": "Multi Line"
    },
    "zh-cn": {
        "desc": "这是订单页面1",
        "action": {
            "add_stock_transfer": "添加",
            "edit_stock_transfer": "编辑",
            "confirm_transfer_sku": "确认"
        },
        "columns": {
            "src_department": "来源部门",
            "dst_department": "目标部门"
        },
        "delete": "是否确认删除?",
        "split_type_split": "拆分",
        "split_type_update": "更新",
        "split_type_multi": "多条"
    }
}
</i18n>
